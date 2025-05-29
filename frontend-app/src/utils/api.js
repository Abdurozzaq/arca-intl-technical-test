// utils/api.js
const API_BASE_URL = 'https://betest.notesure.web.id/api';

// Helper function to handle API requests
const fetchApi = async (endpoint, options = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Employee API endpoints
export const EmployeeApi = {
    getAll: async () => {
        return fetchApi('/employees');
    },

    getById: async (id) => {
        return fetchApi(`/employees/${id}`);
    },

    create: async (employeeData) => {
        return fetchApi('/employees', {
            method: 'POST',
            body: JSON.stringify(employeeData),
        });
    },

    update: async (id, employeeData) => {
        return fetchApi(`/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(employeeData),
        });
    },

    delete: async (id) => {
        return fetchApi(`/employees/${id}`, {
            method: 'DELETE',
        });
    },

    getStatistics: async (id) => {
        return fetchApi(`/employees/${id}/statistics`);
    },

    getWorkLogs: async (id) => {
        return fetchApi(`/employees/${id}/work-logs`);
    },
};

// WorkLog API endpoints
export const WorkLogApi = {
    getAll: async () => {
        return fetchApi('/work-logs');
    },

    getById: async (id) => {
        return fetchApi(`/work-logs/${id}`);
    },

    create: async (workLogData) => {
        return fetchApi('/work-logs', {
            method: 'POST',
            body: JSON.stringify(workLogData),
        });
    },

    update: async (id, workLogData) => {
        return fetchApi(`/work-logs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(workLogData),
        });
    },

    delete: async (id) => {
        return fetchApi(`/work-logs/${id}`, {
            method: 'DELETE',
        });
    },

    // Special endpoint for creating work logs with collaborators
    createWithCollaborators: async (mainWorkLogData, collaboratorsData) => {
        const payload = {
            ...mainWorkLogData,
            collaborators: collaboratorsData,
        };
        return fetchApi('/work-logs', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },
};

// Combined API object for easier imports
const ApiService = {
    employees: EmployeeApi,
    workLogs: WorkLogApi,
};

export default ApiService;