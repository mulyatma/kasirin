import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import CategoryForm from './category-form';
import { ReactNode } from 'react';

interface Category {
    id: number;
    name: string;
    description: string | null;
}

interface Props {
    category: Category;
}

export default function Edit({ category }: Props) {
    return (
        <>
            <Head title="Edit Category" />
            <CategoryForm category={category} />
        </>
    );
}

Edit.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Categories', href: '/categories' },
            { title: 'Edit', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);

