import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const createUserDocument = functions.auth
  .user()
  .onCreate(async (user) => {
    try {
      const newUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        providerData: user.providerData,
      };
      const userRef = db.collection("users").doc(user.uid); // Declare and initialize userRef
      await userRef.set(newUser);
      console.log(`User ${user.uid} created`);
    } catch (error) {
      console.error("createUserDocument", error);
    }
  });