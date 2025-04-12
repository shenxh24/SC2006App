# BitebyByte - Health and Nutrition Platform

![BiteByByte Logo](./my-app/logo.png)

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Acknowledgements](#acknowledgements)

### Introduction
BiteByByte is a web-based health and nutrition platform designed to help Singaporeans lead healthier lives by offering personalized meal tracking, recipe generation, and real-time food location services. The platform integrates key features such as user profile customization, calorie tracking, ingredient management, and AI-driven recipe generation, adapting dynamically to individual dietary preferences, allergies, and fitness goals.

The platform utilizes external APIs (Google Maps, Spoonacular) to provide real-time data on nearby food options, thus enhancing convenience and enabling users to make informed choices on the go.



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
  
To run the BiteByByte platform locally, follow these steps:

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/bitebybyte.git
cd bitebybyte
```

2. **Install dependencies:**
 Install both frontend and backend dependencies using npm:
```bash
npm install
``` 
## Usage

### Start the Backend
In the server directory, run:

```bash
npm run server
```
The backend will run on http://localhost:5001.

### Start the Frontend
In the client directory, run:

```bash
npm run client
```

The frontend will run on http://localhost:3000.

**Open http://localhost:3000 in your browser to interact with the BitebyByte platform!**

Set up environment variables: Create a ```.env``` file in the root directory and add the following variables:
```bash
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyArJ07huGvQJfifEh5tr2yr_toSbCkP6yo 
REACT_APP_SPOONACULAR_API_KEY=92f7abf67e7b49f0a04d4a265bccba27
``` 


**Once the system is running, you can:**

1. **Create an Account**: Sign up via email or Google account.
2. **Track Your Nutrition**: Log meals and track your progress with the Nutrition Tracker.
3. **Search Recipes**: Browse and search for recipes by ingredients, dietary preferences, and cuisines.
4. **Locate Nearby Food**: Use the Food Locator to find healthy restaurants and directions.

## Contributing

We welcome contributions to BiteByByte! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes
   ```bash
   git commit -am 'Add new feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/your-feature
   ```
5. Create a new pull request.


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



