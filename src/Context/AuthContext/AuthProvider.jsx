import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth'

import axios from 'axios';
import { auth } from '../../Firebase/firebase-init';
// import { createUserWithEmailAndPassword } from 'firebase/auth';

function AuthProvider({ children }) {
    const provider = new GoogleAuthProvider();
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)
    const [selectedPolicy, setselectedPolicy] = useState(null)
    const [quatadata, setquatadata] = useState(null)

    console.log(user)
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
        return signOut(auth)
    }
    const updateUser = updatedData => {
        return updateProfile(auth.currentUser, updatedData)
    }




    // objerb ....................

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
            setuser(currentuser);
            console.log("User:", currentuser);
            if (currentuser?.email) {
                // axios.post("http://localhost:3000//jwt", {
                //     email: currentuser?.email
                // }).then(res => {

                // })
            }

            setloading(false);
        });

        return () => unsubscribe(); // ← THIS is correct
    }, []);
    console.log(" ehro fofosdfsndofdfodsf fjdpfsfffffffffffffffffffffffffffffffff  fjdf", selectedPolicy)

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
        setquatadata





    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
