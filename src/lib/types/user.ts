import type { Timestamp } from "firebase/firestore";

export type UserDocument = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
