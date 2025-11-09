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

app.get('/system-stats', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const [
      usersSnapshot,
      propertiesSnapshot,
      unitsSnapshot,
      ticketsSnapshot,
      paymentsSnapshot,
      guestRequestsSnapshot
    ] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('properties').count().get(),
      db.collection('units').count().get(),
      db.collection('tickets').count().get(),
      db.collection('payments').count().get(),
      db.collection('guestRequests').count().get()
    ]);

    const activeTicketsSnapshot = await db.collection('tickets')
      .where('status', 'in', ['open', 'in_progress'])
      .count()
      .get();

    const recentPaymentsSnapshot = await db.collection('payments')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const totalRevenue = recentPaymentsSnapshot.docs.reduce((sum, doc) => {
      const data = doc.data();
      return sum + (data.amount || 0);
    }, 0);

    res.json({
      success: true,
      stats: {
        totalUsers: usersSnapshot.data().count,
        totalProperties: propertiesSnapshot.data().count,
        totalUnits: unitsSnapshot.data().count,
        totalTickets: ticketsSnapshot.data().count,
        activeTickets: activeTicketsSnapshot.data().count,
        totalPayments: paymentsSnapshot.data().count,
        totalRevenue,
        pendingGuestRequests: guestRequestsSnapshot.data().count
      }
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/revenue-report', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = db.collection('payments').orderBy('createdAt', 'desc');

    if (startDate) {
      query = query.where('createdAt', '>=', new Date(startDate));
    }

    if (endDate) {
      query = query.where('createdAt', '<=', new Date(endDate));
    }

    const snapshot = await query.get();
    const payments = [];
    let totalRevenue = 0;
    let totalCommission = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      payments.push({
        id: doc.id,
        ...data
      });
      totalRevenue += data.amount || 0;
      totalCommission += data.commission || 0;
    });

    res.json({
      success: true,
      report: {
        payments,
        totalRevenue,
        totalCommission,
        netRevenue: totalRevenue - totalCommission,
        paymentCount: payments.length
      }
    });
  } catch (error) {
    console.error('Error generating revenue report:', error);
    res.status(500).json({ error: error.message });
  }
});

export const analytics = onRequest(app);
