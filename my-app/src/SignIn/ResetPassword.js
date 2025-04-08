import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { confirmPasswordReset } from 'firebase/auth';
import { Link } from 'react-router-dom'; // Import Link for navigation

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [oobCode, setOobCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('oobCode');
    if (code) setOobCode(code);
  }, []);

  const handlePasswordReset = async () => {
    try {
      if (password) {
        await confirmPasswordReset(auth, oobCode, password);
        alert('Password has been reset successfully!');
        navigate('/signin');
      } else {
        setError('Please enter a new password.');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      
      <div className="auth-form">
        <label>New Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
          className="auth-input"
        />
        
        <button 
          onClick={handlePasswordReset}
          className="auth-button"
        >
          Reset Password
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="auth-footer">
        <Link to="/signin" className="auth-link">Back to Login</Link>
      </div>
    </div>
  );
};

export default ResetPassword;