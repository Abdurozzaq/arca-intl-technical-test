
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
        additional_charges: '0',
        collaborators: []
    });

    const [collaboratorInput, setCollaboratorInput] = useState({
        employee_id: '',
        hours_spent: ''
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
            setForm(prev => ({
                ...prev,
                employee_id: employeeId || '',
                date: '',
                hours_spent: '',
                task_description: '',
                additional_charges: '0',
                collaborators: []
            }));
        };

        fetchEmployeeId();
    }, [searchParams]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleCollaboratorChange = (e) => {
        const {name, value} = e.target;
        setCollaboratorInput((prev) => ({...prev, [name]: value}));
    };

    const addCollaborator = () => {
        if (!collaboratorInput.employee_id || !collaboratorInput.hours_spent) {
            setError('Please select employee and enter hours for collaborator');
            return;
        }

        const employee = employees.find(e => e.id == collaboratorInput.employee_id);

        setForm(prev => ({
            ...prev,
            collaborators: [
                ...prev.collaborators,
                {
                    employee_id: collaboratorInput.employee_id,
                    hours_spent: collaboratorInput.hours_spent,
                    name: employee.name
                }
            ]
        }));

        setCollaboratorInput({
            employee_id: '',
            hours_spent: ''
        });
    };

    const removeCollaborator = (index) => {
        setForm(prev => ({
            ...prev,
            collaborators: prev.collaborators.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...form,
                hours_spent: parseFloat(form.hours_spent),
                additional_charges: parseFloat(form.additional_charges || '0'),
                collaborators: form.collaborators.map(c => ({
                    employee_id: c.employee_id,
                    hours_spent: parseFloat(c.hours_spent)
                }))
            };

            await WorkLogApi.create(payload);
            router.push('/work-logs');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const availableEmployees = employees.filter(emp =>
        emp.id !== form.employee_id &&
        !form.collaborators.some(c => c.employee_id == emp.id)
    );

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
                            min="0.1"
                            max="24"
                            name="hours_spent"
                            value={form.hours_spent}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Additional Charges</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            name="additional_charges"
                            value={form.additional_charges}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded"
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

                    <div className="border-t pt-4 mt-4">
                        <h2 className="text-lg font-medium mb-3">Collaborators</h2>

                        {form.collaborators.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {form.collaborators.map((collaborator, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <div>
                                            <span className="font-medium">
                                                {employees.find(e => e.id == collaborator.employee_id)?.name || 'Unknown'}
                                            </span>
                                            <span className="ml-2 text-gray-600">
                                                ({collaborator.hours_spent} hours)
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeCollaborator(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex space-x-2">
                            <select
                                name="employee_id"
                                value={collaboratorInput.employee_id}
                                onChange={handleCollaboratorChange}
                                className="flex-1 border px-3 py-2 rounded"
                                disabled={availableEmployees.length === 0}
                            >
                                <option value="">Select collaborator</option>
                                {availableEmployees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                step="0.1"
                                min="0.1"
                                name="hours_spent"
                                value={collaboratorInput.hours_spent}
                                onChange={handleCollaboratorChange}
                                placeholder="Hours"
                                className="w-24 border px-3 py-2 rounded"
                            />

                            <button
                                type="button"
                                onClick={addCollaborator}
                                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                                disabled={!collaboratorInput.employee_id || !collaboratorInput.hours_spent}
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => router.push('/work-logs')}
                            className="mr-4 bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded"
                        >
                            Cancel
                        </button>
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