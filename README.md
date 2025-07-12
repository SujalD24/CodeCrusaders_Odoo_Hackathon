# 🔄 Skill Swap Platform Backend

A comprehensive backend system for a skill exchange platform that enables users to list their skills and request others in return. Built with Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Features

### 👥 User Management
- **Complete Profile System**: Registration, login, profile management
- **Skill Management**: Add/remove skills offered and wanted
- **Privacy Controls**: Public/private profile settings
- **Advanced Search**: Find users by skills, location, and availability
- **User Ratings**: Average rating display and rating history

### 🔄 Swap Request System
- **Create Requests**: Send skill exchange requests to other users
- **Request Management**: Accept, reject, or cancel swap requests
- **Status Tracking**: Monitor pending, accepted, rejected, completed swaps
- **Auto-completion**: Mark swaps as completed with automatic stat updates

### ⭐ Rating & Feedback System
- **Post-Swap Ratings**: Rate users from 1-5 stars after exchanges
- **Detailed Feedback**: Leave comments with ratings
- **Rating Analytics**: Automatic average rating calculation
- **Edit Window**: 24-hour window to update ratings

### 🔔 Notification System
- **Real-time Notifications**: Instant updates for all user actions
- **Multiple Types**: Swap requests, acceptances, rejections, completions, ratings
- **Admin Messages**: Platform-wide announcements
- **Notification Management**: Mark as read, delete, view statistics

### 🛡️ Admin Panel
- **User Management**: View, search, ban/unban users
- **Content Moderation**: Review and moderate swap requests
- **Platform Announcements**: Send messages to all or specific users
- **Analytics Dashboard**: Platform statistics and metrics
- **Report Generation**: Download activity, user, swap, and rating reports

### 🔒 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: User and Admin role separation
- **Input Validation**: Comprehensive validation with express-validator
- **Ban System**: Automatic access prevention for banned users
- **Password Security**: Bcrypt hashing for passwords

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Password Hashing**: Bcrypt
- **HTTP Client**: Axios (for testing)

## 📁 Project Structure

```
skill-swap-backend/
├── controllers/           # Business logic controllers
│   ├── authController.js     # Authentication logic
│   ├── swapController.js     # Swap management logic
│   ├── ratingController.js   # Rating system logic
│   ├── adminController.js    # Admin panel logic
│   └── notificationController.js # Notification logic
├── middlewares/          # Custom middleware
│   ├── authMiddleware.js     # JWT authentication
│   ├── adminMiddleware.js    # Admin access control
│   └── validation.js         # Input validation rules
├── models/               # Database models
│   ├── user.js              # User model
│   ├── swap.js              # Swap request model
│   ├── rating.js            # Rating model
│   ├── notification.js      # Notification model
│   ├── adminMessage.js      # Admin message model
│   └── report.js            # Report model
├── routes/               # API route definitions
│   ├── authRoutes.js        # Authentication routes
│   ├── userRoutes.js        # User management routes
│   ├── swapRoutes.js        # Swap management routes
│   ├── ratingRoutes.js      # Rating system routes
│   ├── adminRoutes.js       # Admin panel routes
│   └── notificationRoutes.js # Notification routes
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables
└── API_DOCUMENTATION.md  # Complete API documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd skill-swap-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
MONGO_URI=mongodb://localhost:27017/skillswap
# or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillswap
```

4. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

5. **Verify installation**
Visit `http://localhost:5000/api/health` to check if the API is running.

## 📋 API Endpoints

### Core Routes
- **Authentication**: `/api/auth/*` - Register, login, get current user
- **Users**: `/api/users/*` - Profile management, search users
- **Swaps**: `/api/swaps/*` - Create, manage, and track skill exchanges
- **Ratings**: `/api/ratings/*` - Rate users and view feedback
- **Notifications**: `/api/notifications/*` - Manage user notifications
- **Admin**: `/api/admin/*` - Admin panel functionality

### Quick Examples

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Search for users with specific skills:**
```bash
curl -X GET "http://localhost:5000/api/users/search?skill=JavaScript" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create a swap request:**
```bash
curl -X POST http://localhost:5000/api/swaps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "providerId": "USER_ID_HERE",
    "skillOffered": "JavaScript",
    "skillWanted": "Python",
    "description": "I can teach JavaScript fundamentals"
  }'
```

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 🗄️ Database Schema

### User Model
- Personal information (name, email, location)
- Skills offered and wanted
- Privacy settings and availability
- Admin status and ban status
- Rating statistics

### Swap Model
- Requester and provider references
- Skills being exchanged
- Status tracking (pending → accepted → completed)
- Time and location details

### Rating Model
- Swap reference and user references
- Rating (1-5 stars) and comment
- Automatic average calculation

### Notification Model
- Recipient and notification type
- Related swap and user references
- Read status and timestamps

## 🧪 Testing

The project includes a basic API testing script:

```bash
# Install axios for testing
npm install axios --save-dev

# Run the test script (make sure server is running)
node /tmp/test-api.js
```

## 🔧 Development

### Adding New Features

1. **Create Model** (if needed): Add to `models/` directory
2. **Create Controller**: Add business logic to `controllers/`
3. **Add Routes**: Define endpoints in `routes/`
4. **Add Validation**: Create validation rules in `middlewares/validation.js`
5. **Update Server**: Import routes in `server.js`
6. **Test**: Create tests and update documentation

### Database Indexes

The application includes optimized indexes for:
- User search (text index on skills, location, name)
- Swap queries (compound indexes on requester/provider + status)
- Notification queries (recipient + read status + date)

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-production-jwt-secret-key
MONGO_URI=your-production-mongodb-uri
```

### Docker Deployment (optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

## 🎯 Roadmap

- [ ] Email notification system
- [ ] Real-time WebSocket notifications
- [ ] File upload for profile photos
- [ ] Advanced analytics dashboard
- [ ] Mobile app API optimization
- [ ] Integration tests
- [ ] Performance monitoring
- [ ] Rate limiting implementation

---

Built with ❤️ for the CodeCrusaders Odoo Hackathon