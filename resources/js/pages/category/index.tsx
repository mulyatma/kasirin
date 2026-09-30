import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import DeleteConfirmModal from '@/components/delete-confirm-modal';
import { MoreHorizontal, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '@/components/page-header';
import DataTable from '@/components/data-table';
import DataTableToolbar from '@/components/data-table/toolbar';
import { useEffect, useState, ReactNode } from 'react';

interface Category {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
}

interface Props {
    categories: {
        data: Category[];
    };
    filters: {
        search: string | null;
    };
}

export default function Index({ categories, filters }: Props) {
    const { auth } = usePage<any>().props;
    const permissions: string[] = auth?.permissions ?? [];
    const canCreate = permissions.includes('create category');
    const canEdit = permissions.includes('update category');
    const canDelete = permissions.includes('delete category');
    const hasActions = canEdit || canDelete;
    const [search, setSearch] = useState(filters?.search ?? '');
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!categoryToDelete) return;
        setDeleting(true);

        router.delete(`/categories/${categoryToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setCategoryToDelete(null),
            onFinish: () => setDeleting(false),
        });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/categories',
                { search },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <>
            <Head title="Categories" />

            <Card className="m-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <PageHeader
                        title="Kategori Produk"
                        description="Kelola kategori untuk produk-produk Anda."
                    />

                    {canCreate && (
                        <Button asChild>
                            <Link href="/categories/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Kategori
                            </Link>
                        </Button>
                    )}
                </CardHeader>

                <DataTable>
                    <DataTableToolbar
                        search={
                            <div className="relative max-w-sm">
                                <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Cari kategori..."
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
                                <TableHead>Nama Kategori</TableHead>
                                <TableHead>Deskripsi</TableHead>
                                <TableHead>Dibuat Pada</TableHead>
                                {hasActions && <TableHead className="w-[70px]">Aksi</TableHead>}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {categories.data.length > 0 ? (
                                categories.data.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">
                                            {category.name}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                                            {category.description || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(category.created_at).toLocaleDateString()}
                                        </TableCell>
                                        {hasActions && (
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {canEdit && (
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/categories/${category.id}/edit`}>
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {canDelete && (
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:text-red-600"
                                                                onSelect={(e) => {
                                                                    e.preventDefault();
                                                                    setCategoryToDelete(category);
                                                                }}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-muted-foreground text-center"
                                    >
                                        Tidak ada kategori ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DataTable>
            </Card>

            <DeleteConfirmModal
                open={!!categoryToDelete}
                title="Hapus Kategori?"
                description={`Kategori "${categoryToDelete?.name}" akan dihapus permanen. Produk yang menggunakan kategori ini mungkin akan terpengaruh.`}
                onConfirm={handleDelete}
                onCancel={() => setCategoryToDelete(null)}
                processing={deleting}
            />
        </>
    );
}

Index.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Categories',
                href: '/categories',
            },
        ]}
    >
        {page}
    </AppLayout>
);