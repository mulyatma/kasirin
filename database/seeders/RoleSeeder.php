<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $owner = Role::firstOrCreate([
            'name' => 'Owner',
            'guard_name' => 'web',
        ]);

        $cashier = Role::firstOrCreate([
            'name' => 'Cashier',
            'guard_name' => 'web',
        ]);

        // Owner mendapatkan semua permission
        $owner->syncPermissions(Permission::all());

        // Cashier hanya permission tertentu
        $cashier->syncPermissions([
            'view dashboard',

            'view category',

            'view product',

            // 'view customer',
            // 'create customer',

            'view transaction',
            'create transaction',
            'print receipt',
        ]);
    }
}
