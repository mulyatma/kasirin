import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import RoleForm from './role-form';
import { ReactNode } from 'react';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface Props {
    permissionGroups: Record<string, Permission[]>;
}

export default function Create({ permissionGroups }: Props) {
    return (
        <>
            <Head title="Create Role" />
            <RoleForm permissionGroups={permissionGroups} />
        </>
    );
}

Create.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Roles', href: '/roles' },
            { title: 'Create', href: '/roles/create' },
        ]}
    >
        {page}
    </AppLayout>
);