import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Clock, X } from 'lucide-react';

export default function CropsIndex({ auth, crops = [], categories = [], pendingFarmers = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPendingPanel, setShowPendingPanel] = useState(false);
    const [addCategoryId, setAddCategoryId] = useState(null);
    const [editingCrop, setEditingCrop] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        price: '',
        category_id: '',
    });

    // Filter crops based on search and category
    const filteredCrops = crops.filter(crop => {
        const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || crop.category_id == selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddClick = (categoryId) => {
        setAddCategoryId(categoryId);
        setData('category_id', categoryId);
        setShowAddModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.crops.store'), {
            onSuccess: () => {
                reset();
                setShowAddModal(false);
            },
        });
    };

    const handleEditClick = (crop) => {
        setEditingCrop(crop);
        setData({
            name: crop.name,
            price: crop.price,
            category_id: crop.category_id,
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        put(route('admin.crops.update', editingCrop.id), {
            onSuccess: () => {
                reset();
                setShowEditModal(false);
                setEditingCrop(null);
            },
        });
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : '';
    };

    const handleApproveFarmer = (userId) => {
        if (confirm('Are you sure you want to approve this farmer?')) {
            router.post(route('admin.farmers.approve', userId), {}, {
                onSuccess: () => {
                    // Panel will stay open to show remaining pending accounts
                },
            });
        }
    };

    const handleRejectFarmer = (farmerId) => {
        if (confirm('Are you sure you want to reject this farmer? This action cannot be undone.')) {
            router.delete(route('admin.farmers.destroy', farmerId), {
                onSuccess: () => {
                    // Panel will stay open to show remaining pending accounts
                },
            });
        }
    };

    return (
        <>
            <Head title="Crops" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
                {/* Header */}
                <Navbar auth={auth} />

                {/* Main Content */}
                <div className="flex h-[calc(100vh-64px)]">
                    {/* Sidebar - Categories */}
                    <div className="w-64 bg-white p-6 border-r border-gray-200 overflow-y-auto">
                        {/* Search */}
                        <div className="mb-6">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search Vegetables"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
                                            selectedCategory === category.id
                                                ? 'bg-green-100 text-green-900 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <button
                                            onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                                            className="flex-1 text-left"
                                        >
                                            {category.name}
                                        </button>
                                        {auth?.user?.isAdmin && (
                                            <button
                                                onClick={() => handleAddClick(category.id)}
                                                className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-full transition-colors"
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Crops Grid */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredCrops.map((crop) => (
                                    <div key={crop.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                                        {/* Crop Image */}
                                        <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                                            {crop.image_url ? (
                                                <img 
                                                    src={crop.image_url} 
                                                    alt={crop.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-6xl">🌿</div>
                                            )}
                                        </div>
                                        
                                        {/* Crop Details */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1">{crop.name}</h3>
                                            {crop.description && (
                                                <p className="text-xs text-gray-500 mb-2">{crop.description}</p>
                                            )}
                                            <p className="text-green-600 font-bold text-lg mb-3">₱ {crop.price || '0.00'}</p>
                                            
                                            {/* Edit Button */}
                                            {auth?.user?.isAdmin && (
                                                <button
                                                    onClick={() => handleEditClick(crop)}
                                                    className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* No Results */}
                            {filteredCrops.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No crops found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Clock Icon - Top Right */}
                    <button
                        onClick={() => setShowPendingPanel(!showPendingPanel)}
                        className="fixed top-20 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-[1000] hover:bg-gray-50 transition-colors relative"
                    >
                        <Clock className="w-6 h-6 text-gray-600" />
                        {pendingFarmers.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {pendingFarmers.length}
                            </span>
                        )}
                    </button>

                    {/* Pending Accounts Panel */}
                    <div
                        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[1500] transform transition-transform duration-300 ease-in-out ${
                            showPendingPanel ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    >
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Pending Accounts</h3>
                                </div>
                                <button
                                    onClick={() => setShowPendingPanel(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Pending Farmers List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {pendingFarmers.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>No pending accounts</p>
                                    </div>
                                ) : (
                                    pendingFarmers.map((farmer) => (
                                        <div
                                            key={farmer.id}
                                            className="bg-gray-50 rounded-lg p-4 space-y-3"
                                        >
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {farmer.user?.name || 'Unknown'}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {farmer.municipality?.name || 'N/A'}
                                                    {farmer.barangay?.name && `, ${farmer.barangay.name}`}
                                                </p>
                                            </div>

                                            {/* View Location Button */}
                                            {(farmer.latitude && farmer.longitude) && (
                                                <button className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors">
                                                    View Location
                                                </button>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => handleApproveFarmer(farmer.user_id)}
                                                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectFarmer(farmer.id)}
                                                    className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Overlay */}
                    {showPendingPanel && (
                        <div
                            onClick={() => setShowPendingPanel(false)}
                            className="fixed inset-0 bg-black bg-opacity-30 z-[1400]"
                        />
                    )}
                </div>

                {/* Add Crop Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-xl font-semibold mb-6">
                                Add new {getCategoryName(addCategoryId)}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Image Upload Area */}
                                <div className="w-full h-32 bg-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-green-300 cursor-pointer hover:bg-green-200 transition-colors">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <span className="text-white text-2xl">+</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Name Input */}
                                <div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Chayote"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                {/* Price Input */}
                                <div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="Price (₱)"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                        required
                                    />
                                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Adding...' : 'Add Crop'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Crop Modal */}
                {showEditModal && editingCrop && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
                        <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
                            <h2 className="text-lg font-semibold mb-4">
                                Edit {editingCrop.name}
                            </h2>

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                {/* Image Upload Area */}
                                <div className="w-full h-32 bg-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-green-300 cursor-pointer hover:bg-green-200 transition-colors">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                                            <span className="text-white text-2xl">+</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Input */}
                                <div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="₱ 15.00"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-center"
                                        required
                                    />
                                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setEditingCrop(null);
                                            reset();
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Saving...' : 'Confirm'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
