import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Building2, Home, Ticket, DollarSign, Settings, BarChart3, MessageSquare } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { PropertyManagement } from './PropertyManagement';
import { UnitManagement } from './UnitManagement';
import { TicketManagement } from './TicketManagement';
import { PaymentManagement } from './PaymentManagement';
import { SystemSettings } from './SystemSettings';
import { Analytics } from './Analytics';
import { GuestRequests } from './GuestRequests';

export const AdminPanel = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: t('admin.users'), icon: Users, component: UserManagement },
    { id: 'properties', label: t('admin.properties'), icon: Building2, component: PropertyManagement },
    { id: 'units', label: t('admin.units'), icon: Home, component: UnitManagement },
    { id: 'tickets', label: t('admin.tickets'), icon: Ticket, component: TicketManagement },
    { id: 'payments', label: t('admin.payments'), icon: DollarSign, component: PaymentManagement },
    { id: 'guests', label: t('admin.guestRequests'), icon: MessageSquare, component: GuestRequests },
    { id: 'analytics', label: t('admin.analytics'), icon: BarChart3, component: Analytics },
    { id: 'settings', label: t('admin.settings'), icon: Settings, component: SystemSettings },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {t('admin.title')}
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
