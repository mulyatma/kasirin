import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteConfirmModal from '@/components/delete-confirm-modal';
import { MoreHorizontal, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '@/components/page-header';
import DataTable from '@/components/data-table';
import DataTableToolbar from '@/components/data-table/toolbar';
import { useEffect, useState, ReactNode } from 'react';

export default function Index({ products, filters }: any) {
    const { auth } = usePage<any>().props;
    const permissions: string[] = auth?.permissions ?? [];
    const canCreate = permissions.includes('create product');
    const canEdit = permissions.includes('update product');
    const canDelete = permissions.includes('delete product');
    const hasActions = canEdit || canDelete;
    const [search, setSearch] = useState(filters?.search ?? '');
    const [productToDelete, setProductToDelete] = useState<any>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!productToDelete) return;
        setDeleting(true);
        router.delete(`/products/${productToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setProductToDelete(null),
            onFinish: () => setDeleting(false),
        });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get('/products', { search }, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <>
            <Head title="Products" />
            <Card className="m-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <PageHeader title="Produk" description="Kelola produk Anda." />
                    {canCreate && (
                        <Button asChild>
                            <Link href="/products/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Produk
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
                                    placeholder="Cari produk..."
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
                                <TableHead>Nama</TableHead>
                                <TableHead>Deskripsi</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Dibuat Pada</TableHead>
                                {hasActions && <TableHead className="w-[70px]">Aksi</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products?.data?.length > 0 ? (
                                products.data.map((product: any) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                                            {product.description || '-'}
                                        </TableCell>
                                        <TableCell>{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell>{product.category?.name ?? '-'}</TableCell>
                                        <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>
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
                                                                <Link href={`/products/${product.id}/edit`}>
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
                                                                    setProductToDelete(product);
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
                                    <TableCell colSpan={6} className="text-muted-foreground text-center">
                                        Tidak ada produk ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DataTable>
            </Card>
            <DeleteConfirmModal
                open={!!productToDelete}
                title="Hapus Produk?"
                description={`Produk "${productToDelete?.name}" akan dihapus secara permanen.`}
                onConfirm={handleDelete}
                onCancel={() => setProductToDelete(null)}
                processing={deleting}
            />
        </>
    );
}

Index.layout = (page: ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Products', href: '/products' }]}> {page} </AppLayout>
);