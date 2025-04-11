# BitebyByte - Health and Nutrition Platform


**BitebyByte** is a web-based health and nutrition platform designed to empower users to lead healthier lives through intelligent meal tracking, personalized recipe generation, and real-time food location services. The platform offers a user-friendly interface that helps users manage their dietary goals and make smarter food choices.

---

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Acknowledgements](#acknowledgements)

---

## Introduction

**BitebyByte** provides personalized health recommendations to Singaporeans, helping them track their calories, manage allergies, and meet their fitness goals. It uses real-time APIs like **Google Maps** and **Spoonacular** to provide nearby food options and recipes that suit the user’s dietary preferences and goals.

---

## Features

- **User Authentication:** Sign up, log in, and sign in with Google account.
- **Personalized Goals:** Users can update personal details like age, height, weight, and activity level to get personalized nutrition recommendations.
- **Nutrition Tracker:** Log food items and track your daily nutrient intake (calories, protein, fat, carbs).
- **Recipe Generation:** Generate recipes based on food preferences, dietary goals, and ingredients.
- **Food Locator:** Search for nearby restaurants and food options.
- **Favourites:** Save and view your favourite recipes.
- **Real-Time Updates:** Integration with external APIs for Google Maps and Spoonacular to get recipe data and locate food options.

---

## Technologies Used

- **Frontend:**
  - **React.js** - JavaScript library for building user interfaces
  - **React Router DOM** - For in-app routing
  - **Firebase** - Authentication, database, and hosting
  - **Axios** - For making API requests
  - **@react-google-maps/api** - Integration for Google Maps

- **Backend:**
  - **Node.js** - JavaScript runtime environment for executing backend logic
  - **Express.js** - Web framework for building RESTful APIs
  - **Firebase** - For backend authentication and database
  - **Axios** - For communicating with third-party APIs (Spoonacular, Google Maps)
  - **CORS** - For handling Cross-Origin Resource Sharing
  - **dotenv** - For environment variable management
  - **jsonwebtoken** - Secure token-based authentication
  - **bcryptjs** - For password hashing
  - **Nodemon** - Development tool for automatic server reload on file changes
  - **Concurrently** - Utility for running backend and frontend servers simultaneously during development

---

## Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16.20.2 or higher)
- **npm** (v9.6.7 or higher)

## Usage

### Start the Backend
In the server directory, run:

npm start

**The backend will run on http://localhost:5001.**

### Start the Frontend
In the client directory, run:

npm start

**The frontend will run on http://localhost:3000.**

Open http://localhost:3000 in your browser to interact with the BitebyByte platform!


## Acknowledgements

- **Google Maps API for location and map services**
- **Spoonacular API for recipe data**
- **Firebase for authentication, database, and hosting**
- **React for frontend UI**
- **Node.js and Express for the backend server**

### Contributers:

1. [Ang Yingjie](#Ang-Yingjie)
2. [Lee Beckham](#Lee-Beckham)
3. [Ponnusamy Saishenetha](#Ponnusamy-Saishenetha)
4. [Seth Yew](#Seth-Yew)
5. [Sim Shuen Hwee](#Sim-Shuen-Hwee)



