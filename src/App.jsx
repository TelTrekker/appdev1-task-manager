import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SignOut from "./SignOut";

function App() {
  const [user, setUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return isSignUp ? (
      <SignUp onAuthSuccess={() => setUser(auth.currentUser)} />
    ) : (
      <SignIn onAuthSuccess={() => setUser(auth.currentUser)} />
    );
  }

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <SignOut onSignOut={() => setUser(null)} />
      <p>Welcome, {user.email}</p>
    </div>
  );
}

export default App;
