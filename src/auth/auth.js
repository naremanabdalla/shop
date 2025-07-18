import { auth } from "./firebse"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updatePassword,
    sendEmailVerification,
    verifyPasswordResetCode
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
    return await signInWithPopup(auth, provider);
}
export const doSignOut = () => {
    return auth.signOut();
}
export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email, {
        url: `https://shopping022.netlify.app/reset-password?oobCode=:oobCode`,
        handleCodeInApp: true,
    });
};
export const verifyPasswordReset = (oobCode) => {
    return verifyPasswordResetCode(auth, oobCode);
};
export const confirmPasswordReset = (oobCode, newPassword) => {
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