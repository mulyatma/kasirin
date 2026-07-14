import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { auth } = usePage().props as any;

    const permissions: string[] = auth?.permissions ?? [];

    const can = (permission: string) =>
        permissions.includes(permission);

    const canAny = (permissionsToCheck: string[]) =>
        permissionsToCheck.some(can);

    return {
        can,
        canAny,
    };
}