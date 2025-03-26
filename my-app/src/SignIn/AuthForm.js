import React, { useState } from 'react';
import { login, register } from './api/auth';

const AuthForm = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState(''); // Added password field
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const credentials = {
        emailOrPhone,
        password
      };
      
      let response;
      if (isLogin) {
        response = await login(credentials);
        console.log('Login successful:', response);
        // Store the token, redirect, etc.
        localStorage.setItem('authToken', response.token);
      } else {
        response = await register(credentials);
        console.log('Registration successful:', response);
        // Optionally auto-login after registration
      }
      
      // Reset form
      setEmailOrPhone('');
      setPassword('');
      
      // TODO: Redirect user or update app state
      
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Log In' : 'Register'}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="emailOrPhone">Email or Phone Number:</label>
          <input
            type="text"
            id="emailOrPhone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Register')}
        </button>
      </form>
      
      <button onClick={() => setIsLogin(!isLogin)} disabled={isLoading}>
        {isLogin ? 'Need to register?' : 'Already have an account?'}
      </button>
    </div>
  );
};

export default AuthForm;