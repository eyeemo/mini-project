<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ItemApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_items(): void
    {
        $this->getJson('/api/items')->assertStatus(401);
    }

    public function test_authenticated_user_can_list_items(): void
    {
        $this->actingAs(User::factory()->create());
        Item::create(['name' => 'Test Item', 'label' => 'Sample', 'specification' => 'spec']);

        $this->getJson('/api/items')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Test Item']);
    }

    public function test_authenticated_user_can_create_item(): void
    {
        $this->actingAs(User::factory()->create());

        $this->postJson('/api/items', [
            'name' => 'New Laptop',
            'label' => 'Electronics',
            'specification' => '16GB RAM',
        ])->assertCreated()
            ->assertJsonFragment(['name' => 'New Laptop']);

        $this->assertDatabaseHas('items', ['name' => 'New Laptop']);
    }

    public function test_creating_item_requires_a_name(): void
    {
        $this->actingAs(User::factory()->create());

        $this->postJson('/api/items', ['name' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_authenticated_user_can_delete_item(): void
    {
        $this->actingAs(User::factory()->create());
        $item = Item::create(['name' => 'Delete Me']);

        $this->deleteJson("/api/items/{$item->id}")->assertOk();
        $this->assertDatabaseMissing('items', ['id' => $item->id]);
    }
}
