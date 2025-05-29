<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'position',
        'hourly_rate'
    ];

    protected $casts = [
        'hourly_rate' => 'decimal:2'
    ];

    public function workLogs()
    {
        return $this->hasMany(WorkLog::class);
    }
}
