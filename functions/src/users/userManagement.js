import { onRequest } from 'firebase-functions/v2/https';
import { initializeAdmin } from '../config/admin.js';
import { verifyAuth, verifyAdmin } from '../middleware/auth.js';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

initializeAdmin();
const admin = initializeAdmin();
const db = admin.firestore();

app.post('/create-admin', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: displayName || email.split('@')[0],
    });

    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.user.uid
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/update-user-role', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ error: 'User ID and role are required' });
    }

    const validRoles = ['admin', 'manager', 'owner', 'tenant', 'service_provider'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    await db.collection('users').doc(userId).update({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: req.user.uid
    });

    res.json({
      success: true,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/delete-user/:userId', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    await admin.auth().deleteUser(userId);
    await db.collection('users').doc(userId).delete();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/users', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { limit = 100, role, startAfter } = req.query;

    let query = db.collection('users').orderBy('createdAt', 'desc').limit(parseInt(limit));

    if (role) {
      query = query.where('role', '==', role);
    }

    if (startAfter) {
      const startDoc = await db.collection('users').doc(startAfter).get();
      query = query.startAfter(startDoc);
    }

    const snapshot = await query.get();
    const users = [];

    snapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

export const userManagement = onRequest(app);
