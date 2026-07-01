<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemRequest;
use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    /**
     * View / Search — list items with optional search across name, label, spec.
     */
    public function index(Request $request)
    {
        $query = Item::query();

        if ($search = trim((string) $request->query('q', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('label', 'ilike', "%{$search}%")
                    ->orWhere('specification', 'ilike', "%{$search}%");
            });
        }

        if ($label = trim((string) $request->query('label', ''))) {
            $query->where('label', $label);
        }

        return response()->json(
            $query->orderByDesc('created_at')->get()
        );
    }

    /**
     * Item detail view.
     */
    public function show(Item $item)
    {
        return response()->json($item);
    }

    /**
     * Create — Add item form -> Validate input -> Save item.
     */
    public function store(ItemRequest $request)
    {
        $item = Item::create($request->validated());

        return response()->json($item, 201);
    }

    /**
     * Update — Edit item form -> Save changes.
     */
    public function update(ItemRequest $request, Item $item)
    {
        $item->update($request->validated());

        return response()->json($item);
    }

    /**
     * Delete — Confirm dialog -> Delete item.
     */
    public function destroy(Item $item)
    {
        $item->delete();

        return response()->json(['message' => 'Item deleted.']);
    }

    /**
     * Distinct labels — used to populate the category filter.
     */
    public function labels()
    {
        return response()->json(
            Item::whereNotNull('label')->where('label', '!=', '')
                ->distinct()->orderBy('label')->pluck('label')
        );
    }
}
