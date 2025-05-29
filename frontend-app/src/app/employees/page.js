'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {EmployeeApi} from '@/utils/api';
import Layout from '../components/Layout';

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const response = await EmployeeApi.getAll();
                setEmployees(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadEmployees();
    }, []);

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Layout>
        <div className="text-center py-8">Loading employees...</div>
    </Layout>;
    if (error) return <Layout>
        <div className="text-center py-8 text-red-500">Error: {error}</div>
    </Layout>;

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h1 className="text-2xl font-bold mb-4 md:mb-0">Employee Management</h1>
                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="px-4 py-2 border rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Link href="/employees/create" className="mt-2">
                            <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center">
                                Add New Employee
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {filteredEmployees.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No employees found
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hourly
                                    Rate
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div
                                                className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {employee.name.charAt(0).toUpperCase()}
                          </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${parseFloat(employee.hourly_rate)?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link href={`/employees/${employee.id}`}>
                                            <span className="text-blue-600 hover:text-blue-900 mr-4">View</span>
                                        </Link>
                                        <Link href={`/employees/${employee.id}/edit`}>
                                            <span className="text-green-600 hover:text-green-900 mr-4">Edit</span>
                                        </Link>
                                        <Link href={`/employees/${employee.id}/work-logs`}>
                                            <span className="text-purple-600 hover:text-purple-900">Work Logs</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
}