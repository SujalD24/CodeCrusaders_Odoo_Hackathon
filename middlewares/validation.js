const { body, validationResult } = require('express-validator');

// Validation middleware to check for errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
exports.validateRegistration = [
  body('name').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  exports.handleValidationErrors
];

// User login validation
exports.validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required'),
  exports.handleValidationErrors
];

// Profile update validation
exports.validateProfileUpdate = [
  body('name').optional().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('location').optional().isLength({ max: 100 }).withMessage('Location must be less than 100 characters'),
  body('availability').optional().isLength({ max: 200 }).withMessage('Availability must be less than 200 characters'),
  body('skillsOffered').optional().isArray().withMessage('Skills offered must be an array'),
  body('skillsWanted').optional().isArray().withMessage('Skills wanted must be an array'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  exports.handleValidationErrors
];

// Swap creation validation
exports.validateSwapCreation = [
  body('providerId').isMongoId().withMessage('Provider ID must be a valid MongoDB ID'),
  body('skillOffered').isLength({ min: 1, max: 100 }).withMessage('Skill offered must be between 1 and 100 characters'),
  body('skillWanted').isLength({ min: 1, max: 100 }).withMessage('Skill wanted must be between 1 and 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('proposedTime').optional().isLength({ max: 100 }).withMessage('Proposed time must be less than 100 characters'),
  body('duration').optional().isLength({ max: 100 }).withMessage('Duration must be less than 100 characters'),
  body('location').optional().isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
  exports.handleValidationErrors
];

// Rating creation validation
exports.validateRatingCreation = [
  body('swapId').isMongoId().withMessage('Swap ID must be a valid MongoDB ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters'),
  exports.handleValidationErrors
];

// Admin announcement validation
exports.validateAnnouncement = [
  body('title').isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('message').isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  body('type').optional().isIn(['announcement', 'maintenance', 'policy_update', 'feature_update'])
    .withMessage('Type must be one of: announcement, maintenance, policy_update, feature_update'),
  body('targetUsers').optional().isArray().withMessage('Target users must be an array'),
  body('expiresAt').optional().isISO8601().withMessage('Expires at must be a valid date'),
  exports.handleValidationErrors
];

// Report generation validation
exports.validateReportGeneration = [
  body('type').isIn(['activity', 'feedback', 'swaps', 'users', 'ratings'])
    .withMessage('Type must be one of: activity, feedback, swaps, users, ratings'),
  body('dateRange.from').optional().isISO8601().withMessage('From date must be a valid date'),
  body('dateRange.to').optional().isISO8601().withMessage('To date must be a valid date'),
  exports.handleValidationErrors
];