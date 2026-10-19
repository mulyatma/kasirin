import { useState, type ReactNode } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, ExternalLink, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

interface Transaction {
    id: string;
    invoice_number: string;
    customer_name: string | null;
    total_amount: string;
    cash_amount?: string | null;
    change_amount?: string | null;
    payment_method: string;
    payment_status: string;
    xendit_invoice_id?: string | null;
    xendit_payment_url?: string | null;
    created_at: string;
    cashier: { name: string };
    items: Array<{
        id: number;
        product_name: string;
        price: string;
        quantity: number;
        subtotal: string;
    }>;
}

export default function Show({ transaction }: { transaction: Transaction }) {
    const isXenditMethod = ['qris', 'bank_transfer'].includes(transaction.payment_method);
    const isPending = transaction.payment_status === 'pending';
    const [checking, setChecking] = useState(false);

    const handleCheckStatus = () => {
        setChecking(true);
        router.post(`/transactions/${transaction.id}/check-status`, {}, {
            preserveScroll: true,
            onFinish: () => setChecking(false),
        });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <Head title={`Transaction ${transaction.invoice_number}`} />

            <div className="w-full max-w-md flex justify-between mb-4 print:hidden">
                <Button variant="ghost" asChild>
                    <Link href="/transactions">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
                    </Link>
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" /> Print Receipt
                </Button>
            </div>

            <Card className="w-full max-w-md print:shadow-none print:border-none print:w-full">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold">KASIRIN</CardTitle>
                    <p className="text-sm text-muted-foreground">Point of Sale System</p>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-sm">
                    {/* Meta */}
                    <div className="flex flex-col gap-1 border-b pb-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Invoice</span>
                            <span className="font-medium">{transaction.invoice_number}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span>{new Date(transaction.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Cashier</span>
                            <span>{transaction.cashier?.name}</span>
                        </div>
                        {transaction.customer_name && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Customer</span>
                                <span>{transaction.customer_name}</span>
                            </div>
                        )}
                    </div>

                    {/* Items */}
                    <div className="flex flex-col gap-2 border-b pb-4">
                        {transaction.items.map(item => (
                            <div key={item.id} className="flex justify-between">
                                <div className="flex flex-col">
                                    <span className="font-medium">{item.product_name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <span className="font-medium">Rp {Number(item.subtotal).toLocaleString('id-ID')}</span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="flex flex-col gap-1 border-b pb-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total</span>
                            <span>Rp {Number(transaction.total_amount).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Payment Method</span>
                            <span className="uppercase">{transaction.payment_method.replace('_', ' ')}</span>
                        </div>
                        {transaction.payment_method === 'cash' && transaction.cash_amount && (
                            <>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Cash Received</span>
                                    <span>Rp {Number(transaction.cash_amount).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground font-medium">
                                    <span>Change</span>
                                    <span className="text-foreground font-semibold">
                                        Rp {Number(transaction.change_amount || 0).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </>
                        )}
                        <div className="flex justify-between text-muted-foreground">
                            <span>Status</span>
                            <span className={`uppercase font-semibold ${
                                transaction.payment_status === 'paid' ? 'text-green-600' :
                                transaction.payment_status === 'pending' ? 'text-amber-600' :
                                'text-destructive'
                            }`}>
                                {transaction.payment_status}
                            </span>
                        </div>
                    </div>

                    {/* Xendit Integration Block */}
                    {isXenditMethod && (
                        <div className="mt-2 print:hidden">
                            {isPending ? (
                                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 p-4 rounded-lg flex flex-col gap-3 text-center">
                                    <div className="flex items-center justify-center gap-2 font-semibold text-sm">
                                        <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
                                        <span>Menunggu Pembayaran Xendit</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Selesaikan pembayaran melalui tautan invoice Xendit berikut atau scan QRIS.
                                    </p>
                                    <div className="flex flex-col gap-2 pt-1">
                                        {transaction.xendit_payment_url && (
                                            <Button asChild className="w-full">
                                                <a href={transaction.xendit_payment_url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="mr-2 h-4 w-4" /> Buka Pembayaran Xendit
                                                </a>
                                            </Button>
                                        )}
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={handleCheckStatus} 
                                            disabled={checking}
                                        >
                                            <RefreshCw className={`mr-2 h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
                                            {checking ? 'Memeriksa...' : 'Cek Status Pembayaran'}
                                        </Button>
                                    </div>
                                </div>
                            ) : transaction.payment_status === 'paid' ? (
                                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-200 p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <span>Pembayaran Xendit Berhasil Dikonfirmasi</span>
                                </div>
                            ) : (
                                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 p-3 rounded-lg text-center text-xs">
                                    <span>Pembayaran Xendit gagal atau kadaluarsa.</span>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex-col text-center text-xs text-muted-foreground pb-6">
                    <p>Thank you for your purchase!</p>
                    <p>kasirin.example.com</p>
                </CardFooter>
            </Card>
        </div>
    );
}

Show.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Transactions', href: '/transactions' },
            { title: 'Invoice', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
