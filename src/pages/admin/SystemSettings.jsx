import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';

export const SystemSettings = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    commissionRate: '5',
    rentCollectionFee: '2',
    maintenanceFee: '10',
    systemEmail: 'admin@skyproperties.com',
    systemPhone: '+1234567890',
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t('admin.settings')}
      </h2>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Commission & Fees
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Commission Rate (%)
              </label>
              <Input
                type="number"
                step="0.1"
                value={settings.commissionRate}
                onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rent Collection Fee (%)
              </label>
              <Input
                type="number"
                step="0.1"
                value={settings.rentCollectionFee}
                onChange={(e) => setSettings({ ...settings, rentCollectionFee: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maintenance Fee ($)
              </label>
              <Input
                type="number"
                step="0.01"
                value={settings.maintenanceFee}
                onChange={(e) => setSettings({ ...settings, maintenanceFee: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Contact Information
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System Email
              </label>
              <Input
                type="email"
                value={settings.systemEmail}
                onChange={(e) => setSettings({ ...settings, systemEmail: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System Phone
              </label>
              <Input
                type="tel"
                value={settings.systemPhone}
                onChange={(e) => setSettings({ ...settings, systemPhone: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            {t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};
