# ShadowFlighSite

## Firestore users report

This repo includes a GitHub Actions workflow at `.github/workflows/firebase-users-report.yml`.

It runs every hour, reads the Firestore `users` collection, generates `users.html`, and commits that file back to `main` when the output changes.

### Required GitHub secret

Add this repository secret before running the workflow:

- `FIREBASE_SERVICE_ACCOUNT`: the full Firebase service account JSON for a service account with Firestore read access

### Manual run

You can also trigger the workflow manually from the GitHub Actions tab with `workflow_dispatch`.
