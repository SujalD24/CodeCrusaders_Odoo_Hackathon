const Swap = require('../models/swap');
const User = require('../models/user');
const Notification = require('../models/notification');

// Create a new swap request
exports.createSwap = async (req, res) => {
  try {
    const { providerId, skillOffered, skillWanted, description, proposedTime, duration, location, notes } = req.body;
    
    // Check if provider exists and has the offered skill
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({ msg: 'Provider not found' });
    }
    
    if (!provider.skillsOffered.includes(skillOffered)) {
      return res.status(400).json({ msg: 'Provider does not offer this skill' });
    }
    
    // Check if requester wants this skill
    const requester = await User.findById(req.user._id);
    if (!requester.skillsWanted.includes(skillWanted)) {
      return res.status(400).json({ msg: 'You have not listed this as a wanted skill' });
    }
    
    const swap = new Swap({
      requester: req.user._id,
      provider: providerId,
      skillOffered,
      skillWanted,
      description,
      proposedTime,
      duration,
      location,
      notes
    });
    
    await swap.save();
    
    // Create notification for provider
    const notification = new Notification({
      recipient: providerId,
      type: 'swap_request',
      title: 'New Swap Request',
      message: `${requester.name} wants to exchange ${skillWanted} for your ${skillOffered}`,
      relatedSwap: swap._id,
      relatedUser: req.user._id
    });
    await notification.save();
    
    await swap.populate(['requester', 'provider'], 'name email skillsOffered skillsWanted');
    res.status(201).json(swap);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get user's swap requests (sent and received)
exports.getUserSwaps = async (req, res) => {
  try {
    const { status, type } = req.query;
    let query = {};
    
    if (type === 'sent') {
      query.requester = req.user._id;
    } else if (type === 'received') {
      query.provider = req.user._id;
    } else {
      query = { $or: [{ requester: req.user._id }, { provider: req.user._id }] };
    }
    
    if (status) {
      query.status = status;
    }
    
    const swaps = await Swap.find(query)
      .populate('requester', 'name email skillsOffered skillsWanted')
      .populate('provider', 'name email skillsOffered skillsWanted')
      .sort({ createdAt: -1 });
    
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Accept a swap request
exports.acceptSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ msg: 'Swap not found' });
    }
    
    // Only the provider can accept
    if (swap.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Only the provider can accept this swap' });
    }
    
    if (swap.status !== 'pending') {
      return res.status(400).json({ msg: 'Swap is not pending' });
    }
    
    swap.status = 'accepted';
    swap.responseDate = new Date();
    await swap.save();
    
    // Create notification for requester
    const notification = new Notification({
      recipient: swap.requester,
      type: 'swap_accepted',
      title: 'Swap Request Accepted',
      message: `${req.user.name} accepted your swap request for ${swap.skillOffered}`,
      relatedSwap: swap._id,
      relatedUser: req.user._id
    });
    await notification.save();
    
    await swap.populate(['requester', 'provider'], 'name email skillsOffered skillsWanted');
    res.json(swap);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Reject a swap request
exports.rejectSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ msg: 'Swap not found' });
    }
    
    // Only the provider can reject
    if (swap.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Only the provider can reject this swap' });
    }
    
    if (swap.status !== 'pending') {
      return res.status(400).json({ msg: 'Swap is not pending' });
    }
    
    swap.status = 'rejected';
    swap.responseDate = new Date();
    await swap.save();
    
    // Create notification for requester
    const notification = new Notification({
      recipient: swap.requester,
      type: 'swap_rejected',
      title: 'Swap Request Rejected',
      message: `${req.user.name} declined your swap request for ${swap.skillOffered}`,
      relatedSwap: swap._id,
      relatedUser: req.user._id
    });
    await notification.save();
    
    await swap.populate(['requester', 'provider'], 'name email skillsOffered skillsWanted');
    res.json(swap);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Complete a swap
exports.completeSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ msg: 'Swap not found' });
    }
    
    // Both users can mark as complete
    if (swap.requester.toString() !== req.user._id.toString() && 
        swap.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'You are not part of this swap' });
    }
    
    if (swap.status !== 'accepted') {
      return res.status(400).json({ msg: 'Swap must be accepted before completion' });
    }
    
    swap.status = 'completed';
    swap.completionDate = new Date();
    await swap.save();
    
    // Update completed swaps count for both users
    await User.findByIdAndUpdate(swap.requester, { $inc: { completedSwaps: 1 } });
    await User.findByIdAndUpdate(swap.provider, { $inc: { completedSwaps: 1 } });
    
    // Create notifications for both users
    const otherUserId = swap.requester.toString() === req.user._id.toString() ? swap.provider : swap.requester;
    const otherUser = await User.findById(otherUserId);
    
    const notification = new Notification({
      recipient: otherUserId,
      type: 'swap_completed',
      title: 'Swap Completed',
      message: `${req.user.name} marked the swap for ${swap.skillOffered} as completed`,
      relatedSwap: swap._id,
      relatedUser: req.user._id
    });
    await notification.save();
    
    await swap.populate(['requester', 'provider'], 'name email skillsOffered skillsWanted');
    res.json(swap);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Cancel a swap request
exports.cancelSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ msg: 'Swap not found' });
    }
    
    // Only the requester can cancel
    if (swap.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Only the requester can cancel this swap' });
    }
    
    if (swap.status !== 'pending') {
      return res.status(400).json({ msg: 'Only pending swaps can be cancelled' });
    }
    
    swap.status = 'cancelled';
    await swap.save();
    
    await swap.populate(['requester', 'provider'], 'name email skillsOffered skillsWanted');
    res.json(swap);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get specific swap details
exports.getSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate('requester', 'name email skillsOffered skillsWanted')
      .populate('provider', 'name email skillsOffered skillsWanted');
    
    if (!swap) {
      return res.status(404).json({ msg: 'Swap not found' });
    }
    
    // Only participants can view swap details
    if (swap.requester._id.toString() !== req.user._id.toString() && 
        swap.provider._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    res.json(swap);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};