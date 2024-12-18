import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth} from "./firebase";

export default function SignIn({ onAuthSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailSignIn = async () => {
    setError(""); // Clear errors before new submission
    if (!email.trim() || !password.trim()) {
      setError("Both email and password are required.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleEmailSignIn}>Sign In with Email</button>
      <button onClick={handleGoogleSignIn}>Sign In with Google</button>
    </div>
  );
}
