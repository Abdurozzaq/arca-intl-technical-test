'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { WorkLogApi, EmployeeApi } from '@/utils/api';

export default function WorkLogDetail() {
    const router = useRouter();
    const { id } = useParams();

    const [workLog, setWorkLog] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const workLogResponse = await WorkLogApi.getById(id);
                setWorkLog(workLogResponse.data);

                const employeesResponse = await EmployeeApi.getAll();
                setEmployees(employeesResponse.data);
            } catch (err) {
                setError(err.message || 'Failed to load work log data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const getEmployeeName = (employeeId) => {
        const employee = employees.find(e => e.id == employeeId);
        return employee ? employee.name : `Employee (ID: ${employeeId})`;
    };

    const calculateTotalHours = () => {
        if (!workLog) return 0;
        const collaboratorHours = workLog.collaborators?.reduce((sum, c) => sum + parseFloat(c.hours_spent), 0) || 0;
        return parseFloat(workLog.hours_spent) + collaboratorHours;
    };

    const calculateProratedPayment = () => {
        if (!workLog) return 0;

        const totalHours = calculateTotalHours();
        if (totalHours === 0) return 0;

        const totalPayment = (totalHours * parseFloat(workLog.hourly_rate)) + (parseFloat(workLog.additional_charges) || 0);
        const proratedRatio = parseFloat(workLog.hours_spent) / totalHours;

        return totalPayment * proratedRatio;
    };

    const getCollaboratorPayment = (collaboratorHours) => {
        const totalHours = calculateTotalHours();
        if (totalHours === 0) return 0;

        const totalPayment = (totalHours * parseFloat(workLog.hourly_rate)) + (parseFloat(workLog.additional_charges) || 0);
        const ratio = collaboratorHours / totalHours;

        return totalPayment * ratio;
    };

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-8">Loading work log...</div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="text-center py-8 text-red-500">Error: {error}</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
                <h1 className="text-2xl font-bold mb-6">Work Log Details</h1>

                <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm font-medium text-gray-500">Employee</div>
                            <div>{getEmployeeName(workLog.employee_id)}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Date</div>
                            <div>{new Date(workLog.date).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm font-medium text-gray-500">Hours Worked</div>
                            <div>{workLog.hours_spent}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Hourly Rate</div>
                            <div>${parseFloat(workLog.hourly_rate)?.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Additional Charges</div>
                            <div>${parseFloat(workLog.additional_charges)?.toFixed(2)}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm font-medium text-gray-500">Base Payment</div>
                            <div>${(parseFloat(workLog.hours_spent) * parseFloat(workLog.hourly_rate)).toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Total Before Prorate</div>
                            <div>${((parseFloat(workLog.hours_spent) * parseFloat(workLog.hourly_rate)) + (parseFloat(workLog.additional_charges) || 0)).toFixed(2)}</div>
                        </div>
                    </div>

                    {workLog.collaborators?.length > 0 && (
                        <>
                            <div className="border-t pt-4 mt-4">
                                <div className="text-sm font-medium text-gray-500">Proration Details</div>
                                <div className="mt-2 space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium">Total Hours (with collaborators):</span> {calculateTotalHours()}
                                    </div>
                                    <div>
                                        <span className="font-medium">Prorated Ratio:</span> {(parseFloat(workLog.hours_spent) / calculateTotalHours()).toFixed(2)}
                                    </div>
                                    <div>
                                        <span className="font-medium">Prorated Payment:</span> ${calculateProratedPayment().toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="border-t pt-4">
                        <div className="text-sm font-medium text-gray-500">Final Remuneration</div>
                        <div className="text-lg font-semibold">
                            ${calculateProratedPayment().toFixed(2)}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm font-medium text-gray-500">Description</div>
                        <p className="whitespace-pre-line mt-1 p-3 bg-gray-50 rounded">
                            {workLog.task_description}
                        </p>
                    </div>

                    {workLog.collaborators?.length > 0 && (
                        <div>
                            <div className="text-sm font-medium text-gray-500">Collaborators</div>
                            <div className="mt-2 space-y-2">
                                {workLog.collaborators.map((collaborator, index) => (
                                    <div key={index} className="p-3 border rounded flex justify-between items-center">
                                        <div>
                                            <div className="font-medium">
                                                {getEmployeeName(collaborator.employee_id)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {collaborator.hours_spent} hours
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            Contribution: ${getCollaboratorPayment(collaborator.hours_spent).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        onClick={() => router.push(`/work-logs/${id}/edit`)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Edit Work Log
                    </button>
                    <button
                        onClick={() => router.push('/work-logs')}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                    >
                        Back to List
                    </button>
                </div>
            </div>
        </Layout>
    );
}
