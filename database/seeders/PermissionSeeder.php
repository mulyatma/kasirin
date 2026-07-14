<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [

            // Dashboard
            'view dashboard',

            // Category
            'view category',
            'create category',
            'update category',
            'delete category',

            // Product
            'view product',
            'create product',
            'update product',
            'delete product',

            // Customer
            // 'view customer',
            // 'create customer',
            // 'update customer',
            // 'delete customer',

            // Transaction
            'view transaction',
            'create transaction',
            'cancel transaction',
            'print receipt',

            // User
            'view user',
            'create user',
            'update user',
            'delete user',

            // Role
            'view role',
            'create role',
            'update role',
            'delete role',

            // Setting
            'manage setting',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }
    }
}
