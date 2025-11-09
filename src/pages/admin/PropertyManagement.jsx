import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ref as dbRef, get, set, update, remove, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export const PropertyManagement = () => {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    description: '',
    managerId: '',
  });
  const [modelFile, setModelFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const filtered = properties.filter(property =>
      property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(filtered);
  }, [searchTerm, properties]);

  const fetchProperties = async () => {
    try {
      const propertiesReference = dbRef(db, 'properties');
      const snapshot = await get(propertiesReference);
      if (snapshot.exists()) {
        const propertiesData = Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...data
        }));
        setProperties(propertiesData);
        setFilteredProperties(propertiesData);
      } else {
        setProperties([]);
        setFilteredProperties([]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = () => {
    setFormData({
      name: '',
      city: '',
      description: '',
      managerId: '',
    });
    setModelFile(null);
    setThumbnailFile(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property) => {
    setFormData({
      name: property.name,
      city: property.city,
      description: property.description,
      managerId: property.managerId || '',
    });
    setSelectedProperty(property);
    setModelFile(null);
    setThumbnailFile(null);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      let modelUrl = isEditMode ? selectedProperty.modelUrl : null;
      let thumbnailUrl = isEditMode ? selectedProperty.thumbnail : null;

      if (modelFile) {
        const modelReference = storageRef(storage, `properties/${Date.now()}_${modelFile.name}`);
        await uploadBytes(modelReference, modelFile);
        modelUrl = await getDownloadURL(modelReference);
      }

      if (thumbnailFile) {
        const thumbnailReference = storageRef(storage, `thumbnails/${Date.now()}_${thumbnailFile.name}`);
        await uploadBytes(thumbnailReference, thumbnailFile);
        thumbnailUrl = await getDownloadURL(thumbnailReference);
      }

      const propertyData = {
        ...formData,
        modelUrl,
        thumbnail: thumbnailUrl,
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode) {
        const propertyReference = dbRef(db, `properties/${selectedProperty.id}`);
        await update(propertyReference, propertyData);
      } else {
        const propertiesReference = dbRef(db, 'properties');
        const newPropertyRef = push(propertiesReference);
        await set(newPropertyRef, {
          ...propertyData,
          createdAt: new Date().toISOString(),
        });
      }

      await fetchProperties();
      setIsModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const propertyReference = dbRef(db, `properties/${propertyId}`);
      await remove(propertyReference);
      await fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('admin.properties')}
        </h2>
        <Button variant="primary" onClick={handleAddProperty}>
          <Plus className="w-5 h-5 mr-2" />
          {t('property.addProperty')}
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
                {t('property.propertyName')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('property.city')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('property.description')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProperties.map((property) => (
              <tr key={property.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {property.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {property.city}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {property.description?.substring(0, 50)}
                  {property.description?.length > 50 && '...'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditProperty(property)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProperty(property.id)}
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
        title={isEditMode ? t('property.editProperty') : t('property.addProperty')}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('property.propertyName')}
            </label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('property.city')}
            </label>
            <Input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('property.description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('property.model')} (GLB File)
            </label>
            <input
              type="file"
              accept=".glb,.gltf"
              onChange={(e) => setModelFile(e.target.files[0])}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('property.thumbnail')}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
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
