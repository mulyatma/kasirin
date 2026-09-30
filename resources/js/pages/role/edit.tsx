import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import RoleForm from './role-form';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
}

interface Props {
    role: Role;
    permissionGroups: Record<string, Permission[]>;
    selectedPermissions: string[];
}

export default function Edit({
    role,
    permissionGroups,
    selectedPermissions,
}: Props) {
    return (
        <>
            <Head title="Edit Role" />
            <RoleForm
                role={role}
                permissionGroups={permissionGroups}
                selectedPermissions={selectedPermissions}
            />
        </>
    );
}

Edit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Roles', href: '/roles' },
            { title: 'Edit', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);