import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { X, Upload } from 'lucide-react';

export default function EditCrop({ auth, crop, categories = [] }) {
    const [imagePreview, setImagePreview] = useState(
        crop.image_path ? `/storage/${crop.image_path}` : null
    );

    const { data, setData, post, processing, errors } = useForm({
        name: crop.name || '',
        price: crop.price || '',
        category_id: crop.category_id || '',
        image_path: null,
        _method: 'PUT',
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image_path', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.crops.update', crop.id), {
            forceFormData: true,
            onSuccess: () => {
                router.visit(route('admin.crops.index'));
            },
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this crop? This action cannot be undone.')) {
            router.delete(route('admin.crops.destroy', crop.id));
        }
    };

    return (
        <>
            <Head title={`Edit ${crop.name}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
                <Navbar auth={auth} />

                <div className="max-w-2xl mx-auto p-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Crop</h2>
                            <button
                                onClick={() => router.visit(route('admin.crops.index'))}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Crop Image
                                </label>
                                <div className="relative">
                                    {imagePreview ? (
                                        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setData('image_path', null);
                                                }}
                                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="w-full h-48 bg-green-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-green-300 cursor-pointer hover:bg-green-200 transition-colors">
                                            <Upload className="w-12 h-12 text-green-600 mb-2" />
                                            <span className="text-sm text-gray-600">Click to upload image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                    {imagePreview && (
                                        <label className="mt-2 block">
                                            <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                                                Change image
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                                {errors.image_path && (
                                    <p className="text-red-500 text-sm mt-1">{errors.image_path}</p>
                                )}
                            </div>

                            {/* Crop Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Crop Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., Tomato, Lettuce, Carrot"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (₱)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    required
                                />
                                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={processing}
                                    className="px-6 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Delete
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
