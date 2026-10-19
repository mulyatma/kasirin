<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('invoice_number')->unique();
            $table->string('customer_name')->nullable();
            $table->decimal('total_amount', 12, 2);
            $table->string('payment_method'); // cash, qris, bank_transfer dll
            $table->string('payment_status')->default('pending'); // pending, paid, failed, expired
            
            // Xendit integration fields
            $table->string('xendit_invoice_id')->nullable();
            $table->string('xendit_payment_url')->nullable();
            
            $table->foreignId('cashier_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
