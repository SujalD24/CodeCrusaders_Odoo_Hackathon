const Notification = require('../models/notification');

// Get user's notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    let query = { recipient: req.user._id };
    
    if (unreadOnly === 'true') {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .populate('relatedUser', 'name email')
      .populate('relatedSwap', 'skillOffered skillWanted status')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });
    
    res.json({
      notifications,
      unreadCount,
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

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    
    // Check if user owns this notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );
    
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    
    // Check if user owns this notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    await Notification.findByIdAndDelete(notificationId);
    res.json({ msg: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get notification statistics
exports.getNotificationStats = async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments({ recipient: req.user._id });
    const unreadNotifications = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });
    
    // Get notification counts by type
    const notificationsByType = await Notification.aggregate([
      { $match: { recipient: req.user._id } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    res.json({
      total: totalNotifications,
      unread: unreadNotifications,
      byType: notificationsByType
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};