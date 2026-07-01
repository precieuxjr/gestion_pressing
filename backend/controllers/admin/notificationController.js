import Notification from '../../models/Notification.js';

export const getUnreadNotifications = async (req, res) => {
  try {
    const userPublicId = req.user.public_id;
    const notifications = await Notification.getUnreadByUser(userPublicId);
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('❌ Erreur getUnreadNotifications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.markAsRead(id);
    res.json({ success: true, message: 'Notification marquée comme lue' });
  } catch (error) {
    console.error('❌ Erreur markAsRead:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userPublicId = req.user.public_id;
    await Notification.markAllAsRead(userPublicId);
    res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    console.error('❌ Erreur markAllAsRead:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};