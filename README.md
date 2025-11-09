# SkyProperties - Property Management & Marketplace Web App

A comprehensive bilingual (English/Arabic) web application for managing real estate properties and serving as a marketplace for selling and renting property units.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS with custom theme
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Authentication
- **3D Visualization**: React Three Fiber (for GLB models)
- **Routing**: React Router
- **Localization**: react-i18next (English/Arabic with RTL support)
- **UI Components**: Custom components with lucide-react icons
- **Animations**: Framer Motion

## Features

### User Roles

1. **Admin** - Full control over all modules
2. **Property Manager** - Manage properties and units
3. **Owner** - Manage owned units and post listings
4. **Tenant** - View and pay rent, request maintenance
5. **Service Provider** - Receive and complete service tickets
6. **Guest** - Browse properties without authentication

### Core Functionality

- **Property Management**: CRUD operations for properties with 3D building models
- **Unit Management**: Manage individual units with media, blueprints, and 3D models
- **Ticketing System**: Maintenance request and service provider assignment
- **Payment Management**: Track rent, fees, commissions, and sales
- **Guest Requests**: Capture leads from unauthenticated visitors
- **Analytics Dashboard**: System-wide statistics and insights
- **Bilingual Support**: English and Arabic with RTL layout
- **Dark/Light Mode**: Theme switching with system preference detection

## Firebase Configuration

**✅ Firebase is now fully configured!** The application is ready to use with:

- **Firebase Authentication** - Email/password authentication
- **Cloud Firestore** - Real-time database for all app data
- **Firebase Storage** - File storage for images, videos, and 3D models
- **Firebase Cloud Functions** - Server-side operations with Admin SDK
- **Firebase Analytics** - User behavior tracking

### What's Included

1. **Frontend Configuration**: All Firebase credentials are set up in `src/services/firebase.js`
2. **Backend Functions**: Cloud Functions with Admin SDK in the `functions/` directory
3. **Security Rules**: Firestore and Storage security rules are configured
4. **API Service Layer**: Ready-to-use API client in `src/services/api.js`

### Quick Start

```bash
# Install all dependencies
npm install
cd functions && npm install && cd ..

# Start local development with emulators
firebase emulators:start
```

In another terminal:
```bash
npm run dev
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components (Header)
│   ├── property/        # Property-specific components
│   └── admin/           # Admin-specific components
├── contexts/
│   ├── AuthContext.jsx  # Authentication state management
│   └── ThemeContext.jsx # Theme state management
├── pages/
│   ├── auth/            # Login, Register pages
│   ├── admin/           # Admin panel pages
│   └── dashboard/       # User dashboard
├── services/
│   ├── firebase.js      # Firebase configuration
│   └── i18n.js          # Localization setup
├── locales/
│   ├── en.json          # English translations
│   └── ar.json          # Arabic translations
├── styles/
│   └── index.css        # Global styles
└── utils/
    └── cn.js            # Utility functions
```

## Admin Panel Features

The admin panel (`/admin` route) includes full CRUD functionality for:

1. **User Management**
   - View all users
   - Edit user details and roles
   - Delete users
   - Search and filter users

2. **Property Management**
   - Add/edit/delete properties
   - Upload 3D building models (GLB files)
   - Upload property thumbnails
   - Assign property managers

3. **Unit Management**
   - Add/edit/delete units
   - Set rent and sale values
   - Upload blueprints and media
   - Manage unit status (available, occupied, for rent, for sale)

4. **Ticket Management**
   - View all maintenance tickets
   - Update ticket status
   - Assign service providers

5. **Payment Management**
   - View all payment transactions
   - Track revenue and fees

6. **Guest Requests**
   - View inquiries from guests
   - Update request status
   - Contact information for follow-up

7. **Analytics**
   - System-wide statistics
   - Total properties, units, tickets, revenue

8. **System Settings**
   - Configure commission rates
   - Set service fees
   - Update contact information

## Default User Roles

When registering, users can select from:
- **Owner**: Property owner role
- **Tenant**: Tenant role
- **Service Provider**: Service provider role

Admin and Manager roles must be assigned by an existing admin through the admin panel.

## Language Support

The app supports English and Arabic with full RTL (right-to-left) layout support for Arabic.

Toggle language using the globe icon in the header. Language preference is saved in localStorage.

## Theme Support

Toggle between light and dark mode using the sun/moon icon in the header.

Theme preference is saved in localStorage and applied automatically on subsequent visits.

## Cloud Functions & Backend

The application includes Firebase Cloud Functions for admin operations:

### Available Endpoints

**User Management** (`/userManagement`)
- `POST /create-admin` - Create new admin users
- `POST /update-user-role` - Update user roles
- `DELETE /delete-user/:userId` - Delete users
- `GET /users` - List all users with filtering

**Analytics** (`/analytics`)
- `GET /system-stats` - Get system-wide statistics
- `GET /revenue-report` - Generate revenue reports

All endpoints require Firebase Authentication tokens.

## Important Notes

- **Firebase Configured**: All Firebase services are set up and ready to use
- **Security Rules**: Firestore and Storage rules are configured for production
- **Admin SDK**: Backend functions use Firebase Admin SDK for privileged operations
- **No Dummy Data**: The application starts with empty collections
- **Admin Creation**: First user must be set as admin in Firebase Console

## Creating Your First Admin User

1. Register a new account through the app
2. Go to Firebase Console > Firestore Database
3. Find the `users` collection
4. Locate your user document
5. Edit the `role` field to `"admin"`
6. Log out and log back in to access the admin panel

## Security Rules

✅ **Security rules are already configured!**

- **Firestore Rules**: See `firestore.rules` for complete database security
- **Storage Rules**: See `storage.rules` for file upload security

Key security features:
- Role-based access control (Admin, Manager, Owner, Tenant, Service Provider)
- Public read for properties and units (guest browsing)
- Authenticated write operations with role verification
- File size and type validation for uploads
- User data isolation and privacy protection

Deploy rules with: `firebase deploy --only firestore:rules,storage:rules`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary and confidential
