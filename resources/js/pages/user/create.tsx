import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import UserForm from './user-form';
import { ReactNode } from 'react';

interface Role {
    id: number;
    name: string;
}

interface Props {
    roles: Role[];
}

export default function Create({ roles }: Props) {
    return (
        <>
            <Head title="Create User" />
            <UserForm roles={roles} />
        </>
    );
}

Create.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Users', href: '/users' },
            { title: 'Create', href: '/users/create' },
        ]}
    >
        {page}
    </AppLayout>
);
