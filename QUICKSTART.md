# Quick Start Guide - SkyProperties

Get your SkyProperties application running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Firebase CLI: `npm install -g firebase-tools`

## Step 1: Install Dependencies (2 minutes)

```bash
# Install frontend dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

## Step 2: Start Firebase Emulators (1 minute)

```bash
firebase login
firebase emulators:start
```

You should see:
```
✔  All emulators ready! It is now safe to connect your app.
┌────────────────┬──────────────┬─────────────────────────────────┐
│ Emulator       │ Host:Port    │ View in Emulator UI             │
├────────────────┼──────────────┼─────────────────────────────────┤
│ Authentication │ 0.0.0.0:9099 │ http://localhost:4000/auth      │
│ Functions      │ 0.0.0.0:5001 │ http://localhost:4000/functions │
│ Firestore      │ 0.0.0.0:8080 │ http://localhost:4000/firestore │
│ Storage        │ 0.0.0.0:9199 │ http://localhost:4000/storage   │
└────────────────┴──────────────┴─────────────────────────────────┘
```

## Step 3: Start the Application (1 minute)

Open a new terminal:

```bash
npm run dev
```

The app will open at: **http://localhost:5173**

## Step 4: Create Your First Admin (1 minute)

1. Click "Register" on the landing page
2. Fill in the registration form
3. After registration, open Firebase Emulator UI: **http://localhost:4000**
4. Go to **Firestore** tab
5. Navigate to `users` collection
6. Find your user document
7. Click "Edit" and change `role` field to `"admin"`
8. Log out and log back in

## You're Done! 🎉

Now you can:
- Access the admin panel at `/admin`
- Manage users, properties, units
- View analytics and reports
- Test all Cloud Functions

## Useful URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main application |
| Emulator UI | http://localhost:4000 | Firebase management |
| Firestore | http://localhost:4000/firestore | View database |
| Functions | http://localhost:4000/functions | Test endpoints |
| Auth | http://localhost:4000/auth | View users |

## Quick Commands

```bash
# Build for production
npm run build

# View function logs
firebase functions:log

# Deploy to Firebase
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only rules
firebase deploy --only firestore:rules,storage:rules
```

## What's Next?

1. 📖 Read [README.md](./README.md) for full features
2. 🚀 Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
3. 🔧 See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for configuration details
4. 📝 Review [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) for architecture

## Need Help?

- Check Firebase Emulator UI for data and logs
- View browser console for frontend errors
- Run `firebase functions:log` for backend errors
- See documentation files for detailed guides

## Common Issues

### Emulators won't start
```bash
# Kill any existing emulator processes
pkill -f firebase
firebase emulators:start
```

### Frontend can't connect to functions
- Verify emulators are running
- Check `.env` has correct `VITE_FUNCTIONS_URL`
- Restart the dev server: `npm run dev`

### Permission denied errors
- Make sure you created a user with admin role
- Check Firestore for correct user role
- Verify you're logged in

---

**Ready to build amazing property management features!** 🏢
