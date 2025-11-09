import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export const UnitManagement = () => {
  const { t } = useTranslation();
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    unitNumber: '',
    propertyId: '',
    floor: '',
    type: 'apartment',
    area: '',
    rentValue: '',
    saleValue: '',
    status: 'available',
    ownerId: '',
    tenantId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = units.filter(unit =>
      unit.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUnits(filtered);
  }, [searchTerm, units]);

  const fetchData = async () => {
    try {
      const [unitsSnapshot, propertiesSnapshot] = await Promise.all([
        getDocs(collection(db, 'units')),
        getDocs(collection(db, 'properties'))
      ]);

      const unitsData = unitsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const propertiesData = propertiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUnits(unitsData);
      setFilteredUnits(unitsData);
      setProperties(propertiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUnit = () => {
    setFormData({
      unitNumber: '',
      propertyId: '',
      floor: '',
      type: 'apartment',
      area: '',
      rentValue: '',
      saleValue: '',
      status: 'available',
      ownerId: '',
      tenantId: '',
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditUnit = (unit) => {
    setFormData(unit);
    setSelectedUnit(unit);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const unitData = {
        ...formData,
        area: parseFloat(formData.area),
        rentValue: parseFloat(formData.rentValue),
        saleValue: parseFloat(formData.saleValue),
        floor: parseInt(formData.floor),
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode) {
        await updateDoc(doc(db, 'units', selectedUnit.id), unitData);
      } else {
        await addDoc(collection(db, 'units'), {
          ...unitData,
          createdAt: new Date().toISOString(),
          media: [],
          coordinates: { x: 0, y: 0, z: 0 },
        });
      }

      await fetchData();
      setIsModalOpen(false);
      setSelectedUnit(null);
    } catch (error) {
      console.error('Error saving unit:', error);
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (!window.confirm('Are you sure you want to delete this unit?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'units', unitId));
      await fetchData();
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  };

  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property?.name || 'N/A';
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('admin.units')}
        </h2>
        <Button variant="primary" onClick={handleAddUnit}>
          <Plus className="w-5 h-5 mr-2" />
          {t('unit.addUnit')}
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('unit.unitNumber')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('unit.floor')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('unit.type')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('unit.area')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('unit.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUnits.map((unit) => (
              <tr key={unit.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {unit.unitNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {getPropertyName(unit.propertyId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {unit.floor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {unit.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {unit.area} sqm
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    unit.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    unit.status === 'occupied' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {unit.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditUnit(unit)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUnit(unit.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? t('unit.editUnit') : t('unit.addUnit')}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('unit.unitNumber')}
              </label>
              <Input
                type="text"
                required
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property
              </label>
              <select
                value={formData.propertyId}
                onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Property</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('unit.floor')}
              </label>
              <Input
                type="number"
                required
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('unit.type')}
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="apartment">{t('unit.types.apartment')}</option>
                <option value="villa">{t('unit.types.villa')}</option>
                <option value="office">{t('unit.types.office')}</option>
                <option value="shop">{t('unit.types.shop')}</option>
                <option value="warehouse">{t('unit.types.warehouse')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('unit.area')}
              </label>
              <Input
                type="number"
                step="0.01"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('unit.rentValue')}
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.rentValue}
                onChange={(e) => setFormData({ ...formData, rentValue: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('unit.saleValue')}
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.saleValue}
                onChange={(e) => setFormData({ ...formData, saleValue: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('unit.status')}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="available">{t('unit.available')}</option>
                <option value="occupied">{t('unit.occupied')}</option>
                <option value="forRent">{t('unit.forRent')}</option>
                <option value="forSale">{t('unit.forSale')}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
