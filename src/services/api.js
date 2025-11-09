import { auth } from './firebase';

const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL || 'http://localhost:5001/skyproperties-cf5c7/us-central1';

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return await user.getIdToken();
};

const makeAuthenticatedRequest = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${FUNCTIONS_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export const userManagementAPI = {
  createAdmin: async (email, password, displayName) => {
    return makeAuthenticatedRequest('/userManagement/create-admin', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
  },

  updateUserRole: async (userId, role) => {
    return makeAuthenticatedRequest('/userManagement/update-user-role', {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    });
  },

  deleteUser: async (userId) => {
    return makeAuthenticatedRequest(`/userManagement/delete-user/${userId}`, {
      method: 'DELETE',
    });
  },

  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return makeAuthenticatedRequest(`/userManagement/users?${queryParams}`);
  },
};

export const analyticsAPI = {
  getSystemStats: async () => {
    return makeAuthenticatedRequest('/analytics/system-stats');
  },

  getRevenueReport: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return makeAuthenticatedRequest(`/analytics/revenue-report?${params.toString()}`);
  },
};
