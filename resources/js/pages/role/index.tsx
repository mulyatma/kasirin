import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <>
            <Head title="Role" />

            <div className="p-6">
                <h1 className="text-2xl font-bold">
                    Role
                </h1>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Role',
            href: '/roles',
        },
    ],
};