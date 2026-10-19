import { useState, type ReactNode } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, ShoppingCart, Banknote } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    price: string;
    category?: { name: string };
}

interface CartItem extends Product {
    quantity: number;
}

export default function Create({ products }: { products: Product[] }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        payment_method: 'cash',
        cash_amount: '',
        items: [] as { product_id: number; quantity: number }[],
    });

    const addToCart = (product: Product) => {
        setCart(current => {
            const existing = current.find(item => item.id === product.id);
            if (existing) {
                return current.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...current, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(current => current.map(item => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity + delta };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const clearCart = () => {
        setCart([]);
        setData('cash_amount', '');
    };

    const total = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
    const cashReceived = Number(data.cash_amount) || 0;
    const change = data.payment_method === 'cash' ? Math.max(0, cashReceived - total) : 0;
    const isCashInsufficient = data.payment_method === 'cash' && total > 0 && cashReceived < total;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (cart.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        if (data.payment_method === 'cash') {
            if (!data.cash_amount || cashReceived <= 0) {
                toast.error('Masukkan jumlah uang yang diterima dari customer.');
                return;
            }
            if (cashReceived < total) {
                toast.error('Uang yang dibayarkan kurang dari total belanja.');
                return;
            }
        }

        const items = cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
        }));

        setData('items', items);

        post('/transactions', {
            data: { ...data, items },
            onSuccess: () => {
                setCart([]);
            }
        });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 h-[calc(100vh-4rem)]">
            <Head title="New Transaction" />

            {/* Left side: Products catalog */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Products</h2>
                        <p className="text-xs text-muted-foreground">Click a product to add it to current order</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-20">
                    {products.map(product => (
                        <Card key={product.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => addToCart(product)}>
                            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                <div className="h-20 w-20 bg-muted rounded-md flex items-center justify-center mb-2">
                                    <ShoppingCart className="text-muted-foreground/50 h-8 w-8" />
                                </div>
                                <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                                <p className="text-xs text-muted-foreground">{product.category?.name || 'Uncategorized'}</p>
                                <p className="font-bold text-primary">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Right side: Cart & Checkout */}
            <div className="w-full lg:w-96 flex flex-col gap-4 border-l pl-0 lg:pl-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Current Order</h2>
                    {cart.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
                            Clear
                        </Button>
                    )}
                </div>

                <Card className="flex-1 flex flex-col overflow-hidden">
                    <CardContent className="p-0 flex flex-col h-full">
                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                            {cart.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                                    Cart is empty
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}>
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Checkout Form */}
                        <div className="border-t p-4 bg-muted/20 flex flex-col gap-4">
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-sm font-medium text-muted-foreground">Total</span>
                                    <span className="text-2xl font-bold">Rp {total.toLocaleString('id-ID')}</span>
                                </div>

                                <div>
                                    <Input
                                        placeholder="Customer Name (Optional)"
                                        value={data.customer_name}
                                        onChange={e => setData('customer_name', e.target.value)}
                                    />
                                    {errors.customer_name && <p className="text-sm text-destructive mt-1">{errors.customer_name}</p>}
                                </div>

                                <div>
                                    <Select value={data.payment_method} onValueChange={(v) => setData('payment_method', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Payment Method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="qris">QRIS (Xendit)</SelectItem>
                                            <SelectItem value="bank_transfer">Bank Transfer (Xendit)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.payment_method && <p className="text-sm text-destructive mt-1">{errors.payment_method}</p>}
                                </div>

                                {/* Cash Payment Inputs */}
                                {data.payment_method === 'cash' && (
                                    <div className="flex flex-col gap-2 p-3 bg-background border rounded-lg">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                            <Banknote className="h-4 w-4" />
                                            <span>Cash Payment Details</span>
                                        </div>

                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Cash Received (Rp)</label>
                                            <Input
                                                type="number"
                                                placeholder="Enter amount..."
                                                value={data.cash_amount}
                                                onChange={e => setData('cash_amount', e.target.value)}
                                                min={0}
                                            />
                                            {errors.cash_amount && <p className="text-xs text-destructive mt-1">{errors.cash_amount}</p>}
                                            {data.cash_amount && isCashInsufficient && (
                                                <p className="text-xs text-destructive mt-1">
                                                    Kurang Rp {(total - cashReceived).toLocaleString('id-ID')}
                                                </p>
                                            )}
                                        </div>

                                        {/* Quick Amount Suggestion Buttons */}
                                        {total > 0 && (
                                            <div className="flex gap-1.5 flex-wrap pt-1">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    className="text-xs h-7 px-2"
                                                    onClick={() => setData('cash_amount', String(total))}
                                                >
                                                    Uang Pas
                                                </Button>
                                                {[20000, 50000, 100000].map(amt => (
                                                    amt >= total && (
                                                        <Button
                                                            key={amt}
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-xs h-7 px-2"
                                                            onClick={() => setData('cash_amount', String(amt))}
                                                        >
                                                            Rp {amt.toLocaleString('id-ID')}
                                                        </Button>
                                                    )
                                                ))}
                                            </div>
                                        )}

                                        {/* Change display */}
                                        <div className="flex justify-between items-center pt-2 border-t mt-1">
                                            <span className="text-xs font-medium text-muted-foreground">Change</span>
                                            <span className={`text-base font-bold ${change > 0 ? 'text-green-600' : ''}`}>
                                                Rp {change.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full mt-1"
                                    disabled={processing || cart.length === 0 || isCashInsufficient}
                                >
                                    {processing ? 'Processing...' : 'Charge'}
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Create.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Transactions', href: '/transactions' },
            { title: 'New Transaction', href: '/transactions/create' },
        ]}
    >
        {page}
    </AppLayout>
);
