import { getAdmin } from '../config/admin.js';

export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const admin = getAdmin();

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    const admin = getAdmin();
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(403).json({ error: 'Forbidden: User not found' });
    }

    const userData = userDoc.data();
    if (userData.role !== 'admin' && userData.role !== 'manager') {
      return res.status(403).json({ error: 'Forbidden: Admin or Manager role required' });
    }

    req.userRole = userData.role;
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
