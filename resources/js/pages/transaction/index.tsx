import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DataTable from '@/components/data-table';
import { ReactNode } from 'react';

interface Transaction {
    id: string;
    invoice_number: string;
    customer_name: string | null;
    total_amount: string;
    payment_method: string;
    payment_status: string;
    created_at: string;
    cashier: {
        name: string;
    };
}

export default function Index({ transactions }: { transactions: any }) {
    const { auth } = usePage<any>().props;
    const canCreate = auth.permissions?.includes('create transaction');

    return (
        <>
            <Head title="Transactions" />

            <Card className="m-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <PageHeader title="Transactions" description="Manage sales transactions" />
                    {canCreate && (
                        <Button asChild>
                            <Link href="/transactions/create">
                                <Plus className="mr-2 h-4 w-4" /> New Transaction
                            </Link>
                        </Button>
                    )}
                </CardHeader>

                <DataTable>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Cashier</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions?.data?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions?.data?.map((transaction: Transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell className="font-medium">{transaction.invoice_number}</TableCell>
                                        <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>{transaction.customer_name || '-'}</TableCell>
                                        <TableCell>{transaction.cashier?.name}</TableCell>
                                        <TableCell>Rp {Number(transaction.total_amount).toLocaleString('id-ID')}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                transaction.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                                transaction.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {transaction.payment_status.toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/transactions/${transaction.id}`}>
                                                    Detail
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </DataTable>
            </Card>
        </>
    );
}

Index.layout = (page: ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Transactions', href: '/transactions' }]}>
        {page}
    </AppLayout>
);