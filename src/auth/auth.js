import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, db } from "./firebse"; // Make sure db is exported from firebse.js
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updatePassword,
    sendEmailVerification,
    verifyPasswordResetCode,
    confirmPasswordReset
} from "firebase/auth";

// const auth = getAuth();
export const signup = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
}
export const signin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}
export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        // 1. Sign in with Google
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // 2. Check if user document exists in Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        // 3. If document doesn't exist, create it
        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                name: user.displayName || "Google User",
                email: user.email,
                createdAt: serverTimestamp(),
                favorite: [],
                cart: [],
                uid: user.uid,
                provider: "google" // Track sign-in method
            });
        }

        return user;
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        throw error;
    }
};
export const doSignOut = () => {
    return auth.signOut();
}
export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};
export const verifyPasswordReset = (oobCode) => {
    return verifyPasswordResetCode(auth, oobCode);
};
export const verifyConfirmPasswordReset = (oobCode, newPassword) => {
    return confirmPasswordReset(auth, oobCode, newPassword);
};

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password)
}
export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    })
}