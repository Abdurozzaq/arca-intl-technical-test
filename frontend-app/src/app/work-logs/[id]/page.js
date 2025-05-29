'use client';

import {useParams, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import Layout from '../../components/Layout';
import {WorkLogApi} from '@/utils/api';

export default function WorkLogDetail() {
    const router = useRouter();
    const {id} = useParams();

    const [workLog, setWorkLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchWorkLog = async () => {
            try {
                const response = await WorkLogApi.getById(id);
                setWorkLog(response.data);
            } catch (err) {
                setError('Work log not found');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkLog();
    }, [id]);

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
                <h1 className="text-2xl font-bold mb-6">Work Log Detail</h1>
                <div className="space-y-4 text-gray-700">
                    <div>
                        <strong>ID:</strong> {workLog.id}
                    </div>
                    <div>
                        <strong>Employee ID:</strong> {workLog.employee_id}
                    </div>
                    <div>
                        <strong>Date:</strong> {new Date(workLog.date).toLocaleDateString('en-US', {day: '2-digit', month: 'long', year: 'numeric'}).replace(',', '')}
                    </div>
                    <div>
                        <strong>Hours Worked:</strong> {workLog.hours_spent}
                    </div>
                    <div>
                        <strong>Description:</strong> <p className="whitespace-pre-line">{workLog.task_description}</p>
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        onClick={() => router.push(`/work-logs/${id}/edit`)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Edit
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
