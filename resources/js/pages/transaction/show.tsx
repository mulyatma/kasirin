import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';

interface Transaction {
    id: string;
    invoice_number: string;
    customer_name: string | null;
    total_amount: string;
    cash_amount?: string | null;
    change_amount?: string | null;
    payment_method: string;
    payment_status: string;
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
                            <span className="uppercase font-semibold text-foreground">{transaction.payment_status}</span>
                        </div>
                    </div>

                    {/* Xendit Integration Notice */}
                    {isXenditMethod && isPending && (
                        <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-center flex flex-col gap-2 mt-2 print:hidden">
                            <p className="font-medium">Waiting for Payment</p>
                            <p className="text-xs">
                                In the future, a Xendit payment link or QR code will appear here.
                            </p>
                            <Button className="mt-2" variant="secondary" size="sm">
                                Simulate Payment (Soon)
                            </Button>
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

