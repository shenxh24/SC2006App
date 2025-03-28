import React, { useState } from 'react';
import { auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const ProfilePictureUpload = ({ currentPic, onUpdate, compactMode = false }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      onUpdate(downloadURL);
      localStorage.setItem(`profilePic_${auth.currentUser.uid}`, downloadURL);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`profile-pic-upload ${compactMode ? 'compact' : ''}`}>
      {compactMode ? (
        <label className="upload-btn-compact">
          {uploading ? '...' : 'Update Photo'}
          <input 
            type="file" 
            accept="image/*" 
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
            {uploading ? 'Uploading...' : 'Change Photo'}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
        </>
      )}
    </div>
  );
};

export default ProfilePictureUpload;