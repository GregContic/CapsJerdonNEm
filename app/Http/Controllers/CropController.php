<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Crop;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CropController extends Controller
{
    public function index(Request $request)
    {
        $query = Crop::with('category');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $crops = $query->get();
        $categories = Category::all();

        return Inertia::render('Crops/Index', [
            'crops' => $crops,
            'categories' => $categories,
            'filters' => $request->only(['category_id', 'search']),
        ]);
    }
}
