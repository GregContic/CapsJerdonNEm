import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MapView from '@/components/MapView';
import { Clock, X } from 'lucide-react';

export default function AdminDashboard({ auth, farmers = [], municipalities = [], barangays = [], sitios = [], pendingFarmers = [] }) {
    const [showPendingPanel, setShowPendingPanel] = useState(false);
    // Mock farmer data for display
    const mockFarmers = [
        { id: 1, name: 'Maribel Espada', crops: [{ name: 'Tomato' }, { name: 'Lettuce' }, { name: 'Carrot' }], latitude: 16.42, longitude: 120.59, municipality: 'La Trinidad', barangay: 'Ambiong', sitio: 'Boliwliw' },
        { id: 2, name: 'Daisy Soriano', crops: [{ name: 'Potato' }, { name: 'Onion' }], latitude: 16.45, longitude: 120.64, municipality: 'La Trinidad', barangay: 'Ambiong', sitio: 'Boliwliw' },
        { id: 3, name: 'Joel Pacalso', crops: [{ name: 'Cabbage' }, { name: 'Broccoli' }, { name: 'Spinach' }], latitude: 16.38, longitude: 120.60, municipality: 'La Trinidad', barangay: 'Ambiong', sitio: 'Boliwliw' },
    ];

    const displayFarmers = farmers && farmers.length > 0 ? farmers : mockFarmers;
    
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');
    const [selectedSitio, setSelectedSitio] = useState('');
    const [filteredBarangays, setFilteredBarangays] = useState([]);
    const [filteredSitios, setFilteredSitios] = useState([]);
    const [filteredFarmers, setFilteredFarmers] = useState(displayFarmers);

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
            <Head title="Admin Dashboard" />
            
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
                        
                        {/* Clock Icon - Top Right */}
                        <button
                            onClick={() => setShowPendingPanel(!showPendingPanel)}
                            className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-[1000] hover:bg-gray-50 transition-colors"
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
                </div>
            </div>
        </>
    );
}
