import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db, hasValidFirebaseConfig } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !hasValidFirebaseConfig) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        if (authUser) {
          let role = 'writer'; // default role
          try {
            if (db) {
              const userDocRef = doc(db, 'users', authUser.uid);
              const userDoc = await getDoc(userDocRef);
              
              if (userDoc.exists()) {
                role = userDoc.data().role || 'writer';
              }
            }
          } catch (e) {
            console.warn("Permission denied when fetching user role, defaulting to writer", e);
          }
          
          setUser({ ...authUser, role });
        } else {
          setUser(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Auth state error:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error subscribing to auth state:", err);
      setLoading(false);
    }
  }, []);

  const login = (email, password) => {
    if (!auth || !hasValidFirebaseConfig) {
      throw new Error("Firebase Authentication is not configured. Please check Vercel environment variables.");
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  };

  const resetPassword = (email) => {
    if (!auth || !hasValidFirebaseConfig) {
      throw new Error("Firebase Authentication is not configured.");
    }
    return sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, resetPassword, loading }}>
      {loading ? (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-slate-400 text-sm">Loading Curos Investing...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


