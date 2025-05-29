'use client';

import {useParams, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import Layout from '../../../components/Layout';
import {WorkLogApi} from '@/utils/api';

export default function EditWorkLog() {
    const router = useRouter();
    const {id} = useParams();

    const [form, setForm] = useState({
        employee_id: '',
        date: '',
        hours_spent: '',
        task_description: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;

        const loadWorkLog = async () => {
            try {
                const res = await WorkLogApi.getById(id);
                const data = res.data;
                setForm({
                    employee_id: data.employee_id || '',
                    date: new Date(data.date).toISOString().split('T')[0] || '',
                    hours_spent: data.hours_spent || '',
                    task_description: data.task_description || ''
                });
            } catch (err) {
                setError('Failed to load work log');
            } finally {
                setLoading(false);
            }
        };

        loadWorkLog();
    }, [id]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await WorkLogApi.update(id, form);
            router.push(`/work-logs/${id}`);
        } catch (err) {
            alert('Failed to update work log.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Layout>
        <div className="text-center py-8">Loading...</div>
    </Layout>;
    if (error) return <Layout>
        <div className="text-center text-red-500 py-8">{error}</div>
    </Layout>;

    return (
        <Layout>
            <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6">Edit Work Log</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Employee ID</label>
                        <input
                            type="number"
                            name="employee_id"
                            value={form.employee_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Hours Worked</label>
                        <input
                            type="number"
                            name="hours_spent"
                            value={form.hours_spent}
                            onChange={handleChange}
                            step="0.1"
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Description</label>
                        <textarea
                            name="task_description"
                            value={form.task_description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            {submitting ? 'Updating...' : 'Update Work Log'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push(`/work-logs/${id}`)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
