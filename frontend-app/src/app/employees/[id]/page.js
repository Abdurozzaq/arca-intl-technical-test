'use client';
import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import Link from 'next/link';
import {EmployeeApi} from '@/utils/api';
import Layout from '../../components/Layout';

export default function EmployeeDetail() {
    const router = useRouter();
    const {id} = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            try {
                const [employeeRes, statsRes] = await Promise.all([
                    EmployeeApi.getById(id),
                    EmployeeApi.getStatistics(id),
                ]);

                if (employeeRes.success) {
                    setEmployee(employeeRes.data);
                } else {
                    setError(employeeRes.message || 'Failed to load employee');
                }

                if (statsRes.success) {
                    setStatistics(statsRes.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleDelete = async () => {
        try {
            const response = await EmployeeApi.delete(id);
            if (response.success) {
                router.push('/employees');
            } else {
                setError(response.message || 'Failed to delete employee');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <Layout>
        <div className="text-center py-8">Loading employee data...</div>
    </Layout>;
    if (error) return <Layout>
        <div className="text-center py-8 text-red-500">Error: {error}</div>
    </Layout>;
    if (!employee) return <Layout>
        <div className="text-center py-8">Employee not found</div>
    </Layout>;

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">{employee.name}</h1>
                        <p className="text-gray-600">{employee.position}</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-3">
                        <Link href={`/employees/${id}/edit`} className="mt-2">
                            <span className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                Edit
                            </span>
                        </Link>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium mb-4">Basic Information</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{employee.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Hourly Rate</p>
                                <p className="font-medium">${parseFloat(employee.hourly_rate)?.toFixed(2) || '0.00'}</p>
                            </div>
                        </div>
                    </div>

                    {statistics && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium mb-4">Work Statistics</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Total Hours Worked</p>
                                    <p className="font-medium">{statistics.total_hours}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Remuneration</p>
                                    <p className="font-medium">${statistics.total_remuneration.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Average Hourly Rate</p>
                                    <p className="font-medium">${statistics.average_hourly_rate.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link href={`/employees/${id}/work-logs`}>
                                <span className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center">
                                    View Work Logs
                                </span>
                            </Link>
                            <Link href={`/work-logs/create?employee_id=${id}`}>
                                <span className="block px-4 py-2 mt-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-center">
                                    Add Work Log
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                            <p className="mb-6">Are you sure you want to delete {employee.name}? This action cannot be
                                undone.</p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Delete Employee
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}