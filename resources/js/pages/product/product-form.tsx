import { Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/page-header';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

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
    product?: Product;
    categories: Category[];
}

type ProductFormData = {
    name: string;
    description: string;
    price: number | '';
    category_id: number | '';
};

export default function ProductForm({ product, categories }: Props) {
    const { data, setData, post, put, processing, errors } = useForm<ProductFormData>({
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product?.price ?? '',
        category_id: product?.category?.id ?? (product as any)?.category_id ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (product) {
            put(`/products/${product.id}`);
        } else {
            post('/products');
        }
    };

    return (
        <form onSubmit={submit}>
            <Card className="m-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <PageHeader
                        title={product ? 'Edit Product' : 'Create Product'}
                        description={product ? `Perbarui data produk "${product.name}".` : 'Buat produk baru.'}
                    />

                    <Button variant="outline" asChild type="button">
                        <Link href="/products">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid max-w-sm gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Produk</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Kopi Arabika"
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Opsional, detail produk…"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="price">Harga</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value ? parseFloat(e.target.value) : '')}
                                placeholder="0.00"
                            />
                            {errors.price && (
                                <p className="text-sm text-red-600">{errors.price}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category_id">Kategori</Label>
                            <Select
                                value={String(data.category_id)}
                                onValueChange={(value) => setData('category_id', Number(value))}
                            >
                                <SelectTrigger id="category_id">
                                    <SelectValue placeholder="Pilih kategori..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)} className="capitalize">
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category_id && (
                                <p className="text-sm text-red-600">{errors.category_id}</p>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="justify-end gap-2">
                    <Button variant="outline" asChild type="button">
                        <Link href="/products">Batal</Link>
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        {product ? 'Simpan Perubahan' : 'Simpan'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
