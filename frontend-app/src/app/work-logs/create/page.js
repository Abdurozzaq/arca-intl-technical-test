'use client';

import {useState, useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Layout from '../../components/Layout';
import {WorkLogApi, EmployeeApi} from '@/utils/api';

export default function CreateWorkLog() {
    const router = useRouter();

    const [form, setForm] = useState({
        employee_id: '',
        date: '',
        hours_spent: '',
        task_description: '',
    });

    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingEmployees, setFetchingEmployees] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            setFetchingEmployees(true);
            try {
                const data = await EmployeeApi.getAll();
                setEmployees(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setFetchingEmployees(false);
            }
        };

        fetchEmployees();
    }, []);

    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchEmployeeId = async () => {
            const employeeId = searchParams.get('employee_id');
            setForm({
                employee_id: employeeId,
                date: '',
                hours_spent: '',
                task_description: '',
            })
        };

        fetchEmployeeId();
    }, [searchParams]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await WorkLogApi.create(form);
            router.push('/work-logs');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
                <h1 className="text-2xl font-bold mb-6">Add New Work Log</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
                        Error: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Employee</label>
                        {fetchingEmployees ? (
                            <select
                                disabled
                                className="w-full border px-4 py-2 rounded bg-gray-100"
                            >
                                <option>Loading employees...</option>
                            </select>
                        ) : (
                            <select
                                name="employee_id"
                                value={form.employee_id}
                                onChange={handleChange}
                                className="w-full border px-4 py-2 rounded"
                                required
                            >
                                <option value="">Select an employee</option>
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Hours Worked</label>
                        <input
                            type="number"
                            step="0.1"
                            name="hours_spent"
                            value={form.hours_spent}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            name="task_description"
                            value={form.task_description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border px-4 py-2 rounded"
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
                            disabled={loading || fetchingEmployees}
                        >
                            {loading ? 'Saving...' : 'Save Work Log'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}