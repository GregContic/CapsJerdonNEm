import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Clock, Plus } from 'lucide-react';

export default function CropsIndex({ crops, categories }) {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredCrops = selectedCategory === 'all' 
        ? crops 
        : crops.filter(crop => crop.category_id === selectedCategory);

    const handleDelete = (cropId) => {
        if (confirm('Are you sure you want to delete this crop?')) {
            router.delete(route('admin.crops.destroy', cropId));
        }
    };

    const handleEdit = (crop) => {
        // Navigate to edit page or open modal
        router.get(route('admin.crops.edit', crop.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Hrvst
                    </h2>
                    <button
                        onClick={() => router.get(route('logout'), {}, { method: 'post' })}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            }
        >
            <Head title="Crops Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex gap-6">
                        {/* Sidebar - Categories */}
                        <div className="w-64 bg-green-50 rounded-lg p-6 h-fit">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`w-full text-left px-4 py-2 rounded-md transition-colors flex justify-between items-center ${
                                        selectedCategory === 'all'
                                            ? 'bg-white font-semibold'
                                            : 'hover:bg-green-100'
                                    }`}
                                >
                                    <span>All Crops</span>
                                    <span className="text-sm bg-green-600 text-white px-2 py-0.5 rounded">
                                        Add
                                    </span>
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`w-full text-left px-4 py-2 rounded-md transition-colors flex justify-between items-center ${
                                            selectedCategory === category.id
                                                ? 'bg-white font-semibold'
                                                : 'hover:bg-green-100'
                                        }`}
                                    >
                                        <span>{category.name}</span>
                                        <span className="text-sm bg-green-600 text-white px-2 py-0.5 rounded">
                                            Add
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Content - Crops Grid */}
                        <div className="flex-1">
                            {/* Top Navigation */}
                            <div className="flex gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
                                <button className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium border-b-2 border-gray-900">
                                    Farmers
                                </button>
                                <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                                    Crops
                                </button>
                                <div className="ml-auto flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Crops Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCrops.map((crop) => (
                                    <div
                                        key={crop.id}
                                        className="bg-green-100 rounded-lg p-4 relative"
                                    >
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(crop.id)}
                                            className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 rounded-full hover:bg-gray-800 transition-colors"
                                        >
                                            DELETE
                                        </button>

                                        {/* Crop Image */}
                                        <div className="bg-green-200 rounded-lg h-32 flex items-center justify-center mb-4">
                                            {crop.image_path ? (
                                                <img
                                                    src={`/storage/${crop.image_path}`}
                                                    alt={crop.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <svg
                                                    className="w-12 h-12 text-green-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Crop Info */}
                                        <div className="mb-3">
                                            <h4 className="font-medium text-gray-900">{crop.name}</h4>
                                            <p className="text-lg font-semibold text-gray-900">
                                                € {parseFloat(crop.price).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleEdit(crop)}
                                            className="w-full py-2 border border-gray-900 rounded-lg text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                ))}

                                {/* Add New Crop Card */}
                                <button
                                    onClick={() => router.get(route('admin.crops.create'))}
                                    className="bg-green-100 rounded-lg p-4 border-2 border-dashed border-green-300 hover:border-green-400 transition-colors flex flex-col items-center justify-center min-h-[280px]"
                                >
                                    <Plus className="w-12 h-12 text-green-600 mb-2" />
                                    <span className="text-gray-600 font-medium">Add New Crop</span>
                                </button>
                            </div>

                            {filteredCrops.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    No crops found in this category.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
