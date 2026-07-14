import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <>
            <Head title="Category" />

            <div className="p-6">
                <h1 className="text-2xl font-bold">
                    Category
                </h1>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Category',
            href: '/categories',
        },
    ],
};