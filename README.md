# SkillSwap - Skill Exchange Platform

A full-stack skill exchange platform where users can trade skills with each other. Built with Node.js/Express backend and React frontend.

## Features

### Backend (API)
- **Authentication**: JWT-based user registration and login
- **User Management**: Profile management with skills and preferences
- **Skill Matching**: System to match users based on complementary skills
- **Swap Requests**: Create and manage skill exchange requests
- **Rating System**: Rate and review skill exchanges
- **MongoDB Integration**: Persistent data storage

### Frontend (React App)
- **Modern React Interface**: Built with React 18 and Vite
- **Responsive Design**: Works on desktop and mobile devices
- **Authentication Pages**: Login and registration with form validation
- **Profile Management**: Edit personal information and preferences
- **Skills Management**: Add/remove skills you offer and want to learn
- **Swap Requests**: Browse and create skill exchange requests
- **Ratings & Reviews**: Submit and view ratings for skill exchanges
- **Protected Routes**: Secure pages requiring authentication

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests

### Frontend
- React 18
- Vite (build tool)
- React Router DOM (routing)
- Axios (API calls)
- Context API (state management)
- CSS3 (styling)

## Project Structure

```
├── server.js              # Main server file
├── package.json           # Backend dependencies
├── .env                   # Environment variables
├── controllers/           # Request handlers
├── models/               # MongoDB schemas
├── routes/               # API routes
├── middlewares/          # Custom middleware
└── client/               # React frontend
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── context/      # React context
    │   ├── services/     # API services
    │   └── App.jsx       # Main App component
    ├── package.json      # Frontend dependencies
    └── README.md         # Frontend documentation
```

## Getting Started

### Prerequisites
- Node.js 16 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CodeCrusaders_Odoo_Hackathon
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   MONGO_URI=your_mongodb_connection_string
   ```

5. **Start the application**

   **Option 1: Run both simultaneously**
   ```bash
   # Terminal 1: Start backend server
   npm run server
   
   # Terminal 2: Start frontend development server
   npm run client
   ```

   **Option 2: Individual commands**
   ```bash
   # Start backend only
   npm start
   
   # Start frontend only (in client directory)
   cd client && npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### User Management
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/skills` - Get user skills
- `PUT /api/users/skills` - Update user skills

### Swap Requests
- `GET /api/swaps` - Get all swap requests
- `POST /api/swaps` - Create new swap request
- `PUT /api/swaps/:id` - Update swap request status

### Ratings
- `GET /api/ratings` - Get all ratings
- `POST /api/ratings` - Submit new rating

## Available Scripts

### Root Directory (Backend)
- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run server` - Start backend server only
- `npm run client` - Start frontend development server
- `npm run build` - Build frontend for production

### Client Directory (Frontend)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Development

### Backend Development
1. Start the backend server: `npm run server`
2. Server runs on http://localhost:3000
3. API endpoints available at http://localhost:3000/api

### Frontend Development
1. Start the frontend: `npm run client`
2. Frontend runs on http://localhost:5173
3. Hot reload enabled for development

### Full Stack Development
1. Run both servers simultaneously:
   ```bash
   # Terminal 1
   npm run server
   
   # Terminal 2
   npm run client
   ```

## Deployment

### Frontend Build
```bash
cd client
npm run build
```

### Production
- Configure environment variables for production
- Set up MongoDB Atlas or production MongoDB instance
- Deploy backend to services like Heroku, AWS, or Digital Ocean
- Deploy frontend build to services like Netlify, Vercel, or AWS S3

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the ISC License.