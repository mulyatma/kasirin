<?php

namespace App\Services;

use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class XenditService
{
    protected string $secretKey;
    protected string $baseUrl = 'https://api.xendit.co';

    public function __construct()
    {
        $this->secretKey = (string) config('services.xendit.secret_key');
    }

    /**
     * Create an invoice on Xendit for QRIS / Bank Transfer
     */
    public function createInvoice(Transaction $transaction): array
    {
        if (empty($this->secretKey)) {
            throw new Exception('Xendit Secret Key is not configured in .env (XENDIT_SECRET_KEY)');
        }

        // Map items
        $items = $transaction->items->map(function ($item) {
            return [
                'name' => $item->product_name,
                'quantity' => (int) $item->quantity,
                'price' => (float) $item->price,
            ];
        })->toArray();

        // Payment methods filtering
        $paymentMethods = match ($transaction->payment_method) {
            'qris' => ['QRIS'],
            'bank_transfer' => ['BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA', 'BSI', 'CIMB', 'SAHABAT_SAMPOERNA'],
            default => [],
        };

        $payload = [
            'external_id' => $transaction->invoice_number,
            'amount' => (float) $transaction->total_amount,
            'description' => 'Payment for ' . $transaction->invoice_number,
            'invoice_duration' => 86400, // 24 hours
            'customer' => [
                'given_names' => $transaction->customer_name ?: 'Customer',
            ],
            'currency' => 'IDR',
            'items' => $items,
            'success_redirect_url' => url('/transactions/' . $transaction->id),
            'failure_redirect_url' => url('/transactions/' . $transaction->id),
        ];

        if (!empty($paymentMethods)) {
            $payload['payment_methods'] = $paymentMethods;
        }

        $response = Http::withBasicAuth($this->secretKey, '')
            ->timeout(20)
            ->post("{$this->baseUrl}/v2/invoices", $payload);

        if ($response->failed()) {
            Log::error('Xendit Create Invoice Failed', [
                'status' => $response->status(),
                'response' => $response->json() ?? $response->body(),
                'transaction_id' => $transaction->id,
            ]);

            $message = $response->json('message') ?? 'Failed to communicate with Xendit.';
            throw new Exception("Xendit Error: {$message}");
        }

        $data = $response->json();

        // Update transaction with Xendit details
        $transaction->update([
            'xendit_invoice_id' => $data['id'] ?? null,
            'xendit_payment_url' => $data['invoice_url'] ?? null,
        ]);

        return $data;
    }

    /**
     * Check status of invoice from Xendit
     */
    public function getInvoice(string $invoiceId): ?array
    {
        if (empty($this->secretKey)) {
            return null;
        }

        $response = Http::withBasicAuth($this->secretKey, '')
            ->timeout(15)
            ->get("{$this->baseUrl}/v2/invoices/{$invoiceId}");

        if ($response->failed()) {
            Log::error('Xendit Get Invoice Failed', [
                'invoice_id' => $invoiceId,
                'response' => $response->body(),
            ]);
            return null;
        }

        return $response->json();
    }

    /**
     * Handle incoming webhook notification
     */
    public function handleWebhook(array $payload, ?string $callbackToken = null): ?Transaction
    {
        $expectedToken = config('services.xendit.webhook_token');
        if (!empty($expectedToken) && $callbackToken !== $expectedToken) {
            Log::warning('Xendit Webhook Unauthorized: Invalid callback token', [
                'received' => $callbackToken,
            ]);
            return null;
        }

        $externalId = $payload['external_id'] ?? null;
        $xenditInvoiceId = $payload['id'] ?? null;
        $status = strtoupper($payload['status'] ?? '');

        $transaction = Transaction::where('invoice_number', $externalId)
            ->orWhere('xendit_invoice_id', $xenditInvoiceId)
            ->first();

        if (!$transaction) {
            Log::warning('Xendit Webhook Transaction Not Found', ['payload' => $payload]);
            return null;
        }

        if (in_array($status, ['PAID', 'SETTLED'])) {
            $transaction->update([
                'payment_status' => 'paid',
                'cash_amount' => $payload['paid_amount'] ?? $transaction->total_amount,
                'change_amount' => 0,
            ]);
        } elseif ($status === 'EXPIRED') {
            $transaction->update(['payment_status' => 'expired']);
        }

        return $transaction;
    }
}

