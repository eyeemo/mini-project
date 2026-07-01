<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for the Add / Edit item forms (the "Validate input" node).
     */
    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'specification' => ['nullable', 'string', 'max:5000'],
            'label'         => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Item name is required.',
            'name.max'      => 'Item name may not be longer than 255 characters.',
        ];
    }
}
