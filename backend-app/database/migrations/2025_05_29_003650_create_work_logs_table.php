<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('work_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->text('task_description');
            $table->date('date');
            $table->decimal('hours_spent', 5, 2);
            $table->decimal('hourly_rate', 10, 2);
            $table->decimal('additional_charges', 10, 2)->default(0);
            $table->json('collaborators')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_logs');
    }
};
