import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import CategoryForm from './category-form';
import { ReactNode } from 'react';

export default function Create() {
    return (
        <>
            <Head title="Tambah Kategori" />
            <CategoryForm />
        </>
    );
}

Create.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Categories', href: '/categories' },
            { title: 'Create', href: '/categories/create' },
        ]}
    >
        {page}
    </AppLayout>
);

