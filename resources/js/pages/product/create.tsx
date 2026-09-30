import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ProductForm from './product-form';
import { ReactNode } from 'react';

export default function Create({ categories }: { categories: any }) {
    return (
        <>
            <Head title="Tambah Produk" />
            <ProductForm categories={categories} />
        </>
    );
}

Create.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Products', href: '/products' },
            { title: 'Create', href: '/products/create' },
        ]}
    >
        {page}
    </AppLayout>
);
