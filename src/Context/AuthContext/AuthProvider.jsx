import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth'

import axios from 'axios';
import { auth } from '../../Firebase/firebase-init';
// import { createUserWithEmailAndPassword } from 'firebase/auth';

function AuthProvider({ children }) {
    const provider = new GoogleAuthProvider();
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)
    const [selectedPolicy, setselectedPolicy] = useState(null)
    const [quatadata, setquatadata] = useState(null)

    // console.log(user)
    const createrUser = (email, password) => {
        setloading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signin = (email, password) => {
        setloading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    // google login ..................

    const googleLogin = () => {
        return signInWithPopup(auth, provider);
    };
    // logOUt...................

    const logOut = () => {
        setloading(true)
        localStorage.removeItem("token");
        return signOut(auth)
    }
    const updateUser = updatedData => {
        return updateProfile(auth.currentUser, updatedData)
    }



    // forget password.................

    const forgetPassword = ( email)=>{
        sendPasswordResetEmail(auth,email).then(() => {
            // Password reset email sent!
            // ..
        })
            .catch((error) => {
                const errorCode = error.code;
               console.log(errorCode)
                // ..
            });
    }
    // objerb ....................

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
            setuser(currentuser);
            // console.log("User:", currentuser);

            if (currentuser?.email) {
                axios.post("https://server-one-jet-28.vercel.app/jwt", {
                    email: currentuser.email
                })
                    .then(res => {
                        // console.log("JWT stored in cookie", res.data);
                        const token = res.data.token;
                        localStorage.setItem("token", token); // ✅ Store token
                    })
                    .catch(err => {
                        // console.log("jwt error", err);
                    });
            } else {
                // ✅ Remove token on logoutnpm 
                localStorage.removeItem("token");
            }

            setloading(false);
        });

        return () => unsubscribe();
    }, []);


    // console.log(" iuu", selectedPolicy)

    const authInfo = {
        createrUser,
        signin,
        googleLogin,
        user,
        setuser,
        logOut,
        updateUser,
        loading,
        selectedPolicy,
        quatadata,
        setselectedPolicy,
        setquatadata,
        forgetPassword





    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
