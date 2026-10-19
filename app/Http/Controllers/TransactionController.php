<?php

namespace App\Http\Controllers;

use App\Http\Requests\Transactions\StoreTransactionRequest;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Services\XenditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Exception;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = Transaction::with(['cashier'])
            ->latest()
            ->paginate(10);

        return Inertia::render('transaction/index', [
            'transactions' => $transactions,
        ]);
    }

    public function create()
    {
        $products = Product::with('category')->get();

        return Inertia::render('transaction/create', [
            'products' => $products,
        ]);
    }

    public function store(StoreTransactionRequest $request, XenditService $xenditService)
    {
        return DB::transaction(function () use ($request, $xenditService) {
            $validated = $request->validated();
            
            // Generate invoice number
            $invoiceNumber = 'INV-' . date('Ymd') . '-' . strtoupper(Str::random(5));
            
            // Calculate total and prepare items
            $totalAmount = 0;
            $itemsData = [];
            
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subtotal = $product->price * $item['quantity'];
                $totalAmount += $subtotal;
                
                $itemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $subtotal,
                ];
            }

            $cashAmount = null;
            $changeAmount = null;

            if ($validated['payment_method'] === 'cash') {
                $cashAmount = (float) ($validated['cash_amount'] ?? $totalAmount);
                $changeAmount = max(0, $cashAmount - $totalAmount);
            }

            // Create Transaction
            $transaction = Transaction::create([
                'invoice_number' => $invoiceNumber,
                'customer_name' => $validated['customer_name'] ?? null,
                'total_amount' => $totalAmount,
                'cash_amount' => $cashAmount,
                'change_amount' => $changeAmount,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_method'] === 'cash' ? 'paid' : 'pending',
                'cashier_id' => auth()->id(),
            ]);

            // Create Transaction Items
            foreach ($itemsData as $itemData) {
                $transaction->items()->create($itemData);
            }

            // Trigger Xendit API for QRIS / Bank Transfer
            if (in_array($validated['payment_method'], ['qris', 'bank_transfer'])) {
                try {
                    $xenditService->createInvoice($transaction);
                } catch (Exception $e) {
                    Log::error('Failed to create Xendit invoice for transaction: ' . $transaction->id, [
                        'error' => $e->getMessage(),
                    ]);
                    // Don't fail the entire transaction DB creation, but flash a warning
                    return redirect()->route('transactions.show', $transaction->id)
                        ->with('warning', 'Transaksi dibuat, namun pembuatan invoice Xendit gagal: ' . $e->getMessage());
                }
            }

            return redirect()->route('transactions.show', $transaction->id)
                ->with('success', 'Transaksi berhasil dibuat.');
        });
    }

    public function show(Transaction $transaction)
    {
        $transaction->load(['items', 'cashier']);

        return Inertia::render('transaction/show', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Check payment status directly from Xendit
     */
    public function checkStatus(Transaction $transaction, XenditService $xenditService)
    {
        if (empty($transaction->xendit_invoice_id)) {
            return back()->with('error', 'Transaksi ini tidak memiliki invoice Xendit.');
        }

        $invoice = $xenditService->getInvoice($transaction->xendit_invoice_id);

        if (!$invoice) {
            return back()->with('error', 'Gagal memeriksa status ke Xendit.');
        }

        $status = strtoupper($invoice['status'] ?? '');

        if (in_array($status, ['PAID', 'SETTLED'])) {
            $transaction->update([
                'payment_status' => 'paid',
                'cash_amount' => $invoice['paid_amount'] ?? $transaction->total_amount,
                'change_amount' => 0,
            ]);
            return back()->with('success', 'Pembayaran berhasil terkonfirmasi lunas.');
        }

        if ($status === 'EXPIRED') {
            $transaction->update(['payment_status' => 'expired']);
            return back()->with('error', 'Invoice Xendit sudah kadaluarsa.');
        }

        return back()->with('info', 'Status pembayaran saat ini masih: ' . $status);
    }

    /**
     * Handle Xendit webhook callback
     */
    public function webhook(Request $request, XenditService $xenditService)
    {
        $callbackToken = $request->header('x-callback-token');
        $payload = $request->all();

        Log::info('Xendit Webhook Received', ['payload' => $payload]);

        $transaction = $xenditService->handleWebhook($payload, $callbackToken);

        if (!$transaction) {
            return response()->json(['status' => 'ignored or invalid'], 400);
        }

        return response()->json(['status' => 'success']);
    }
}
