<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Crop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminCropController extends Controller
{
    public function index()
    {
        $crops = Crop::with('category')->get();
        $categories = Category::all();

        return Inertia::render('Admin/Crops/Index', [
            'crops' => $crops,
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        $categories = Category::all();

        return Inertia::render('Admin/Crops/Create', [
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Crop $crop)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0|max:999.99',
            'category_id' => 'required|exists:categories,id',
            'image_path' => 'nullable|image|mimes: jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('image_path')) {
            if ($crop->image_path) {
                Storage::disk('public')->delete($crop->image_path);
            }

            $path = $request->file('image_path')->store('crops', 'public');
            $validated['image_path'] = $path;
        }

        $crop->update($validated);

        return redirect()->route('admin.crops.index')->with('success', 'Crop updated successfully.');

    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0|max:999.99',
            'category_id' => 'required|exists:categories,id',
            'image_path' => 'nullable|image|mimes: jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('image_path')) {
            $path = $request->file('image_path')->store('crops', 'public');
            $validated['image_path'] = $path;
        }

        Crop::create($validated);

        return redirect()->route('admin.crops.index')->with('success', 'Crop created successfully.');
    }

    public function edit(Crop $crop)
    {
        $categories = Category::all();

        return Inertia::render('Admin/Crops/Edit', [
            'crop' => $crop,
            'categories' => $categories,
        ]);
    }

    public function destroy(Crop $crop)
    {
        if ($crop->image_path) {
            Storage::disk('public')->delete($crop->image_path);
        }

        $crop->delete();

        return redirect()->route('admin.crops.index')->with('success', 'Crop deleted successfully.');
    }
}
