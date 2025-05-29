'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {WorkLogApi} from '@/utils/api';
import Layout from '../components/Layout';

export default function WorkLogList() {
    const [workLogs, setWorkLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadWorkLogs = async () => {
            try {
                const response = await WorkLogApi.getAll();
                setWorkLogs(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadWorkLogs();
    }, []);

    const filteredWorkLogs = workLogs.filter(log =>
        log.task_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.date.includes(searchTerm)
    );

    if (loading) return <Layout>
        <div className="text-center py-8">Loading work logs...</div>
    </Layout>;
    if (error) return <Layout>
        <div className="text-center py-8 text-red-500">Error: {error}</div>
    </Layout>;

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h1 className="text-2xl font-bold mb-4 md:mb-0">Work Logs</h1>
                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search work logs..."
                            className="px-4 py-2 border rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Link href="/work-logs/create" className="mt-2">
                            <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center">
                                Add New Work Log
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {filteredWorkLogs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No work logs found
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredWorkLogs.map((log) => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {log.employee?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.date).toLocaleDateString('en-US', {day: '2-digit', month: 'long', year: 'numeric'}).replace(',', '')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.hours_spent}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.task_description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link href={`/work-logs/${log.id}/edit`}>
                                            <span className="text-green-600 hover:text-green-900 mr-4">Edit</span>
                                        </Link>
                                        <Link href={`/work-logs/${log.id}`}>
                                            <span className="text-blue-600 hover:text-blue-900">View</span>
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
