<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkLog extends Model
{
    protected $fillable = [
        'employee_id',
        'task_description',
        'date',
        'hours_spent',
        'hourly_rate',
        'additional_charges',
        'collaborators' // JSON field untuk menyimpan data kolaborator
    ];

    protected $casts = [
        'collaborators' => 'array',
        'date' => 'date'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function calculateTotalRemuneration()
    {
        $basePayment = $this->hours_spent * $this->hourly_rate;
        $additionalCharges = $this->additional_charges ?? 0;

        // Total full payment untuk semua kolaborator + diri sendiri
        $allCollaborators = collect($this->collaborators ?? []);
        $totalCollaboratorHours = $allCollaborators->sum('hours_spent');

        $totalHours = $this->hours_spent + $totalCollaboratorHours;
        $totalPayment = ($totalHours * $this->hourly_rate) + $additionalCharges;

        // Prorated untuk employee utama
        if ($totalHours > 0) {
            $proratedRatio = $this->hours_spent / $totalHours;
            return round($totalPayment * $proratedRatio, 2);
        }

        return round($totalPayment, 2);
    }

    public function getCollaboratorRemuneration($employeeId)
    {
        if (empty($this->collaborators)) {
            return 0;
        }

        $collaborators = collect($this->collaborators);
        $target = $collaborators->firstWhere('employee_id', $employeeId);

        if (!$target) {
            return 0;
        }

        $totalHours = $this->hours_spent + $collaborators->sum('hours_spent');
        $totalPayment = ($totalHours * $this->hourly_rate) + $this->additional_charges;

        $proratedRatio = $target['hours_spent'] / $totalHours;

        return round($totalPayment * $proratedRatio, 2);
    }

}
