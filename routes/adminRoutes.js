const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { validateAnnouncement, validateReportGeneration } = require('../middlewares/validation');

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard statistics
router.get('/dashboard', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/ban', adminController.toggleUserBan);

// Swap monitoring
router.get('/swaps', adminController.getAllSwaps);

// Platform announcements
router.post('/announcements', validateAnnouncement, adminController.createAnnouncement);
router.get('/announcements', adminController.getAnnouncements);

// Content moderation
router.post('/moderate', adminController.moderateContent);

// Reports generation
router.post('/reports', validateReportGeneration, adminController.generateReport);
router.get('/reports', adminController.getReports);

module.exports = router;