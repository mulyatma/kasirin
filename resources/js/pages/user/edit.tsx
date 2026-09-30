import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import UserForm from './user-form';
import { ReactNode } from 'react';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    user: User;
    roles: Role[];
    selectedRole: string;
}

export default function Edit({ user, roles, selectedRole }: Props) {
    return (
        <>
            <Head title="Edit User" />
            <UserForm user={user} roles={roles} selectedRole={selectedRole} />
        </>
    );
}

Edit.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Users', href: '/users' },
            { title: 'Edit', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
