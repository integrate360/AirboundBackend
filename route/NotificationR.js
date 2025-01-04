const express = require('express');
const {
  addNotification,
  getUnreadNotificationCount,
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
  markNotificationAsReadByUser,
} = require('../controller/NotificationC');

const router = express.Router();

// Add a new notification
router.post('/notifications', addNotification);

// Get unread notification count for a user
router.get('/notifications/count/:userId', getUnreadNotificationCount);

// Get all notifications for a user
router.get('/notifications/:userId', getAllNotifications);

// Mark a notification as read
router.put('/notifications/:notificationId', markNotificationAsRead);
router.put('/notifications/user/:id', markNotificationAsReadByUser);

// Delete a notification
router.delete('/notifications/:notificationId', deleteNotification);

module.exports = router;
