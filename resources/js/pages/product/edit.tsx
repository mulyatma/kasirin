import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ProductForm from './product-form';
import { ReactNode } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    category: Category;
}

interface Props {
    product: Product;
    categories: Category[];
}

export default function Edit({ product, categories }: Props) {
    return (
        <>
            <Head title="Edit Product" />
            <ProductForm product={product} categories={categories} />
        </>
    );
}

Edit.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Products', href: '/products' },
            { title: 'Edit', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
