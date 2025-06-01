import React, { useState } from 'react';
import { auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const ProfilePictureUpload = ({ currentPic, onUpdate, compactMode = false }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Check if user is authenticated
    if (!auth.currentUser) {
      setError('You must be logged in to upload a profile picture');
      return;
    }
  
    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }
  
    setUploading(true);
    setError(null);
    
    try {
      console.log('Starting upload for user:', auth.currentUser.uid);
      const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
      
      console.log('Uploading file:', file.name);
      await uploadBytes(storageRef, file);
      
      console.log('Getting download URL');
      const downloadURL = await getDownloadURL(storageRef);
      
      console.log('Upload successful, URL:', downloadURL);
      onUpdate(downloadURL);
      localStorage.setItem(`profilePic_${auth.currentUser.uid}`, downloadURL);
    } catch (error) {
      console.error("Upload error:", error);
      setError(`Upload failed: ${error.message}`);
      // Check specific error codes
      if (error.code === 'storage/unauthorized') {
        setError('You do not have permission to upload files');
      } else if (error.code === 'storage/canceled') {
        setError('Upload was canceled');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`profile-pic-upload ${compactMode ? 'compact' : ''}`}>
      {compactMode ? (
        <label className="upload-btn-compact">
          {uploading ? (
            <span className="uploading-spinner" />
          ) : 'Update Photo'}
          <input 
            type="file" 
            accept="image/jpeg,image/png" 
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      ) : (
        <>
          <div className="pic-preview">
            {currentPic ? (
              <img src={currentPic} alt="Profile" />
            ) : (
              <div className="default-pic">
                {auth.currentUser?.email?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <label className="upload-btn">
            {uploading ? (
              <>
                <span className="uploading-spinner" /> Uploading...
              </>
            ) : 'Change Photo'}
            <input 
              type="file" 
              accept="image/jpeg,image/png" 
              onChange={handleUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
          {error && <div className="upload-error">{error}</div>}
        </>
      )}
    </div>
  );
};

export default ProfilePictureUpload;