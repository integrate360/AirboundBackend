const Notification = require("../models/Notifications.js");

const addNotification = async (req, res) => {
  try {
    const { title, message, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const newNotification = await Notification.create({
      title,
      message,
      userId,
    });

    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markNotificationAsReadByUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Mark all unread notifications as read
    await Notification.updateMany(
      { userId: id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json("Notification viewed");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );

    if (!deletedNotification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    res.status(200).json({ message: "Notification deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch unread notifications count
    const count = await Notification.countDocuments({ userId, isRead: false });

    // Return the count of unread notifications
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addNotification,
  getAllNotifications,
  markNotificationAsReadByUser,
  markNotificationAsRead,
  deleteNotification,
  getUnreadNotificationCount,
};
