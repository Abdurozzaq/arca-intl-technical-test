'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {EmployeeApi} from '@/utils/api';
import Layout from '../../components/Layout';

export default function CreateEmployee() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        hourly_rate: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await EmployeeApi.create(formData);
            if (response.success) {
                router.push('/employees');
            } else {
                setErrors(response.errors || {});
            }
        } catch (error) {
            console.error('Error creating employee:', error);
            setErrors({submit: error.message});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Create New Employee</h1>
                        <p className="text-gray-600">Fill in the details below to add a new employee</p>
                    </div>

                    {errors.submit && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{errors.submit}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                                Position *
                            </label>
                            <input
                                type="text"
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.position ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 mb-1">
                                Hourly Rate ($)
                            </label>
                            <input
                                type="number"
                                id="hourly_rate"
                                name="hourly_rate"
                                min="0"
                                step="0.01"
                                value={formData.hourly_rate}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.hourly_rate ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.hourly_rate && <p className="mt-1 text-sm text-red-600">{errors.hourly_rate}</p>}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => router.push('/employees')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Employee'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}