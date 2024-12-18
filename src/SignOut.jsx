import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export default function SignOut({ onSignOut }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onSignOut();
    } catch (err) {
      console.error("Sign-out error:", err.message);
    }
  };

  return <button className="signout-button" onClick={handleSignOut}>Sign Out</button>;
}
