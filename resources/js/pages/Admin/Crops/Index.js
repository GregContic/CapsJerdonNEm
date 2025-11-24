import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ crops, categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        price: '',
        category_id: '',
        image: null,
    });

    const openCreateModal = () => {
        reset();
        setImagePreview(null);
        setEditingCrop(null);
        setIsModalOpen(true);
    };

    const openEditModal = (crop) => {
        setData({
            name: crop.name,
            price: crop.price,
            category_id: crop.category_id,
            image: null,
        });
        setImagePreview(crop.image ? `/storage/${crop.image}` : null);
        setEditingCrop(crop);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        setImagePreview(null);
        setEditingCrop(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        if (editingCrop) {
            post(route('admin.crops.update', editingCrop.id), {
                _method: 'put',
                forceFormData: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.crops.store'), {
                forceFormData: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Manage Crops
                    </h2>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Add New Crop
                    </button>
                </div>
            }
        >
            <Head title="Manage Crops" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {crops.map((crop) => (
                                    <div
                                        key={crop.id}
                                        className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                                    >
                                        {crop.image && (
                                            <img
                                                src={`/storage/${crop.image}`}
                                                alt={crop.name}
                                                className="w-full h-48 object-cover rounded-md mb-4"
                                            />
                                        )}
                                        <h3 className="text-lg font-semibold">{crop.name}</h3>
                                        <p className="text-sm text-gray-600">{crop.category.name}</p>
                                        <p className="text-xl font-bold text-green-600 mt-2">
                                            ₱{parseFloat(crop.price).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => openEditModal(crop)}
                                            className="mt-4 w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingCrop ? 'Edit Crop' : 'Add New Crop'}
                        </h3>
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Crop Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-red-600 text-sm mt-1">{errors.category_id}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (₱)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                />
                                {errors.price && (
                                    <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full"
                                />
                                {errors.image && (
                                    <p className="text-red-600 text-sm mt-1">{errors.image}</p>
                                )}
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="mt-2 w-full h-48 object-cover rounded-md"
                                    />
                                )}
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}