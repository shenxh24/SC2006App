import React, { useState, useEffect } from 'react';
import '../App.css';

function PersonalDetails() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  // Load saved details from local storage when the component mounts
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('personalDetails'));
    if (savedDetails) {
      setHeight(savedDetails.height);
      setWeight(savedDetails.weight);
      setLifestyle(savedDetails.lifestyle);
      setGender(savedDetails.gender);
      setAge(savedDetails.age);
    }
  }, []);

  // Save details to local storage
  const handleSubmit = (e) => {
    e.preventDefault();
    const personalDetails = { height, weight, lifestyle, gender, age };
    localStorage.setItem('personalDetails', JSON.stringify(personalDetails));
    console.log('Details saved:', personalDetails);
    alert('Details saved successfully!');
  };

  return (
    <div className="personal-details">
      <h1>BitebyByte</h1>
      <h2>Details</h2>
      <p>Enter your physical traits to get the most personalized experience with BitebyByte</p>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="details-form">
        <label>
          Height (in cm):
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter height"
            required
          />
        </label>
        <label>
          Weight (in kg):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight"
            required
          />
        </label>
        <label>
          Lifestyle:
          <select
            value={lifestyle}
            onChange={(e) => setLifestyle(e.target.value)}
            required
          >
            <option value="">Select lifestyle</option>
            <option value="sedentary">Sedentary</option>
            <option value="active">Active</option>
            <option value="very-active">Very Active</option>
          </select>
        </label>
        <label>
          Gender:
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Age:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
            required
          />
        </label>
        <button type="submit">Save Details</button>
      </form>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2023 BitebyByte. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PersonalDetails;