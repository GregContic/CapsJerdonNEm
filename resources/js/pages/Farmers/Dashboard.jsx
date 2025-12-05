import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MapView from '@/components/MapView';
import { User, X } from 'lucide-react';

export default function FarmerDashboard({ auth, farmers = [], municipalities = [], barangays = [], sitios = [] }) {
    // Mock farmer data for display
    const mockFarmers = [
        { id: 1, name: 'Maribel Espada', crops: [{ name: 'Tomato' }, { name: 'Lettuce' }, { name: 'Carrot' }], latitude: 16.42, longitude: 120.59, municipality: 'La Trinidad', barangay: 'Ambiong', sitio: 'Boliwliw' },
        { id: 2, name: 'Daisy Soriano', crops: [{ name: 'Potato' }, { name: 'Onion' }], latitude: 16.45, longitude: 120.64, municipality: 'La Trinidad', barangay: 'Ambiong', sitio: 'Boliwliw' },
        { id: 3, name: 'Joel Pacalso', crops: [{ name: 'Cabbage' }, { name: 'Broccoli' }, { name: 'Spinach' }], latitude: 16.38, longitude: 120.60, municipality: 'La Trinidad', barangay: 'Ambiong', sitio: 'Boliwliw' },
    ];

    const displayFarmers = farmers && farmers.length > 0 ? farmers : mockFarmers;
    
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');
    const [selectedSitio, setSelectedSitio] = useState('');
    const [filteredBarangays, setFilteredBarangays] = useState([]);
    const [filteredSitios, setFilteredSitios] = useState([]);
    const [filteredFarmers, setFilteredFarmers] = useState(displayFarmers);

    // Get current farmer's data
    const currentFarmer = auth?.user ? farmers.find(f => f.user_id === auth.user.id) : null;

    // Filter barangays when municipality changes
    useEffect(() => {
        if (selectedMunicipality) {
            const filtered = barangays.filter(b => b.municipality_id == selectedMunicipality);
            setFilteredBarangays(filtered);
        } else {
            setFilteredBarangays([]);
        }
        setSelectedBarangay('');
        setSelectedSitio('');
        setFilteredSitios([]);
    }, [selectedMunicipality]);

    // Filter sitios when barangay changes
    useEffect(() => {
        if (selectedBarangay) {
            const filtered = sitios.filter(s => s.barangay_id == selectedBarangay);
            setFilteredSitios(filtered);
        } else {
            setFilteredSitios([]);
        }
        setSelectedSitio('');
    }, [selectedBarangay]);

    // Filter farmers based on location
    useEffect(() => {
        let filtered = displayFarmers;

        if (selectedMunicipality) {
            filtered = filtered.filter(f => f.municipality_id == selectedMunicipality || f.municipality == selectedMunicipality);
        }
        if (selectedBarangay) {
            filtered = filtered.filter(f => f.barangay_id == selectedBarangay || f.barangay == selectedBarangay);
        }
        if (selectedSitio) {
            filtered = filtered.filter(f => f.sitio_id == selectedSitio || f.sitio == selectedSitio);
        }

        setFilteredFarmers(filtered);
    }, [selectedMunicipality, selectedBarangay, selectedSitio]);

    return (
        <>
            <Head title="Dashboard" />
            
            <div className="min-h-screen bg-white">
                {/* Header */}
                <Navbar auth={auth} />

                {/* Main Content */}
                <div className="flex h-[calc(100vh-64px)]">
                    {/* Sidebar - Address Filters */}
                    <div className="w-64 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Address</h3>
                        
                        <div className="space-y-4">
                            {/* Municipality Dropdown */}
                            <div>
                                <select
                                    value={selectedMunicipality}
                                    onChange={(e) => setSelectedMunicipality(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                                >
                                    <option value="">La Trinidad</option>
                                    {municipalities.map((municipality) => (
                                        <option key={municipality.id} value={municipality.id}>
                                            {municipality.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Barangay Dropdown */}
                            <div>
                                <select
                                    value={selectedBarangay}
                                    onChange={(e) => setSelectedBarangay(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                                    disabled={!selectedMunicipality && filteredBarangays.length === 0}
                                >
                                    <option value="">Ambiong</option>
                                    {filteredBarangays.map((barangay) => (
                                        <option key={barangay.id} value={barangay.id}>
                                            {barangay.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sitio Dropdown/List */}
                            <div>
                                <select
                                    value={selectedSitio}
                                    onChange={(e) => setSelectedSitio(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm mb-3"
                                    disabled={!selectedBarangay && filteredSitios.length === 0}
                                >
                                    <option value="">Sitio</option>
                                    {filteredSitios.map((sitio) => (
                                        <option key={sitio.id} value={sitio.id}>
                                            {sitio.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Sitio List */}
                                <div className="space-y-2">
                                    {['Boliwliw', 'Central Ambiong', 'Gulon', 'Paltingan', 'Parapad'].map((sitio, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedSitio(sitio)}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                                selectedSitio === sitio
                                                    ? 'bg-green-100 text-green-900 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {sitio}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map View */}
                    <div className="flex-1 relative h-full">
                        <div className="w-full h-full">
                            <MapView farmers={filteredFarmers} />
                        </div>

                        {/* Profile Button - Top Right */}
                        {auth?.user && currentFarmer && (
                            <button
                                onClick={() => setShowProfileModal(true)}
                                className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-[1000] hover:bg-gray-50 transition-colors"
                            >
                                <User className="w-6 h-6 text-gray-600" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Modal */}
                {showProfileModal && currentFarmer && (
                    <>
                        {/* Overlay */}
                        <div
                            onClick={() => setShowProfileModal(false)}
                            className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center p-4"
                        >
                            {/* Modal */}
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-lg shadow-xl w-full max-w-sm relative"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowProfileModal(false)}
                                    className="absolute top-4 left-4 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-10"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* Header */}
                                <div className="px-6 pt-12 pb-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    {/* Profile Info */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-700">Name:</span>
                                            <span className="text-sm text-gray-900">{auth.user.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-700">Municipality:</span>
                                            <span className="text-sm text-gray-900">{currentFarmer.municipality?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-700">Barangay:</span>
                                            <span className="text-sm text-gray-900">{currentFarmer.barangay?.name || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {/* Map Preview */}
                                    {currentFarmer.latitude && currentFarmer.longitude && (
                                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                                            <div className="h-48 bg-gray-100 relative">
                                                <img
                                                    src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+00ff00(${currentFarmer.longitude},${currentFarmer.latitude})/${currentFarmer.longitude},${currentFarmer.latitude},13,0/400x300@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`}
                                                    alt="Farm Location"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Crops Section */}
                                    {currentFarmer.crops && currentFarmer.crops.length > 0 && (
                                        <div className="space-y-3">
                                            {currentFarmer.crops.slice(0, 2).map((crop, index) => (
                                                <div key={crop.id} className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {crop.image_path ? (
                                                            <img
                                                                src={`/storage/${crop.image_path}`}
                                                                alt={crop.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-2xl">
                                                                🌿
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-semibold text-gray-900">{crop.name}</h4>
                                                        <p className="text-xs text-gray-600">
                                                            {currentFarmer.crops.length} of Farmers has this crop.
                                                        </p>
                                                    </div>
                                                    {index === currentFarmer.crops.length - 1 && currentFarmer.crops.length > 2 && (
                                                        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-md transition-colors">
                                                            Add
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
