import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import Navbar from '@/Components/Navbar';

export default function ManageCrops({ auth, crops = [], categories = [] }) {
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
        router.get(route('admin.crops.edit', crop.id));
    };

    return (
        <>
            <Head title="Manage Crops" />
            
            <div className="min-h-screen bg-white">
                {/* Header */}
                <Navbar auth={auth} />

                {/* Main Content */}
                <div className="flex h-[calc(100vh-64px)]">
                    {/* Sidebar - Categories */}
                    <div className="w-64 bg-green-50 p-6 border-r border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Categories</h3>
                        
                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`w-full text-left px-4 py-2 rounded-md transition-colors flex justify-between items-center ${
                                    selectedCategory === 'all'
                                        ? 'bg-white font-semibold'
                                        : 'hover:bg-green-100'
                                }`}
                            >
                                <span>All</span>
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

                    {/* Crops Grid */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-7xl mx-auto p-8">
                            {/* Clock Icon - Top Right */}
                            <div className="flex justify-end mb-6">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCrops.map((crop) => (
                                    <div
                                        key={crop.id}
                                        className="bg-green-100 rounded-lg p-4 relative"
                                    >
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(crop.id)}
                                            className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 rounded-full hover:bg-gray-800 transition-colors font-medium"
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
                                            <h4 className="font-medium text-gray-900 mb-1">Crop Name</h4>
                                            <p className="text-lg font-semibold text-gray-900">
                                                € 12.00
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
        </>
    );
}
