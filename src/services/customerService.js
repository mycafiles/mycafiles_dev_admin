import api from './api';

export const customerService = {
    getCustomers: async () => {
        const response = await api.get('/customer/view');
        return response.data;
    },

    getCustomerById: async (id) => {
        // Assume backend has GET /api/customer/:id or filter by id in frontend
        // For now, we fetch all and find, or we can assume a route exists
        const response = await api.get(`/customer/view`);
        return response.data.data.find(c => c._id === id);
    },

    createCustomer: async (customerData) => {
        const response = await api.post('/customer/create', customerData);
        return response.data;
    },

    updateCustomer: async (id, customerData) => {
        const response = await api.put(`/customer/edit/${id}`, customerData);
        return response.data;
    },

    deleteCustomer: async (id) => {
        const response = await api.delete(`/customer/delete/${id}`);
        return response.data;
    },

    bulkUpload: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/customer/bulk', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};
