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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import PageHeader from '@/components/page-header';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

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
    user?: User;
    roles: Role[];
    selectedRole?: string;
}

type UserFormData = {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    role: string;
};

export default function UserForm({
    user,
    roles,
    selectedRole = '',
}: Props) {
    const { data, setData, post, put, processing, errors } = useForm<UserFormData>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        role: selectedRole,
    });

    const toggleRole = (name: string, checked: boolean) => {
        if (checked) {
            setData('role', name);
        } else if (data.role === name) {
            // Opsional: kosongkan jika di-uncheck
            setData('role', '');
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (user) {
            put(`/users/${user.id}`);
        } else {
            post('/users');
        }
    };

    return (
        <form onSubmit={submit}>
            <Card className="m-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <PageHeader
                        title={user ? 'Edit User' : 'Create User'}
                        description={
                            user
                                ? `Update user profile "${user.name}" and its role.`
                                : 'Create a new user and assign a role.'
                        }
                    />

                    <Button variant="outline" asChild type="button">
                        <Link href="/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid max-w-sm gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Example: John Doe"
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Example: john@example.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                {user ? 'New Password (Optional)' : 'Password'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={user ? 'Leave blank if unchanged' : 'Minimum 8 characters'}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Repeat password"
                            />
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <Label className="text-base">Role</Label>

                        {roles.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No roles available. Create a role first.
                            </p>
                        )}
                        {errors.role && (
                            <p className="text-sm text-red-600">
                                {errors.role}
                            </p>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {roles.map((role) => (
                                <div
                                    key={role.id}
                                    className={`flex items-center gap-2 rounded-lg border p-4 transition-colors ${
                                        data.role === role.name ? 'border-primary bg-primary/5' : ''
                                    }`}
                                >
                                    <Checkbox
                                        id={`role-${role.id}`}
                                        checked={data.role === role.name}
                                        onCheckedChange={(checked) =>
                                            toggleRole(role.name, Boolean(checked))
                                        }
                                    />
                                    <Label
                                        htmlFor={`role-${role.id}`}
                                        className="font-medium capitalize cursor-pointer flex-1"
                                    >
                                        {role.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="justify-end gap-2">
                    <Button variant="outline" asChild type="button">
                        <Link href="/users">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={processing || roles.length === 0}>
                        {processing && (
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {user ? 'Save Changes' : 'Save'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
