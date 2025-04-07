import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebase'; // Import necessary functions from firebase.js

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User signed in with Google:', user);
      alert('✅ Logged in with Google!');
      navigate('/'); // Redirect to home or dashboard
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      alert('❌ Failed to sign in with Google.');
    }
  };

  // Handle email/password sign-up
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('✅ Account created!');
      navigate('/'); // Redirect to home or dashboard
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('✅ Logged in!');
      navigate('/'); // Redirect to home or dashboard
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>

      {/* Toggle between login and sign-up */}
      <form onSubmit={isLogin ? handleEmailLogin : handleEmailSignUp}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
      </form>

      {/* Toggle between login and sign-up */}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need to sign up?' : 'Already have an account?'}
      </button>

      {/* Google Sign-In Button */}
      <div>
        <h3>Or Sign In with Google</h3>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AuthForm;
