import { Head, Link, router } from '@inertiajs/react';
import { MoreHorizontal, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable from '@/components/data-table';
import DataTableToolbar from '@/components/data-table/toolbar';
import DeleteConfirmModal from '@/components/delete-confirm-modal';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

interface Role {
    id: number;
    name: string;
    permissions_count: number;
    created_at: string;
}

interface Props {
    roles: {
        data: Role[];
    };
    filters: {
        search: string | null;
    };
}

export default function Index({ roles, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [deleting, setDeleting] = useState(false);


    const handleDelete = () => {
        if (!roleToDelete) {
return;
}

        setDeleting(true);

        router.delete(`/roles/${roleToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setRoleToDelete(null),
            onFinish: () => setDeleting(false),
        });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/roles',
                { search },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, 300); // debounce 300ms

        return () => clearTimeout(timeout);
         
    }, [search]);

    return (
        <>
            <Head title="Role" />

            <Card className="m-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <PageHeader
                        title="Roles"
                        description="Manage roles and their permissions."
                    />

                    <Button asChild>
                        <Link href="/roles/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Role
                        </Link>
                    </Button>
                </CardHeader>

                <DataTable>
                    <DataTableToolbar
                        search={
                            <div className="relative max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search role..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        }
                    />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="w-[70px]">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {roles.data.length > 0 ? (
                                roles.data.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="font-medium">
                                            {role.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {role.permissions_count} Permission
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(role.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/roles/${role.id}/edit`}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            setRoleToDelete(role);
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center text-muted-foreground"
                                    >
                                        No roles found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DataTable>
            </Card>

            <DeleteConfirmModal
                open={!!roleToDelete}
                title="Delete Role?"
                description={`Role "${roleToDelete?.name}" will be deleted permanently. This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setRoleToDelete(null)}
                processing={deleting}
            />
        </>
    );
}

Index.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Roles',
                href: '/roles',
            },
        ]}
    >
        {page}
    </AppLayout>
);