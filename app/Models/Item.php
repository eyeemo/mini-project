<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    /**
     * Mass-assignable attributes.
     * Mirrors the flowchart "Item fields": Name, Specification, Label / category.
     */
    protected $fillable = [
        'name',
        'specification',
        'label',
    ];
}
