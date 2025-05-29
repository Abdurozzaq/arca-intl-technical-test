<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the employees.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $employees = Employee::orderBy('name', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $employees
        ]);
    }

    /**
     * Store a newly created employee in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email',
            'position' => 'required|string|max:255',
            'hourly_rate' => 'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $employee = Employee::create($validator->validated());

            return response()->json([
                'success' => true,
                'data' => $employee
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create employee',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified employee.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $employee
        ]);
    }

    /**
     * Update the specified employee in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:employees,email,'.$id,
            'position' => 'sometimes|required|string|max:255',
            'hourly_rate' => 'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $employee->update($validator->validated());

            return response()->json([
                'success' => true,
                'data' => $employee
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update employee',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified employee from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        // Check if employee has work logs before deleting
        if ($employee->workLogs()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete employee with existing work logs'
            ], 400);
        }

        try {
            $employee->delete();

            return response()->json([
                'success' => true,
                'message' => 'Employee deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete employee',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get employee statistics (total hours worked, total remuneration)
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics($id)
    {
        $employee = Employee::with('workLogs')->find($id);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $totalHours = $employee->workLogs->sum('hours_spent');

        // Total dari workLogs yang dimiliki sendiri
        $ownRemuneration = $employee->workLogs->reduce(function ($carry, $workLog) {
            return $carry + $workLog->calculateTotalRemuneration();
        }, 0);

        // ✅ Ambil semua worklog di mana employee jadi collaborator
        $collabLogs = \App\Models\WorkLog::all()->filter(function ($log) use ($employee) {
            return collect($log->collaborators)->contains(function ($collab) use ($employee) {
                return strval($collab['employee_id']) === strval($employee->id);
            });
        });

        // Total remuneration dari kontribusi sebagai collaborator
        $collabRemuneration = $collabLogs->reduce(function ($carry, $log) use ($employee) {
            return $carry + $log->getCollaboratorRemuneration($employee->id);
        }, 0);

        $totalRemuneration = $ownRemuneration + $collabRemuneration;

        return response()->json([
            'success' => true,
            'data' => [
                'total_hours' => $totalHours,
                'total_remuneration' => $totalRemuneration,
                'average_hourly_rate' => $totalHours > 0 ? round($ownRemuneration / $totalHours, 2) : 0,
                'collaborator_remuneration' => $collabRemuneration,
            ]
        ]);
    }

}
