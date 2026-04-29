# Firebase & Google Sign-In Setup Guide

## 📋 What's Included

This template includes everything you need to integrate Firebase Firestore and Google Sign-In:

- **Firebase Configuration** - Ready-to-use Firebase initialization
- **Authentication** - Google Sign-In with popup flow
- **Firestore Utilities** - Helper functions for CRUD operations
- **Auth Context** - React context for managing user state
- **UI Components** - Pre-built sign-in and profile components

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Google Sign-In:
   - Go to **Authentication** → **Sign-in method**
   - Enable **Google** provider
   - Add your domain to authorized domains
4. Enable Firestore:
   - Go to **Firestore Database**
   - Click **Create Database**
   - Start in test mode (update security rules for production!)

### Step 3: Get Your Firebase Credentials

1. In Firebase Console, click the settings icon → **Project Settings**
2. Scroll down to **Your apps** section
3. Click on the Web app (or create one)
4. Copy the configuration object

### Step 4: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Fill in your Firebase credentials in `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 5: Run Your Application

```bash
npm run dev
```

Visit `http://localhost:3000` and test the sign-in flow!

## 📁 File Structure

```
src/
├── lib/firebase/
│   ├── config.ts           # Firebase initialization
│   ├── auth.ts             # Google Sign-In functions
│   └── firestore.ts        # Firestore CRUD utilities
├── context/
│   └── AuthContext.tsx     # Auth state management
├── components/auth/
│   ├── GoogleSignInButton.tsx    # Sign-in button
│   └── UserProfile.tsx           # User profile display
└── app/
    ├── page.tsx            # Example page with auth
    └── layout.tsx          # Root layout with AuthProvider
```

## 🔐 Usage Examples

### Using Authentication in Components

```tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export default function MyComponent() {
  const { user, loading, error } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {user ? (
        <p>Welcome, {user.displayName}!</p>
      ) : (
        <GoogleSignInButton />
      )}
    </div>
  );
}
```

### Using Firestore in Components

```tsx
import { addDocument, getDocuments, updateDocument } from "@/lib/firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export default function DataComponent() {
  const { user } = useAuth();

  const addItem = async () => {
    if (!user) return;

    const docId = await addDocument("items", {
      title: "My Item",
      userId: user.uid,
      createdAt: new Date(),
    });
    console.log("Document added:", docId);
  };

  const loadItems = async () => {
    const items = await getDocuments("items");
    console.log("Items:", items);
  };

  return (
    <div>
      <button onClick={addItem}>Add Item</button>
      <button onClick={loadItems}>Load Items</button>
    </div>
  );
}
```

### Advanced Firestore Queries

```tsx
import { queryDocuments } from "@/lib/firebase/firestore";
import { where } from "firebase/firestore";

const getUserItems = async (userId: string) => {
  const items = await queryDocuments("items", [
    where("userId", "==", userId),
  ]);
  return items;
};
```

## 🔒 Security Notes

### For Development (Current Setup)
- Environment variables are marked as `NEXT_PUBLIC_` - they're exposed to the browser (this is fine for Firebase)
- The default Firestore rules are in **test mode** - anyone can read/write

### For Production

1. **Update Firestore Security Rules:**

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write their own data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }

    // More restrictive example for user-specific data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

2. **Set up environment variables** in your deployment platform (Vercel, etc.)

3. **Configure authorized domains** in Firebase Console

## 📚 Available Functions

### Authentication (`lib/firebase/auth.ts`)
- `signInWithGoogle()` - Sign in with Google
- `signOut()` - Sign out the current user
- `getCurrentUser()` - Get the current user object

### Firestore (`lib/firebase/firestore.ts`)
- `addDocument(collection, data)` - Add a new document
- `getDocuments(collection)` - Get all documents in a collection
- `getDocument(collection, docId)` - Get a single document
- `queryDocuments(collection, constraints)` - Query documents with filters
- `updateDocument(collection, docId, data)` - Update a document
- `deleteDocument(collection, docId)` - Delete a document

### Context Hook (`context/AuthContext.tsx`)
- `useAuth()` - Get current user, loading state, and error

## 🆘 Troubleshooting

### "Firebase app not initialized"
- Make sure `.env.local` is created and has all required variables
- Restart the dev server after adding environment variables

### "CORS error" or "unauthorized domain"
- Add your domain to authorized domains in Firebase Console
- Check that `authDomain` in `.env.local` is correct

### "User not persisting after page refresh"
- This is normal - the `useAuthState` hook from `react-firebase-hooks` handles this automatically
- It will restore the session on page load

### Google Sign-In popup not appearing
- Make sure the app is running on `http://localhost:3000` for development
- Check browser console for error messages
- Verify Google OAuth consent screen is configured in Firebase

## 📖 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Firebase Hooks](https://github.com/csbin/react-firebase-hooks)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## ✅ Next Steps

1. Customize the sign-in button styling
2. Create specific Firestore collections for your data
3. Add user profile editing
4. Implement Firestore rules for production
5. Add more authentication methods (email/password, GitHub, etc.)
