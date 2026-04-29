# Firebase & Google Sign-In Setup Guide

## 📋 What's Included

This template includes complete Firebase infrastructure with both client and server-side authentication:

### Client-Side
- **Firebase Configuration** - Ready-to-use Firebase initialization
- **Authentication** - Google Sign-In with popup flow
- **Firestore Utilities** - Helper functions for CRUD operations
- **Auth Context** - React context for managing user state
- **UI Components** - Pre-built sign-in and profile components

### Server-Side
- **Firebase Admin SDK** - Server-side operations with elevated privileges
- **API Middleware** - Token verification for protected routes
- **Protected API Routes** - Example endpoints with authentication
- **Server Actions** - Secure server-side auth verification
- **Route Middleware** - Optional route protection middleware

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

#### Client-side credentials:
1. In Firebase Console, click the settings icon → **Project Settings**
2. Scroll down to **Your apps** section
3. Click on the Web app (or create one)
4. Copy the configuration object

#### Server-side credentials (Firebase Admin):
1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Save the JSON file (keep it secure!)

### Step 4: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Fill in your Firebase credentials in `.env.local`:

```
# Client-side config (from Web app settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Server-side config (from service account key JSON)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

**⚠️ Important:** Never commit `.env.local` to version control!

### Step 5: Run Your Application

```bash
npm run dev
```

Visit `http://localhost:3000` and test the sign-in flow!

## 📁 File Structure

```
src/
├── lib/firebase/
│   ├── config.ts              # Client-side Firebase initialization
│   ├── auth.ts                # Google Sign-In functions
│   ├── firestore.ts           # Client-side Firestore utilities
│   ├── admin.ts               # Server-side Firebase Admin initialization
│   ├── server-auth.ts         # Server-side auth utilities
│   └── api-middleware.ts      # API route auth verification
├── context/
│   └── AuthContext.tsx        # Client-side auth state management
├── components/auth/
│   ├── GoogleSignInButton.tsx # Sign-in button component
│   ├── UserProfile.tsx        # User profile display component
│   └── ProtectedAPIExample.tsx# Example of calling protected APIs
├── app/
│   ├── page.tsx               # Example page with auth
│   ├── layout.tsx             # Root layout with AuthProvider
│   ├── api/
│   │   ├── user/route.ts      # Protected route: GET/POST user data
│   │   └── protected-action/route.ts  # Example protected routes
│   └── middleware.ts          # Optional route middleware
```

## 🔐 Usage Examples

### Client-Side: Using Authentication in Components

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

### Client-Side: Using Firestore

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

### Server-Side: Protected API Routes

#### Example: GET /api/user
Retrieves the authenticated user's profile from Firestore.

```tsx
// src/app/api/user/route.ts
import { NextRequest } from "next/server";
import { verifyAuthToken, authErrorResponse, authSuccessResponse } from "@/lib/firebase/api-middleware";
import { getUserData } from "@/lib/firebase/server-auth";

export async function GET(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (auth.error) {
    return authErrorResponse(auth.error, auth.status);
  }

  const userData = await getUserData(auth.uid!);
  return authSuccessResponse({ uid: auth.uid, user: userData });
}
```

#### Calling Protected APIs from the Client

```tsx
"use client";

import { useAuth } from "@/context/AuthContext";

export function MyComponent() {
  const { user } = useAuth();

  const fetchUserData = async () => {
    const idToken = await user!.getIdToken();
    
    const response = await fetch("/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("User data:", data);
  };

  return <button onClick={fetchUserData}>Get Profile</button>;
}
```

### Server-Side: Advanced Queries

```tsx
import { adminDb } from "@/lib/firebase/admin";

// Query documents with Firestore SDK
const getUserPosts = async (userId: string) => {
  const snapshot = await adminDb
    .collection("posts")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(10)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Batch write operations
const createUserProfile = async (uid: string, userData: any) => {
  const batch = adminDb.batch();
  
  const userRef = adminDb.collection("users").doc(uid);
  batch.set(userRef, {
    ...userData,
    createdAt: new Date(),
  });

  // Add other related documents
  const statsRef = adminDb.collection("user-stats").doc(uid);
  batch.set(statsRef, {
    posts: 0,
    followers: 0,
  });

  await batch.commit();
};
```

## 📚 Available Functions

### Client-Side Authentication (`lib/firebase/auth.ts`)
- `signInWithGoogle()` - Sign in with Google
- `signOut()` - Sign out the current user
- `getCurrentUser()` - Get the current user object

