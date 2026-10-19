import { Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageHeader from '@/components/page-header';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Category {
    id: number;
    name: string;
    description: string | null;
}

interface Props {
    category?: Category;
}

type CategoryFormData = {
    name: string;
    description: string;
};

export default function CategoryForm({ category }: Props) {
    const { data, setData, post, put, processing, errors } = useForm<CategoryFormData>({
        name: category?.name ?? '',
        description: category?.description ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (category) {
            put(`/categories/${category.id}`);
        } else {
            post('/categories');
        }
    };

    return (
        <form onSubmit={submit}>
            <Card className="m-6 max-w-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <PageHeader
                        title={category ? 'Edit Category' : 'Add Category'}
                        description={
                            category
                                ? `Update category "${category.name}" information.`
                                : 'Create a new category for your products.'
                        }
                    />

                    <Button variant="outline" asChild type="button">
                        <Link href="/categories">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Category Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Example: Main Course"
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Brief description about this category..."
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="justify-end gap-2">
                    <Button variant="outline" asChild type="button">
                        <Link href="/categories">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing && (
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {category ? 'Save Changes' : 'Save'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}

