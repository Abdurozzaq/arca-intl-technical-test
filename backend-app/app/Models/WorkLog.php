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
        // Logika perhitungan remunerasi
        $basePayment = $this->hours_spent * $this->hourly_rate;
        $totalPayment = $basePayment + $this->additional_charges;

        if (!empty($this->collaborators)) {
            $totalHours = $this->hours_spent + collect($this->collaborators)->sum('hours_spent');
            $proratedRatio = $this->hours_spent / $totalHours;
            $totalPayment = $totalPayment * $proratedRatio;
        }

        return $totalPayment;
    }
}