### Client-Side Firestore (`lib/firebase/firestore.ts`)
- `addDocument(collection, data)` - Add a new document
- `getDocuments(collection)` - Get all documents in a collection
- `getDocument(collection, docId)` - Get a single document
- `queryDocuments(collection, constraints)` - Query documents with filters
- `updateDocument(collection, docId, data)` - Update a document
- `deleteDocument(collection, docId)` - Delete a document

### Client-Side Context Hook (`context/AuthContext.tsx`)
- `useAuth()` - Get current user, loading state, and error

### Server-Side Auth Utilities (`lib/firebase/server-auth.ts`)
- `verifyIdToken(token)` - Verify a Firebase ID token
- `getUserFromToken(token)` - Get user details from token
- `getUserData(uid)` - Get user profile from Firestore
- `setUserProfile(uid, data)` - Create/update user profile
- `deleteUser(uid)` - Delete a user (admin only)

### Server-Side Admin SDK (`lib/firebase/admin.ts`)
- `adminAuth` - Firebase Authentication admin instance
- `adminDb` - Cloud Firestore admin instance
- `adminApp` - Firebase Admin app instance

### API Middleware (`lib/firebase/api-middleware.ts`)
- `verifyAuthToken(request)` - Verify auth token from request headers
- `authErrorResponse(message, status)` - Send error response
- `authSuccessResponse(data, status)` - Send success response

## 🔒 Security Notes

### Token Verification
When calling protected API routes from the client, always send the ID token:

```tsx
const idToken = await user.getIdToken();
const response = await fetch("/api/protected", {
  headers: { Authorization: `Bearer ${idToken}` },
});
```

The server will verify the token and extract the user's UID.

### For Development (Current Setup)
- Environment variables marked as `NEXT_PUBLIC_` are exposed to the browser (safe for Firebase)
- Default Firestore rules are in **test mode** - anyone can read/write
- Service account key should never be committed to version control

### For Production

1. **Update Firestore Security Rules:**

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read their own data
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }

    // User posts
    match /posts/{postId} {
      allow read: if true;  // Anyone can read
      allow write: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid;
    }
  }
}
```

2. **Set environment variables** in your deployment platform (Vercel, etc.)

3. **Configure authorized domains** in Firebase Console

4. **Restrict API access:**
   - Use Firebase API key restrictions
   - Implement rate limiting
   - Add request validation

## 🆘 Troubleshooting

### Client-Side Issues

**"Firebase app not initialized"**
- Make sure `.env.local` is created with all required client-side variables
- Restart the dev server after adding environment variables

**"CORS error" or "unauthorized domain"**
- Add your domain to authorized domains in Firebase Console
- Check that `authDomain` in `.env.local` is correct

**"User not persisting after page refresh"**
- This is normal - the `AuthContext` uses `onAuthStateChanged` which automatically restores sessions
- It may take a moment on page load

**"Google Sign-In popup not appearing"**
- Make sure the app is running on `http://localhost:3000` for development
- Check browser console for error messages
- Verify Google OAuth consent screen is configured in Firebase

### Server-Side Issues

**"Invalid or expired token" in API calls**
- Make sure you're sending a fresh ID token: `await user.getIdToken()`
- Tokens expire after 1 hour; refresh with `user.getIdToken(true)` to force refresh
- Check that the token is sent in the correct format: `Authorization: Bearer <token>`

**"Cannot find module 'firebase-admin'"**
- These modules only work on the server (use them in `/api` routes or server actions)
- Don't import these in client components (they won't have access to service account key)

**"Service account key not found"**
- Ensure `FIREBASE_SERVICE_ACCOUNT_KEY` is set in `.env.local`
- Make sure the JSON is properly formatted as a single-line string
- The key should be kept secret - never expose it in client-side code

**Firestore operations not working**
- Check Firestore security rules - they might be blocking the operation
- For development, use test mode (public read/write)
- For production, ensure rules grant appropriate access to authenticated users

## 📖 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## ✅ Next Steps

1. **Test your setup:**
   - Run `npm run dev`
   - Test Google Sign-In
   - Test protected API routes

2. **Customize authentication:**
   - Add email/password sign-in
   - Implement password reset
   - Add social login providers

3. **Build your app:**
   - Create specific Firestore collections
   - Implement user profiles
   - Add real-time subscriptions with listeners

4. **Prepare for production:**
   - Update Firestore security rules
   - Configure Firebase API key restrictions
   - Set up monitoring and analytics
   - Test error handling and edge cases
