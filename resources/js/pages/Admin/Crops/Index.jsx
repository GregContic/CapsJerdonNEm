import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { MapPin, Check } from 'lucide-react';

export default function CropsIndex({ auth, farmers = [] }) {
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');
    const [selectedSitio, setSelectedSitio] = useState('');

    // Mock farmer data - replace with actual farmers prop
    const mockFarmers = [
        { id: 1, name: 'John Doe', crops: ['Tomato', 'Lettuce', 'Carrot'], lat: 16.4, lng: 120.6 },
        { id: 2, name: 'John Doe', crops: ['Potato', 'Onion'], lat: 16.42, lng: 120.58 },
        { id: 3, name: 'John Doe', crops: ['Cabbage', 'Broccoli', 'Spinach'], lat: 16.38, lng: 120.62 },
        { id: 4, name: 'John Doe', crops: ['Cucumber'], lat: 16.36, lng: 120.56 },
        { id: 5, name: 'John Doe', crops: ['Eggplant', 'Pepper'], lat: 16.44, lng: 120.64 },
    ];

    const displayFarmers = farmers.length > 0 ? farmers : mockFarmers;

    return (
        <>
            <Head title="Farmers Map" />
            
            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2">
                                <img src="/logo.png" alt="Hrvst Logo" className="w-8 h-8" />
                                <span className="text-xl font-semibold text-gray-900">Hrvst</span>
                            </Link>

                            {/* Navigation */}
                            <nav className="flex items-center gap-6">
                                <Link href={route('admin.crops.index')} className="text-gray-900 font-medium">
                                    Farmers
                                </Link>
                                <Link href={route('admin.crops.manage')} className="text-gray-600 hover:text-gray-900">
                                    Crops
                                </Link>
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex h-[calc(100vh-64px)]">
                    {/* Sidebar - Address Filters */}
                    <div className="w-64 bg-gray-50 p-6 border-r border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Address</h3>
                        
                        <div className="space-y-4">
                            {/* Municipality Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Municipality
                                </label>
                                <select
                                    value={selectedMunicipality}
                                    onChange={(e) => setSelectedMunicipality(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                >
                                    <option value="">Select Municipality</option>
                                    <option value="municipality1">Municipality 1</option>
                                    <option value="municipality2">Municipality 2</option>
                                </select>
                            </div>

                            {/* Barangay Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Barangay
                                </label>
                                <select
                                    value={selectedBarangay}
                                    onChange={(e) => setSelectedBarangay(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                >
                                    <option value="">Select Barangay</option>
                                    <option value="barangay1">Barangay 1</option>
                                    <option value="barangay2">Barangay 2</option>
                                </select>
                            </div>

                            {/* Sitio Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sitio
                                </label>
                                <select
                                    value={selectedSitio}
                                    onChange={(e) => setSelectedSitio(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                >
                                    <option value="">Select Sitio</option>
                                    <option value="sitio1">Sitio 1</option>
                                    <option value="sitio2">Sitio 2</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Map View */}
                    <div className="flex-1 relative bg-gradient-to-br from-green-50 to-green-100">
                        {/* Farmer Markers */}
                        {displayFarmers.map((farmer, index) => (
                            <div
                                key={farmer.id}
                                className="absolute"
                                style={{
                                    left: `${20 + (index * 15)}%`,
                                    top: `${15 + (index * 18)}%`,
                                }}
                            >
                                {/* Farmer Info Card */}
                                <div className="bg-white rounded-lg shadow-lg p-3 mb-2 min-w-[140px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-medium text-sm">{farmer.name}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {farmer.crops.map((crop, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-green-600 rounded-full p-1"
                                            >
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Map Pin */}
                                <div className="flex justify-center">
                                    <MapPin className="w-10 h-10 text-green-600 fill-green-600 drop-shadow-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
