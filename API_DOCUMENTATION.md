# Skill Swap Platform API Documentation

## Overview
The Skill Swap Platform is a complete backend system that enables users to list their skills and request others in return. This API supports user management, skill swapping, ratings, notifications, and admin functionality.

## Base URL
```
http://localhost:5000/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Health Check
- **GET** `/health` - Check API status (no auth required)

### Authentication Routes (`/auth`)

#### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "name": "string (required, 2-50 chars)",
    "email": "string (required, valid email)",
    "password": "string (required, min 6 chars)"
  }
  ```
- **Response:** `{ token, user: { id, name, email } }`

#### Login User
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "string (required)",
    "password": "string (required)"
  }
  ```
- **Response:** `{ token, user: { id, name, email } }`

#### Get Current User
- **GET** `/auth/me` (Auth required)
- **Response:** Current user object

### User Management Routes (`/users`)

#### Get User Profile
- **GET** `/users/profile` (Auth required)
- **Response:** Current user's complete profile

#### Update User Profile
- **PUT** `/users/profile` (Auth required)
- **Body:**
  ```json
  {
    "name": "string (optional, 2-50 chars)",
    "location": "string (optional, max 100 chars)",
    "profilePhoto": "string (optional, URL)",
    "skillsOffered": ["array of strings"],
    "skillsWanted": ["array of strings"],
    "availability": "string (optional, max 200 chars)",
    "isPublic": "boolean (optional)"
  }
  ```

#### Search Users
- **GET** `/users/search?skill={skill}&location={location}&availability={availability}` (Auth required)
- **Query Parameters:**
  - `skill`: Filter by offered skills
  - `location`: Filter by location
  - `availability`: Filter by availability
- **Response:** Array of matching public user profiles

#### Get User by ID
- **GET** `/users/{id}` (Auth required)
- **Response:** User profile (if public or own profile)

### Swap Management Routes (`/swaps`)

#### Create Swap Request
- **POST** `/swaps` (Auth required)
- **Body:**
  ```json
  {
    "providerId": "string (required, MongoDB ID)",
    "skillOffered": "string (required, 1-100 chars)",
    "skillWanted": "string (required, 1-100 chars)",
    "description": "string (optional, max 500 chars)",
    "proposedTime": "string (optional)",
    "duration": "string (optional)",
    "location": "string (optional)",
    "notes": "string (optional, max 500 chars)"
  }
  ```

#### Get User's Swaps
- **GET** `/swaps?status={status}&type={type}` (Auth required)
- **Query Parameters:**
  - `status`: pending, accepted, rejected, completed, cancelled
  - `type`: sent, received (default: both)
- **Response:** Array of user's swap requests

#### Get Swap Details
- **GET** `/swaps/{id}` (Auth required)
- **Response:** Detailed swap information

#### Accept Swap Request
- **PUT** `/swaps/{id}/accept` (Auth required, provider only)
- **Response:** Updated swap object

#### Reject Swap Request
- **PUT** `/swaps/{id}/reject` (Auth required, provider only)
- **Response:** Updated swap object

#### Complete Swap
- **PUT** `/swaps/{id}/complete` (Auth required, participants only)
- **Response:** Updated swap object

#### Cancel Swap Request
- **DELETE** `/swaps/{id}` (Auth required, requester only)
- **Response:** Updated swap object

### Rating System Routes (`/ratings`)

#### Create Rating
- **POST** `/ratings` (Auth required)
- **Body:**
  ```json
  {
    "swapId": "string (required, MongoDB ID)",
    "rating": "number (required, 1-5)",
    "comment": "string (optional, max 500 chars)"
  }
  ```

#### Get Ratings Given by User
- **GET** `/ratings/given` (Auth required)
- **Response:** Array of ratings given by current user

#### Get Ratings for a User
- **GET** `/ratings/user/{userId}?page={page}&limit={limit}` (Auth required)
- **Response:** Paginated ratings for specified user

#### Get Rating for Specific Swap
- **GET** `/ratings/swap/{swapId}` (Auth required)
- **Response:** User's rating for the swap (if exists)

#### Update Rating
- **PUT** `/ratings/{ratingId}` (Auth required, within 24 hours)
- **Body:**
  ```json
  {
    "rating": "number (required, 1-5)",
    "comment": "string (optional)"
  }
  ```

### Notification Routes (`/notifications`)

#### Get User Notifications
- **GET** `/notifications?page={page}&limit={limit}&unreadOnly={boolean}` (Auth required)
- **Response:** Paginated user notifications

#### Get Notification Statistics
- **GET** `/notifications/stats` (Auth required)
- **Response:** Notification counts and statistics

#### Mark Notification as Read
- **PUT** `/notifications/{notificationId}/read` (Auth required)

#### Mark All Notifications as Read
- **PUT** `/notifications/read-all` (Auth required)

#### Delete Notification
- **DELETE** `/notifications/{notificationId}` (Auth required)

### Admin Routes (`/admin`) - Admin access required

#### Get Dashboard Statistics
- **GET** `/admin/dashboard`
- **Response:** Platform statistics and metrics

#### Get All Users
- **GET** `/admin/users?page={page}&limit={limit}&search={search}&status={status}`
- **Query Parameters:**
  - `search`: Search by name or email
  - `status`: active, banned
- **Response:** Paginated user list

#### Ban/Unban User
- **PUT** `/admin/users/{userId}/ban`
- **Body:**
  ```json
  {
    "reason": "string (optional)"
  }
  ```

#### Get All Swaps
- **GET** `/admin/swaps?page={page}&limit={limit}&status={status}&skill={skill}`
- **Response:** Paginated swap list for monitoring

#### Create Platform Announcement
- **POST** `/admin/announcements`
- **Body:**
  ```json
  {
    "title": "string (required, 1-200 chars)",
    "message": "string (required, 1-1000 chars)",
    "type": "string (optional): announcement, maintenance, policy_update, feature_update",
    "targetUsers": ["array of user IDs (optional, empty = all users)"],
    "expiresAt": "ISO date string (optional)"
  }
  ```

#### Get Announcements
- **GET** `/admin/announcements?page={page}&limit={limit}&active={boolean}`

#### Content Moderation
- **POST** `/admin/moderate`
- **Body:**
  ```json
  {
    "contentType": "swap|user",
    "contentId": "string (MongoDB ID)",
    "action": "reject|warn",
    "reason": "string"
  }
  ```

#### Generate Report
- **POST** `/admin/reports`
- **Body:**
  ```json
  {
    "type": "activity|feedback|swaps|users|ratings",
    "dateRange": {
      "from": "ISO date string (optional)",
      "to": "ISO date string (optional)"
    }
  }
  ```

#### Get Reports
- **GET** `/admin/reports`
- **Response:** List of generated reports

## Data Models

### User Model
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "location": "string",
  "profilePhoto": "string",
  "skillsOffered": ["array of strings"],
  "skillsWanted": ["array of strings"],
  "availability": "string",
  "isPublic": "boolean",
  "isAdmin": "boolean",
  "isBanned": "boolean",
  "averageRating": "number",
  "totalRatings": "number",
  "completedSwaps": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Swap Model
```json
{
  "_id": "ObjectId",
  "requester": "ObjectId (User)",
  "provider": "ObjectId (User)",
  "skillOffered": "string",
  "skillWanted": "string",
  "description": "string",
  "status": "pending|accepted|rejected|completed|cancelled",
  "proposedTime": "string",
  "duration": "string",
  "location": "string",
  "notes": "string",
  "responseDate": "date",
  "completionDate": "date",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Rating Model
```json
{
  "_id": "ObjectId",
  "swap": "ObjectId (Swap)",
  "rater": "ObjectId (User)",
  "rated": "ObjectId (User)",
  "rating": "number (1-5)",
  "comment": "string",
  "skillExchanged": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Notification Model
```json
{
  "_id": "ObjectId",
  "recipient": "ObjectId (User)",
  "type": "swap_request|swap_accepted|swap_rejected|swap_completed|rating_received|admin_message",
  "title": "string",
  "message": "string",
  "relatedSwap": "ObjectId (Swap, optional)",
  "relatedUser": "ObjectId (User, optional)",
  "isRead": "boolean",
  "emailSent": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "msg": "Error message",
  "errors": ["array of validation errors (if applicable)"]
}
```

### 401 Unauthorized
```json
{
  "msg": "No token provided" | "Token invalid or expired"
}
```

### 403 Forbidden
```json
{
  "msg": "Access denied" | "Admin access required" | "Account suspended"
}
```

### 404 Not Found
```json
{
  "msg": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "msg": "Server error",
  "error": "error details"
}
```

## Rate Limiting
The API implements rate limiting to prevent abuse. Standard limits apply to all endpoints.

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based access control
- Banned user access prevention
- Admin-only endpoint protection

## Database Indexing
The API includes optimized database indexes for:
- User search (skills, location, name)
- Swap queries (requester, provider, status)
- Notification queries (recipient, read status)
- Rating uniqueness (one rating per user per swap)

## Getting Started

1. **Clone the repository**
2. **Install dependencies:** `npm install`
3. **Set up environment variables** in `.env`:
   ```
   PORT=5000
   JWT_SECRET=your-secret-key
   MONGO_URI=your-mongodb-connection-string
   ```
4. **Start the server:** `node server.js`
5. **Test the API:** Use the health endpoint at `GET /api/health`

## Example Usage

### Complete User Registration and Profile Setup
```javascript
// 1. Register
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});

const { token } = await registerResponse.json();

// 2. Update profile
await fetch('/api/users/profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    location: 'New York',
    skillsOffered: ['JavaScript', 'Node.js'],
    skillsWanted: ['Python', 'React'],
    availability: 'Weekends'
  })
});
```

### Create and Manage Swap Requests
```javascript
// 1. Search for users with desired skills
const users = await fetch('/api/users/search?skill=Python', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 2. Create swap request
const swap = await fetch('/api/swaps', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    providerId: 'user-id-here',
    skillOffered: 'JavaScript',
    skillWanted: 'Python',
    description: 'I can teach JavaScript fundamentals',
    proposedTime: 'Saturday 2 PM'
  })
});

// 3. Accept swap (as provider)
await fetch(`/api/swaps/${swapId}/accept`, {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` }
});

// 4. Complete swap
await fetch(`/api/swaps/${swapId}/complete`, {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` }
});

// 5. Rate the experience
await fetch('/api/ratings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    swapId: swapId,
    rating: 5,
    comment: 'Great teacher and very patient!'
  })
});
```