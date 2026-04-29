import admin from "firebase-admin";

// Initialize Firebase Admin
// This uses individual FIREBASE_SERVICE_ACCOUNT_* environment variables
const initializeFirebaseAdmin = () => {
  if (admin.apps.length === 0) {
    // Construct the service account from individual env variables
    const serviceAccount = {
      type: process.env.FIREBASE_SERVICE_ACCOUNT_TYPE,
      project_id: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
      private_key_id: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
      client_email: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
      auth_uri: process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
      token_uri: process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url:
        process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }

  return admin;
};

// Get or initialize admin
export const adminApp = initializeFirebaseAdmin();
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

export default admin;
