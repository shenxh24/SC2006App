import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("✅ Logged in!");
        navigate('/'); // Redirect to landing page after successful login
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("✅ Account created!");
        navigate('/'); // Redirect to landing page after successful registration
      }
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Log In' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">{isLogin ? 'Log In' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need to register?' : 'Already have an account?'}
      </button>
    </div>
  );
};

export default AuthForm;