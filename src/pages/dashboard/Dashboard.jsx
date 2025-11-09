import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Building2, Home, Ticket, User } from 'lucide-react';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('dashboard.overview')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {userProfile?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    My Properties
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
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
                    My Units
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
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
                    Open Tickets
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
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
                    Profile
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {userProfile?.role}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('dashboard.recentActivity')}
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                No recent activity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('dashboard.quickActions')}
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-primary-50 dark:bg-primary-900/20 text-primary hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors">
                  View My Properties
                </button>
                <button className="w-full text-left px-4 py-3 bg-secondary-50 dark:bg-secondary-900/20 text-secondary hover:bg-secondary-100 dark:hover:bg-secondary-900/30 rounded-lg transition-colors">
                  Create Ticket
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
