# Firebase Setup - Quick Reference

## Project Information

- **Project ID**: skyproperties-cf5c7
- **Region**: us-central1
- **Storage Bucket**: skyproperties-cf5c7.firebasestorage.app

## What's Already Configured

### ✅ Frontend (Client SDK)
- Location: `src/services/firebase.js`
- Services: Auth, Firestore, Storage, Functions, Analytics
- All API keys and configuration are set

### ✅ Backend (Admin SDK)
- Location: `functions/src/config/admin.js`
- Service account credentials configured
- Admin SDK initialized with full privileges

### ✅ Security Rules
- `firestore.rules` - Database access control
- `storage.rules` - File upload security

### ✅ Cloud Functions
- User Management functions
- Analytics functions
- Authentication middleware
- Role-based access control

### ✅ Configuration Files
- `firebase.json` - Firebase project configuration
- `firestore.indexes.json` - Database indexes
- `.firebaserc` - Project aliases

## File Structure

```
project-root/
├── src/
│   └── services/
│       ├── firebase.js       # Client SDK configuration
│       └── api.js            # Cloud Functions API client
├── functions/
│   ├── src/
│   │   ├── config/
│   │   │   └── admin.js      # Admin SDK configuration
│   │   ├── middleware/
│   │   │   └── auth.js       # Authentication middleware
│   │   ├── users/
│   │   │   └── userManagement.js
│   │   ├── analytics/
│   │   │   └── analytics.js
│   │   └── index.js          # Functions exports
│   └── package.json
├── firestore.rules           # Database security rules
├── storage.rules             # Storage security rules
├── firebase.json             # Firebase configuration
└── .firebaserc               # Project settings
```

## Common Commands

### Development
```bash
# Install dependencies
npm install
cd functions && npm install && cd ..

# Start emulators
firebase emulators:start

# Run frontend
npm run dev
```

### Deployment
```bash
# Build frontend
npm run build

# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### Monitoring
```bash
# View function logs
firebase functions:log

# View specific function logs
firebase functions:log --only userManagement
```

## Environment Variables

### Frontend (.env)
```
VITE_FUNCTIONS_URL=http://localhost:5001/skyproperties-cf5c7/us-central1
```

For production, change to:
```
VITE_FUNCTIONS_URL=https://us-central1-skyproperties-cf5c7.cloudfunctions.net
```

## Firestore Collections

| Collection | Purpose | Access |
|------------|---------|--------|
| users | User profiles and roles | Authenticated users |
| properties | Property listings | Public read, Admin/Manager write |
| units | Individual units | Public read, Admin/Manager write |
| tickets | Maintenance requests | Authenticated users |
| payments | Payment transactions | User's own data + Admin/Manager |
| guestRequests | Visitor inquiries | Admin/Manager only |
| systemSettings | App configuration | Admin only |

## User Roles

| Role | Permissions |
|------|-------------|
| admin | Full system access, can manage all data |
| manager | Manage properties, units, users (limited) |
| owner | Manage owned properties and units |
| tenant | View units, submit tickets, make payments |
| service_provider | View and complete assigned tickets |

## Cloud Functions URLs

### Local Development
- Base URL: `http://localhost:5001/skyproperties-cf5c7/us-central1`
- User Management: `http://localhost:5001/skyproperties-cf5c7/us-central1/userManagement`
- Analytics: `http://localhost:5001/skyproperties-cf5c7/us-central1/analytics`

### Production
- Base URL: `https://us-central1-skyproperties-cf5c7.cloudfunctions.net`
- User Management: `https://us-central1-skyproperties-cf5c7.cloudfunctions.net/userManagement`
- Analytics: `https://us-central1-skyproperties-cf5c7.cloudfunctions.net/analytics`

## Authentication Flow

1. User signs up/logs in via frontend
2. Firebase Auth creates/authenticates user
3. User document created in Firestore `users` collection
4. Frontend stores auth token
5. API requests include token in Authorization header
6. Cloud Functions verify token and check user role
7. Operations executed based on permissions

## Using the API Client

```javascript
import { userManagementAPI, analyticsAPI } from './services/api';

// Create admin user
await userManagementAPI.createAdmin('admin@example.com', 'password', 'Admin Name');

// Update user role
await userManagementAPI.updateUserRole('userId123', 'manager');

// Get system statistics
const stats = await analyticsAPI.getSystemStats();

// Get revenue report
const report = await analyticsAPI.getRevenueReport('2024-01-01', '2024-12-31');
```

## Security Best Practices

1. **Never commit** the service account JSON file to version control
2. **Use environment variables** for sensitive configuration in production
3. **Enable Firebase App Check** for production
4. **Review security rules** regularly
5. **Monitor function usage** and set up alerts
6. **Use HTTPS only** in production
7. **Implement rate limiting** for Cloud Functions
8. **Regular backup** of Firestore data

## Troubleshooting

### Functions Not Working
1. Check that emulators are running: `firebase emulators:start`
2. Verify frontend is using correct Functions URL
3. Check authentication token is being sent
4. Review function logs: `firebase functions:log`

### Permission Denied
1. Deploy latest security rules: `firebase deploy --only firestore:rules`
2. Verify user role in Firestore `users` collection
3. Check authentication state
4. Test with Firebase Console Rules playground

### CORS Errors
1. Functions include CORS headers by default
2. Verify CORS middleware is configured
3. Check allowed origins in production

## Next Steps

1. ✅ Firebase is fully configured
2. 📝 Create your first admin user (see README.md)
3. 🚀 Start building your property management features
4. 📊 Use the admin panel to manage data
5. 🔒 Review security rules before production deployment
6. 📈 Set up Firebase Analytics for user tracking
7. 🔔 Configure Firebase Cloud Messaging (optional)

## Resources

- [Firebase Console](https://console.firebase.google.com/project/skyproperties-cf5c7)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [Storage Security](https://firebase.google.com/docs/storage/security)
