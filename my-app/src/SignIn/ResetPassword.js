import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';  // Adjust the path if needed
import { confirmPasswordReset } from 'firebase/auth';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [oobCode, setOobCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the oobCode from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('oobCode');
    if (code) {
      setOobCode(code);
    }
  }, []);

  const handlePasswordReset = async () => {
    try {
      if (password) {
        await confirmPasswordReset(auth, oobCode, password);
        alert('Password has been reset successfully!');
        navigate('/signin');  // Redirect to login page after successful reset
      } else {
        setError('Please enter a new password.');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Enter New Password</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
        required
      />
      <button onClick={handlePasswordReset}>Reset Password</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
