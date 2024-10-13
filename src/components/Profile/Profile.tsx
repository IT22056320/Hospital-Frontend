import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';

const Profile: React.FC = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  // Generate QR code for the user profile
  useEffect(() => {
    if (user && user.email) {
      QRCode.toDataURL(user.email)
        .then((url: string) => setQrCodeData(url))
        .catch((err: Error) => console.error('QR Code generation error: ', err));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <div>
      <h2>Profile Page</h2>
      <p>Username: {user?.username}</p>
      <p>Email: {user?.email}</p>
      
      {/* Display QR Code */}
      {qrCodeData && (
        <div>
          <h3>Your Medical Records QR Code:</h3>
          <img src={qrCodeData} alt="QR Code" />
        </div>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
