# SkillSwap Frontend

A React-based frontend for the SkillSwap application built with Vite.

## Features

- **Authentication**: Login and Register pages with form validation
- **Profile Management**: User profile editing with location and availability
- **Skills Management**: Add/remove skills you offer and want to learn
- **Swap Requests**: Create and manage skill exchange requests
- **Ratings & Reviews**: Submit and view ratings for skill exchanges
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- React 18
- Vite (development server and build tool)
- React Router DOM (routing)
- Axios (API calls)
- CSS3 (styling)

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend is configured to make API calls to the backend server at `http://localhost:3000/api`. Make sure the backend server is running for full functionality.

## Project Structure

```
client/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable components
│   ├── context/     # React context (auth, etc.)
│   ├── pages/       # Page components
│   ├── services/    # API service functions
│   ├── utils/       # Utility functions
│   ├── App.jsx      # Main App component
│   └── main.jsx     # App entry point
├── package.json
└── vite.config.js
```

## Pages

- **Home** (`/`) - Landing page with app overview
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration
- **Profile** (`/profile`) - User profile management (protected)
- **Skills** (`/skills`) - Skills management (protected)
- **Swap Requests** (`/swap-requests`) - Skill exchange requests (protected)
- **Ratings** (`/ratings`) - Rating and review system (protected)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request
