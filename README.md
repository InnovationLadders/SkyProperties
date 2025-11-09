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

### Important Setup Steps

1. **Replace API Keys**: Open `src/services/firebase.js` and replace:
   - `YOUR_API_KEY` with your actual Firebase API key
   - `YOUR_APP_ID` with your actual Firebase App ID

2. **Get Your Firebase Credentials**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `skyproperties-cf5c7`
   - Navigate to Project Settings > General
   - Scroll to "Your apps" section
   - Copy your Web API Key and App ID

### Firebase Services Setup

1. **Firestore Database**:
   - Enable Firestore in your Firebase Console
   - Collections will be created automatically when data is added

2. **Firebase Storage**:
   - Enable Storage in Firebase Console
   - Used for images, videos, and 3D GLB models

3. **Firebase Authentication**:
   - Enable Email/Password authentication
   - Optionally enable Google Sign-in

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

## Important Notes

- **No Dummy Data**: The application starts with empty collections. Use the admin panel to add data.
- **Firebase Only**: This project uses Firebase exclusively - no Supabase or other databases.
- **API Keys Required**: You must add your Firebase API key and App ID before the app will work.
- **Admin Creation**: The first user must be manually set as admin in Firebase Console (Firestore > users collection > set role: "admin").

## Creating Your First Admin User

1. Register a new account through the app
2. Go to Firebase Console > Firestore Database
3. Find the `users` collection
4. Locate your user document
5. Edit the `role` field to `"admin"`
6. Log out and log back in to access the admin panel

## Security Rules

Remember to set up proper Firebase Security Rules for production:

```javascript
// Firestore Rules Example
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId ||
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /properties/{propertyId} {
      allow read: if true; // Public read for guests
      allow write: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }

    // Add more rules for other collections
  }
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary and confidential
