import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Index() {
    return (
        <>
            <Head title="Transaction" />

            <div className="p-6">
                <h1 className="text-2xl font-bold">
                    Transaction
                </h1>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Transaction',
            href: '/transactions',
        },
    ],
};