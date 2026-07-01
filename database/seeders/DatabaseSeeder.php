<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with a demo user and sample items.
     */
    public function run(): void
    {
        // Demo admin login: admin@example.com / password
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin', 'password' => Hash::make('password'), 'is_admin' => true]
        );

        // Demo regular user: user@example.com / password
        User::updateOrCreate(
            ['email' => 'user@example.com'],
            ['name' => 'Demo User', 'password' => Hash::make('password'), 'is_admin' => false]
        );

        $items = [
            ['name' => 'Dell Latitude 5440', 'label' => 'Laptop', 'specification' => 'Intel i7-1355U, 16GB RAM, 512GB SSD, 14" FHD'],
            ['name' => 'Logitech MX Master 3S', 'label' => 'Peripheral', 'specification' => 'Wireless mouse, 8000 DPI, USB-C, Bluetooth'],
            ['name' => 'HP LaserJet Pro M404', 'label' => 'Printer', 'specification' => 'Monochrome laser, 40ppm, duplex, Ethernet'],
            ['name' => 'Samsung 27" Monitor', 'label' => 'Display', 'specification' => '27 inch, 2560x1440, 75Hz, HDMI/DP'],
            ['name' => 'Cisco Catalyst 2960', 'label' => 'Networking', 'specification' => '24-port Gigabit managed switch'],
            ['name' => 'Anker USB-C Hub', 'label' => 'Peripheral', 'specification' => '7-in-1, HDMI 4K, USB 3.0, SD card reader'],
        ];

        foreach ($items as $item) {
            Item::updateOrCreate(['name' => $item['name']], $item);
        }
    }
}
