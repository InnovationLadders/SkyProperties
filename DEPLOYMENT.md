# SkyProperties - Firebase Deployment Guide

This guide will help you deploy the SkyProperties application with Firebase.

## Prerequisites

1. Node.js 18 or later installed
2. Firebase CLI installed globally: `npm install -g firebase-tools`
3. A Firebase project already created (skyproperties-cf5c7)

## Initial Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

### 2. Firebase Login

```bash
firebase login
```

This will open a browser window for you to authenticate with your Google account.

### 3. Verify Project Configuration

Check that your project is correctly configured:

```bash
firebase projects:list
```

You should see `skyproperties-cf5c7` in the list.

## Local Development with Emulators

Firebase Emulators allow you to test your application locally before deploying.

### 1. Start Firebase Emulators

```bash
firebase emulators:start
```

This will start:
- Auth Emulator on port 9099
- Firestore Emulator on port 8080
- Functions Emulator on port 5001
- Storage Emulator on port 9199
- Emulator UI on port 4000

### 2. Run the Frontend

In a separate terminal:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Access Emulator UI

Visit `http://localhost:4000` to access the Firebase Emulator Suite UI where you can:
- View and manage Firestore data
- Monitor Authentication
- Test Cloud Functions
- Manage Storage files

## Deployment

### 1. Deploy Security Rules

Deploy Firestore and Storage security rules:

```bash
firebase deploy --only firestore:rules,storage:rules
```

### 2. Deploy Cloud Functions

```bash
firebase deploy --only functions
```

This will deploy:
- `userManagement` - User management operations
- `analytics` - System analytics and reporting

### 3. Deploy Frontend (Optional)

If you want to use Firebase Hosting:

```bash
# Build the frontend
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### 4. Deploy Everything

To deploy all components at once:

```bash
npm run build
firebase deploy
```

## Configuration

### Environment Variables

#### Frontend (.env)

```
VITE_FUNCTIONS_URL=https://us-central1-skyproperties-cf5c7.cloudfunctions.net
```

For production, update this URL to your deployed Cloud Functions URL.

#### Cloud Functions

The service account credentials are embedded in the code for this project. In a production environment, you should:

1. Store credentials in Firebase Secret Manager:
```bash
firebase functions:secrets:set SERVICE_ACCOUNT
```

2. Update `functions/src/config/admin.js` to read from environment variables

## Creating Your First Admin User

After deployment:

1. Register a new account through the application at `/register`
2. Go to Firebase Console > Firestore Database
3. Find the `users` collection
4. Locate your user document
5. Edit the document and set the `role` field to `"admin"`
6. Log out and log back in

Alternatively, use the Cloud Function once you have an admin user:

```bash
curl -X POST https://us-central1-skyproperties-cf5c7.cloudfunctions.net/userManagement/create-admin \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"securepassword","displayName":"Admin User"}'
```

## Cloud Functions Endpoints

### User Management

- `POST /userManagement/create-admin` - Create a new admin user
- `POST /userManagement/update-user-role` - Update user role
- `DELETE /userManagement/delete-user/:userId` - Delete a user
- `GET /userManagement/users` - List all users (with pagination)

### Analytics

- `GET /analytics/system-stats` - Get system-wide statistics
- `GET /analytics/revenue-report` - Generate revenue report

All endpoints require authentication via Firebase Auth token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

## Firestore Collections Structure

The application uses the following Firestore collections:

- `users` - User profiles and roles
- `properties` - Property listings
- `units` - Individual units within properties
- `tickets` - Maintenance and service tickets
- `payments` - Payment transactions
- `guestRequests` - Inquiries from unauthenticated visitors
- `systemSettings` - Application configuration

## Storage Structure

Firebase Storage is organized as follows:

```
/properties/{propertyId}/
  - images/
  - videos/
  - models/

/units/{unitId}/
  - images/
  - videos/
  - blueprints/
  - models/

/users/{userId}/
  - profile/

/tickets/{ticketId}/
  - attachments/
```

## Security

### Firestore Security Rules

Security rules are defined in `firestore.rules`:
- Public read access for properties and units
- Authenticated users can read their own data
- Admin and Manager roles have elevated permissions
- Write operations are restricted based on role

### Storage Security Rules

Storage rules are defined in `storage.rules`:
- File size limits enforced (images: 10MB, videos: 100MB, models: 50MB)
- Content type validation
- Role-based access control

## Monitoring

### Logs

View Cloud Functions logs:

```bash
firebase functions:log
```

Or view in Firebase Console:
https://console.firebase.google.com/project/skyproperties-cf5c7/functions/logs

### Usage

Monitor usage in Firebase Console:
- Authentication: Number of users, sign-in methods
- Firestore: Read/write operations, storage usage
- Functions: Invocations, execution time, errors
- Storage: File count, bandwidth usage

## Troubleshooting

### Functions Not Deploying

1. Check Node.js version: `node --version` (should be 18 or higher)
2. Clear dependencies and reinstall:
```bash
cd functions
rm -rf node_modules package-lock.json
npm install
cd ..
firebase deploy --only functions
```

### CORS Errors

Ensure your Cloud Functions include CORS headers. The functions in this project use the `cors` package with `origin: true`.

### Authentication Errors

1. Verify the Firebase configuration in `src/services/firebase.js`
2. Check that Email/Password authentication is enabled in Firebase Console
3. Ensure the Auth token is being sent correctly in API requests

### Firestore Permission Errors

1. Deploy the latest security rules: `firebase deploy --only firestore:rules`
2. Verify user roles in the `users` collection
3. Check the Firebase Console Rules playground to test queries

## Production Checklist

- [ ] Update VITE_FUNCTIONS_URL to production URL
- [ ] Move service account credentials to Firebase Secret Manager
- [ ] Enable Firebase App Check for added security
- [ ] Set up custom domain for Firebase Hosting (if using)
- [ ] Configure backup schedule for Firestore
- [ ] Set up monitoring and alerts
- [ ] Review and optimize Firestore indexes
- [ ] Enable Firebase Analytics
- [ ] Configure CORS for production domain
- [ ] Test all Cloud Functions endpoints
- [ ] Verify security rules in production

## Support

For issues or questions:
1. Check Firebase Console for errors and logs
2. Review the Firestore and Storage rules
3. Test with Firebase Emulators locally
4. Check the browser console for frontend errors
