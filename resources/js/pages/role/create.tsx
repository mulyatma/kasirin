import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import PageHeader from '@/components/page-header';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface Props {
    permissionGroups: Record<string, Permission[]>;
}

type RoleForm = {
    name: string;
    permissions: string[];
};

export default function Create({ permissionGroups }: Props) {
    const { data, setData, post, processing, errors } = useForm<RoleForm>({
        name: '',
        permissions: [],
    });

    const togglePermission = (name: string, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, name]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== name)
            );
        }
    };

    const toggleGroup = (groupPermissions: Permission[], checked: boolean) => {
        const names = groupPermissions.map((p) => p.name);

        if (checked) {
            setData('permissions', [
                ...new Set([...data.permissions, ...names]),
            ]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((name) => !names.includes(name))
            );
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/roles');
    };

    return (
        <>
            <Head title="Create Role" />

            <form onSubmit={submit}>
                <Card className="m-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <PageHeader
                            title="Create Role"
                            description="Buat role baru beserta hak aksesnya."
                        />

                        <Button variant="outline" asChild type="button">
                            <Link href="/roles">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid gap-2 max-w-sm">
                            <Label htmlFor="name">Nama Role</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Contoh: Admin"
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <Label className="text-base">Permissions</Label>

                            {Object.keys(permissionGroups).length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada permission yang tersedia.
                                </p>
                            )}
                            {errors.permissions && (
                                <p className="text-sm text-red-600">
                                    {errors.permissions}
                                </p>
                            )}

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {Object.entries(permissionGroups).map(
                                    ([group, groupPerms]) => {
                                        const allChecked = groupPerms.every(
                                            (p) =>
                                                data.permissions.includes(
                                                    p.name
                                                )
                                        );

                                        return (
                                            <div
                                                key={group}
                                                className="rounded-lg border p-4 space-y-3"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`group-${group}`}
                                                        checked={allChecked}
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            toggleGroup(
                                                                groupPerms,
                                                                Boolean(
                                                                    checked
                                                                )
                                                            )
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor={`group-${group}`}
                                                        className="font-semibold"
                                                    >
                                                        {group}
                                                    </Label>
                                                </div>

                                                <div className="space-y-2 pl-6">
                                                    {groupPerms.map(
                                                        (permission) => (
                                                            <div
                                                                key={
                                                                    permission.id
                                                                }
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Checkbox
                                                                    id={`permission-${permission.id}`}
                                                                    checked={data.permissions.includes(
                                                                        permission.name
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) =>
                                                                        togglePermission(
                                                                            permission.name,
                                                                            Boolean(
                                                                                checked
                                                                            )
                                                                        )
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor={`permission-${permission.id}`}
                                                                    className="text-sm font-normal text-muted-foreground capitalize"
                                                                >
                                                                    {
                                                                        permission.name
                                                                    }
                                                                </Label>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="justify-end gap-2">
                        <Button variant="outline" asChild type="button">
                            <Link href="/roles">Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Simpan
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </>
    );
}

Create.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Roles', href: '/roles' },
            { title: 'Create', href: '/roles/create' },
        ]}
    >
        {page}
    </AppLayout>
);