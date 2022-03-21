// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { useEffect, useState } from 'react';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// create the auth object
const auth = getAuth(app);

// function to signup, returns a promise
function signupUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

// function to login, returns a promise
function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

// function to logout, returns a promise
function logoutUser() {
    return signOut(auth);
}

// function to listen to changes in user
function useAuth() {
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => setCurrentUser(user));

        return () => {
            unsubscribe();
        }
    }, []);


    return currentUser;
}

// Export all the required services
export {
    auth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    signupUser,
    loginUser,
    logoutUser,
    useAuth
};