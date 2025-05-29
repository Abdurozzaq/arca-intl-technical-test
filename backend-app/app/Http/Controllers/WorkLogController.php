<?php

namespace App\Http\Controllers;

use App\Models\WorkLog;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WorkLogController extends Controller
{
    /**
     * Display a listing of the work logs.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $workLogs = WorkLog::with('employee')
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($workLog) {
                $workLog->total_remuneration = $workLog->calculateTotalRemuneration();
                return $workLog;
            });

        return response()->json([
            'success' => true,
            'data' => $workLogs
        ]);
    }

    /**
     * Store a newly created work log in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'task_description' => 'required|string|max:500',
            'date' => 'required|date',
            'hours_spent' => 'required|numeric|min:0.1|max:24',
            'additional_charges' => 'nullable|numeric|min:0',
            'collaborators' => 'nullable|array',
            'collaborators.*.employee_id' => 'required_with:collaborators|exists:employees,id',
            'collaborators.*.hours_spent' => 'required_with:collaborators|numeric|min:0.1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();  // Use validated data, not all input

        try {
            // Use validated data to get employee
            $employeeData = Employee::findOrFail($validated['employee_id']);  // safer than where+first
            $employeeArray = $employeeData->toArray();
            $hourlyRate = $employeeArray['hourly_rate'];
            $validated['hourly_rate'] = $hourlyRate;
            // Create the work log with validated data + hours_rate
            $workLog = WorkLog::create($validated);

            // Load employee relation and calculate remuneration
            $workLog->load('employee');
            $workLog->total_remuneration = $workLog->calculateTotalRemuneration();

            return response()->json([
                'success' => true,
                'data' => $workLog
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create work log',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified work log.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $workLog = WorkLog::with('employee')->find($id);

        if (!$workLog) {
            return response()->json([
                'success' => false,
                'message' => 'Work log not found'
            ], 404);
        }

        $workLog->total_remuneration = $workLog->calculateTotalRemuneration();

        return response()->json([
            'success' => true,
            'data' => $workLog
        ]);
    }

    /**
     * Update the specified work log in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $workLog = WorkLog::find($id);

        if (!$workLog) {
            return response()->json([
                'success' => false,
                'message' => 'Work log not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'employee_id' => 'sometimes|required|exists:employees,id',
            'task_description' => 'sometimes|required|string|max:500',
            'date' => 'sometimes|required|date',
            'hours_spent' => 'sometimes|required|numeric|min:0.1|max:24',
            'hourly_rate' => 'sometimes|required|numeric|min:0',
            'additional_charges' => 'nullable|numeric|min:0',
            'collaborators' => 'nullable|array',
            'collaborators.*.employee_id' => 'required_with:collaborators|exists:employees,id',
            'collaborators.*.hours_spent' => 'required_with:collaborators|numeric|min:0.1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        try {
            $workLog->update($validated);
            $workLog->load('employee');
            $workLog->total_remuneration = $workLog->calculateTotalRemuneration();

            return response()->json([
                'success' => true,
                'data' => $workLog
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update work log',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified work log from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $workLog = WorkLog::find($id);

        if (!$workLog) {
            return response()->json([
                'success' => false,
                'message' => 'Work log not found'
            ], 404);
        }

        try {
            $workLog->delete();

            return response()->json([
                'success' => true,
                'message' => 'Work log deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete work log',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get work logs for a specific employee
     *
     * @param  int  $employeeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByEmployee($employeeId)
    {
        $employee = Employee::find($employeeId);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $workLogs = $employee->workLogs()
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($workLog) {
                $workLog->total_remuneration = $workLog->calculateTotalRemuneration();
                return $workLog;
            });

        return response()->json([
            'success' => true,
            'data' => $workLogs
        ]);
    }
}
