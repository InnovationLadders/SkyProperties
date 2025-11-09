import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ref, get } from 'firebase/database';
import { db } from '../../services/firebase';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Building2, Home, Ticket, DollarSign } from 'lucide-react';

export const Analytics = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUnits: 0,
    totalTickets: 0,
    totalPayments: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [propertiesSnap, unitsSnap, ticketsSnap, paymentsSnap] = await Promise.all([
        get(ref(db, 'properties')),
        get(ref(db, 'units')),
        get(ref(db, 'tickets')),
        get(ref(db, 'payments')),
      ]);

      const properties = propertiesSnap.exists() ? Object.keys(propertiesSnap.val()) : [];
      const units = unitsSnap.exists() ? Object.keys(unitsSnap.val()) : [];
      const tickets = ticketsSnap.exists() ? Object.keys(ticketsSnap.val()) : [];
      const payments = paymentsSnap.exists() ? Object.values(paymentsSnap.val()) : [];

      const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

      setStats({
        totalProperties: properties.length,
        totalUnits: units.length,
        totalTickets: tickets.length,
        totalPayments: payments.length,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t('admin.analytics')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Properties
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalProperties}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Units
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUnits}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Tickets
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalTickets}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
