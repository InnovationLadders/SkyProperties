import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  const signUp = async (email, password, userData) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, 'users', result.user.uid), {
      ...userData,
      email,
      createdAt: new Date().toISOString(),
      linkedProperties: [],
      favorites: [],
      language: 'en'
    });

    return result;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const hasRole = (role) => {
    return userProfile?.role === role;
  };

  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  const isManager = () => {
    return userProfile?.role === 'manager';
  };

  const isOwner = () => {
    return userProfile?.role === 'owner';
  };

  const isTenant = () => {
    return userProfile?.role === 'tenant';
  };

  const isProvider = () => {
    return userProfile?.role === 'provider';
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    hasRole,
    isAdmin,
    isManager,
    isOwner,
    isTenant,
    isProvider
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
