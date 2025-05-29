'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EmployeeApi } from '@/utils/api';
import Layout from '../../../components/Layout';
import {useParams} from "next/navigation";

export default function EmployeeWorkLogs() {
    const router = useRouter();
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [workLogs, setWorkLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            try {
                const [employeeRes, workLogsRes] = await Promise.all([
                    EmployeeApi.getById(id),
                    EmployeeApi.getWorkLogs(id),
                ]);

                if (employeeRes.success) {
                    setEmployee(employeeRes.data);
                } else {
                    setError(employeeRes.message || 'Failed to load employee');
                }

                if (workLogsRes.success) {
                    setWorkLogs(workLogsRes.data);
                } else {
                    setError(workLogsRes.message || 'Failed to load work logs');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) return <Layout><div className="text-center py-8">Loading data...</div></Layout>;
    if (error) return <Layout><div className="text-center py-8 text-red-500">Error: {error}</div></Layout>;
    if (!employee) return <Layout><div className="text-center py-8">Employee not found</div></Layout>;

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Work Logs for {employee.name}</h1>
                    <Link href={`/work-logs/create?employee_id=${id}`}>
                        <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                            Add New Work Log
                        </span>
                    </Link>
                </div>

                {workLogs.length === 0 ? (
                    <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
                        No work logs found for this employee
                    </div>
                ) : (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {workLogs.map((log) => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(log.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">{log.task_description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{log.hours_spent}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">${parseFloat(log.hourly_rate).toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${(log.hours_spent * log.hourly_rate).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link href={`/work-logs/${log.id}`}>
                                            <span className="text-blue-600 hover:text-blue-900">View</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}