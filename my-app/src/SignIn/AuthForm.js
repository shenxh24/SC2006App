import React, { useState } from 'react';

const AuthForm = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the form submission, e.g., send data to your backend
    console.log('Submitted:', emailOrPhone);
    // Reset the form
    setEmailOrPhone('');
  };

  return (
    <div>
      <h2>{isLogin ? 'Log In' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="emailOrPhone">Email or Phone Number:</label>
        <input
          type="text"
          id="emailOrPhone"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
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