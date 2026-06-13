"use strict";

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const OUTPUT_PATH = path.join(__dirname, "..", "users.html");
const COLLECTION_NAME = "users";

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function getServiceAccount() {
    const rawValue = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!rawValue) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT is not set.");
    }

    try {
        return JSON.parse(rawValue);
    } catch (error) {
        throw new Error(`FIREBASE_SERVICE_ACCOUNT is not valid JSON: ${error.message}`);
    }
}

function normalizeDate(value) {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value.toDate === "function") {
        return value.toDate();
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === "string") {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    if (typeof value === "number") {
        const normalized = value < 1e12 ? value * 1000 : value;
        const parsed = new Date(normalized);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    if (typeof value === "object") {
        if (typeof value._seconds === "number") {
            return new Date(value._seconds * 1000);
        }

        if (typeof value.seconds === "number") {
            return new Date(value.seconds * 1000);
        }
    }

    return null;
}

function formatDate(value) {
    const date = normalizeDate(value);
    return date ? date.toISOString() : "—";
}

function sortUsers(users) {
    return [...users].sort((left, right) => {
        const leftDate = normalizeDate(left.createdAt);
        const rightDate = normalizeDate(right.createdAt);
        const leftTime = leftDate ? leftDate.getTime() : 0;
        const rightTime = rightDate ? rightDate.getTime() : 0;

        if (leftTime !== rightTime) {
            return rightTime - leftTime;
        }

        return left.uid.localeCompare(right.uid);
    });
}

function renderRows(users) {
    if (users.length === 0) {
        return `
                    <tr>
                        <td colspan="4" class="empty-state">No users found in Firestore collection "${escapeHtml(COLLECTION_NAME)}".</td>
                    </tr>`;
    }

    return users
        .map((user) => {
            return `
                    <tr>
                        <td>${escapeHtml(user.uid)}</td>
                        <td>${escapeHtml(user.email || "—")}</td>
                        <td>${escapeHtml(formatDate(user.createdAt))}</td>
                        <td>${escapeHtml(formatDate(user.lastSignInAt))}</td>
                    </tr>`;
        })
        .join("");
}

function renderHtml(users, generatedAt) {
    const lastUpdated = generatedAt.toISOString();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Hourly Firestore users report">
    <title>Firestore Users Report</title>
    <style>
        :root {
            color-scheme: dark;
            --bg: #0f1720;
            --panel: rgba(15, 23, 32, 0.82);
            --panel-strong: rgba(23, 34, 48, 0.95);
            --border: rgba(148, 163, 184, 0.18);
            --text: #e2e8f0;
            --muted: #94a3b8;
            --accent: #f59e0b;
            --accent-soft: rgba(245, 158, 11, 0.16);
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: Arial, sans-serif;
            background:
                radial-gradient(circle at top, rgba(245, 158, 11, 0.2), transparent 32%),
                linear-gradient(180deg, #081018 0%, #0f1720 55%, #131d29 100%);
            color: var(--text);
        }

        main {
            width: min(1120px, calc(100% - 32px));
            margin: 0 auto;
            padding: 48px 0 64px;
        }

        .panel {
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: 20px;
            backdrop-filter: blur(14px);
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
            overflow: hidden;
        }

        .hero {
            padding: 32px;
            background:
                linear-gradient(135deg, rgba(245, 158, 11, 0.12), transparent 55%),
                var(--panel-strong);
            border-bottom: 1px solid var(--border);
        }

        h1 {
            margin: 0 0 12px;
            font-size: clamp(2rem, 4vw, 3rem);
            line-height: 1.05;
        }

        p {
            margin: 0;
        }

        .meta {
            margin-top: 18px;
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            color: var(--muted);
            font-size: 0.95rem;
        }

        .chip {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 14px;
            border-radius: 999px;
            background: var(--accent-soft);
            border: 1px solid rgba(245, 158, 11, 0.22);
            color: #fde68a;
        }

        .table-wrap {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 720px;
        }

        thead {
            background: rgba(148, 163, 184, 0.08);
        }

        th,
        td {
            padding: 16px 20px;
            text-align: left;
            border-bottom: 1px solid var(--border);
            vertical-align: top;
        }

        th {
            color: var(--muted);
            font-size: 0.78rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        tbody tr:hover {
            background: rgba(148, 163, 184, 0.04);
        }

        .empty-state {
            text-align: center;
            color: var(--muted);
            padding: 48px 20px;
        }

        @media (max-width: 720px) {
            main {
                width: min(100% - 20px, 1120px);
                padding: 20px 0 32px;
            }

            .hero {
                padding: 24px;
            }

            th,
            td {
                padding: 14px 16px;
            }
        }
    </style>
</head>
<body>
    <main>
        <section class="panel">
            <div class="hero">
                <p class="chip">Firestore users snapshot</p>
                <h1>Users Report</h1>
                <p>Generated automatically from Firestore collection "${escapeHtml(COLLECTION_NAME)}".</p>
                <div class="meta">
                    <span>Total users: ${users.length}</span>
                    <span>Last updated: ${escapeHtml(lastUpdated)}</span>
                </div>
            </div>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>UID</th>
                            <th>Email</th>
                            <th>Created At</th>
                            <th>Last Sign-In At</th>
                        </tr>
                    </thead>
                    <tbody>${renderRows(users)}
                    </tbody>
                </table>
            </div>
        </section>
    </main>
</body>
</html>`;
}

async function fetchUsers() {
    const snapshot = await admin.firestore().collection(COLLECTION_NAME).get();

    return snapshot.docs.map((doc) => {
        const data = doc.data() || {};

        return {
            uid: doc.id,
            email: data.email || "",
            createdAt: data.createdAt,
            lastSignInAt: data.lastSignInAt
        };
    });
}

async function main() {
    const serviceAccount = getServiceAccount();

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    const users = sortUsers(await fetchUsers());
    const html = renderHtml(users, new Date());

    fs.writeFileSync(OUTPUT_PATH, html, "utf8");

    console.log(`Generated ${OUTPUT_PATH} with ${users.length} users.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
