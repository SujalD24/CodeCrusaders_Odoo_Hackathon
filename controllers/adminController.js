const User = require('../models/user');
const Swap = require('../models/swap');
const Rating = require('../models/rating');
const Notification = require('../models/notification');
const AdminMessage = require('../models/adminMessage');
const Report = require('../models/report');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSwaps = await Swap.countDocuments();
    const totalRatings = await Rating.countDocuments();
    const activeUsers = await User.countDocuments({ 
      updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
    });
    const completedSwaps = await Swap.countDocuments({ status: 'completed' });
    const pendingSwaps = await Swap.countDocuments({ status: 'pending' });
    
    // Calculate average rating across platform
    const ratings = await Rating.find();
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0;

    res.json({
      totalUsers,
      totalSwaps,
      totalRatings,
      activeUsers,
      completedSwaps,
      pendingSwaps,
      averageRating: Math.round(averageRating * 10) / 10
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all users with admin management options
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status === 'banned') {
      query.isBanned = true;
    } else if (status === 'active') {
      query.isBanned = false;
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Ban/Unban a user
exports.toggleUserBan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Prevent banning other admins
    if (user.isAdmin) {
      return res.status(403).json({ msg: 'Cannot ban admin users' });
    }
    
    user.isBanned = !user.isBanned;
    await user.save();
    
    // Create notification for user
    const notification = new Notification({
      recipient: userId,
      type: 'admin_message',
      title: user.isBanned ? 'Account Suspended' : 'Account Reinstated',
      message: user.isBanned 
        ? `Your account has been suspended. Reason: ${reason || 'Policy violation'}`
        : 'Your account has been reinstated and is now active.'
    });
    await notification.save();
    
    res.json({ 
      msg: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
      user: { ...user.toObject(), password: undefined }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all swaps for monitoring
exports.getAllSwaps = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, skill } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (skill) {
      query.$or = [
        { skillOffered: { $regex: skill, $options: 'i' } },
        { skillWanted: { $regex: skill, $options: 'i' } }
      ];
    }
    
    const swaps = await Swap.find(query)
      .populate('requester', 'name email')
      .populate('provider', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Swap.countDocuments(query);
    
    res.json({
      swaps,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Create platform-wide announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, type, targetUsers, expiresAt } = req.body;
    
    const announcement = new AdminMessage({
      admin: req.user._id,
      title,
      message,
      type: type || 'announcement',
      targetUsers: targetUsers || [], // Empty array means all users
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    });
    
    await announcement.save();
    
    // Create notifications for target users
    let recipients = [];
    if (targetUsers && targetUsers.length > 0) {
      recipients = targetUsers;
    } else {
      // Send to all users
      const allUsers = await User.find({ isBanned: false }, '_id');
      recipients = allUsers.map(user => user._id);
    }
    
    // Create notifications in batches to avoid memory issues
    const batchSize = 100;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const notifications = batch.map(userId => ({
        recipient: userId,
        type: 'admin_message',
        title: `Platform ${type}: ${title}`,
        message
      }));
      
      await Notification.insertMany(notifications);
    }
    
    await announcement.populate('admin', 'name email');
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    let query = {};
    
    if (active === 'true') {
      query.isActive = true;
      query.$or = [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ];
    }
    
    const announcements = await AdminMessage.find(query)
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await AdminMessage.countDocuments(query);
    
    res.json({
      announcements,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Generate and download reports
exports.generateReport = async (req, res) => {
  try {
    const { type, dateRange } = req.body;
    
    let fromDate = dateRange?.from ? new Date(dateRange.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    let toDate = dateRange?.to ? new Date(dateRange.to) : new Date();
    
    let data = {};
    let summary = {};
    
    switch (type) {
      case 'users':
        data.users = await User.find({
          createdAt: { $gte: fromDate, $lte: toDate }
        }).select('-password');
        summary.totalUsers = data.users.length;
        summary.activeUsers = data.users.filter(u => !u.isBanned).length;
        break;
        
      case 'swaps':
        data.swaps = await Swap.find({
          createdAt: { $gte: fromDate, $lte: toDate }
        }).populate('requester provider', 'name email');
        summary.totalSwaps = data.swaps.length;
        summary.completedSwaps = data.swaps.filter(s => s.status === 'completed').length;
        break;
        
      case 'ratings':
        data.ratings = await Rating.find({
          createdAt: { $gte: fromDate, $lte: toDate }
        }).populate('rater rated', 'name email');
        summary.totalRatings = data.ratings.length;
        summary.averageRating = data.ratings.length > 0 
          ? data.ratings.reduce((sum, r) => sum + r.rating, 0) / data.ratings.length 
          : 0;
        break;
        
      case 'activity':
        data.users = await User.find().select('-password');
        data.swaps = await Swap.find({ createdAt: { $gte: fromDate, $lte: toDate } });
        data.ratings = await Rating.find({ createdAt: { $gte: fromDate, $lte: toDate } });
        
        summary.totalUsers = data.users.length;
        summary.totalSwaps = data.swaps.length;
        summary.totalRatings = data.ratings.length;
        summary.completedSwaps = data.swaps.filter(s => s.status === 'completed').length;
        summary.activeUsers = data.users.filter(u => 
          u.updatedAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;
        break;
        
      default:
        return res.status(400).json({ msg: 'Invalid report type' });
    }
    
    const report = new Report({
      type,
      generatedBy: req.user._id,
      dateRange: { from: fromDate, to: toDate },
      data,
      summary,
      fileName: `${type}_report_${Date.now()}.json`
    });
    
    await report.save();
    await report.populate('generatedBy', 'name email');
    
    res.json(report);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('generatedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(reports);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete inappropriate content (placeholder for content moderation)
exports.moderateContent = async (req, res) => {
  try {
    const { contentType, contentId, action, reason } = req.body;
    
    let result = {};
    
    if (contentType === 'swap' && action === 'reject') {
      const swap = await Swap.findByIdAndUpdate(
        contentId,
        { status: 'rejected' },
        { new: true }
      );
      
      if (swap) {
        // Notify users
        const notification = new Notification({
          recipient: swap.requester,
          type: 'admin_message',
          title: 'Swap Request Rejected',
          message: `Your swap request has been rejected by admin. Reason: ${reason}`
        });
        await notification.save();
        
        result.message = 'Swap request rejected';
        result.swap = swap;
      }
    } else if (contentType === 'user' && action === 'warn') {
      const notification = new Notification({
        recipient: contentId,
        type: 'admin_message',
        title: 'Content Warning',
        message: `Warning: ${reason}. Please review our community guidelines.`
      });
      await notification.save();
      
      result.message = 'Warning sent to user';
    }
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};