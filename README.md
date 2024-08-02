# Backend for My MERN Stack Web Application
Demo: https://wealthpath-385e08c18cf4.herokuapp.com/api-docs/

This repository contains the backend code for my MERN stack web application, built with Node.js, Express.js, and MongoDB. The backend provides RESTful APIs for interacting with the application, and Swagger is used for API documentation.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contact](#contact)

## Features

- User authentication and authorization
- CRUD operations for entities
- Data validation and error handling
- Integration with MongoDB for data persistence
- Swagger UI for interactive API documentation

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: ODM for MongoDB
- **Swagger**: API documentation and testing

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or Atlas instance)
- [Git](https://git-scm.com/)


###  Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/maryamfad/dashboard_backend.git
   ```

2. Navigate to the backend directory:

   ```bash
   cd dashboard_backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file and add your environment variables.

5. Start the server:

   ```bash
   npm start
   ```
## Usage
Once the server is running, you can interact with the API endpoints as described in the Swagger documentation. Here are some common endpoints:

- POST /auth/signup: Register a new user
- POST /auth/login: Log in an existing user
- POST /auth/logout: Logut the user
- GET /user/all: Retrieve a list of all users
- GET /user/:userId: Retrieve a specific user by ID
- POST /trade/buy: Perform a buy request
- POST /trade/sell: Perform a sell request

## Screenshots
<img width="941" alt="3" src="https://github.com/user-attachments/assets/9c6d836e-311e-4223-86ba-a0d7ef6ed19d">

<img width="943" alt="2" src="https://github.com/user-attachments/assets/48996fe3-a9a5-46fe-918b-0fbcf6867094">

## Contact

If you have any questions, please reach out to me at [maryamfadaee@gmail.com](mailto:maryamfadaee@gmail.com).
