<?php

namespace App\Http\Controllers;

use App\Http\Requests\Transactions\StoreTransactionRequest;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;

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

    public function store(StoreTransactionRequest $request)
    {
        return DB::transaction(function () use ($request) {
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

            // Create Transaction
            $transaction = Transaction::create([
                'invoice_number' => $invoiceNumber,
                'customer_name' => $validated['customer_name'] ?? null,
                'total_amount' => $totalAmount,
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'pending', // By default pending, could be 'paid' if 'cash'
                'cashier_id' => auth()->id(),
            ]);

            // Create Transaction Items
            foreach ($itemsData as $itemData) {
                $transaction->items()->create($itemData);
            }

            // If payment method is cash, we can automatically mark as paid
            if ($validated['payment_method'] === 'cash') {
                $transaction->update(['payment_status' => 'paid']);
            }

            // Later: Trigger Xendit API here if payment_method is qris or bank_transfer

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
}
