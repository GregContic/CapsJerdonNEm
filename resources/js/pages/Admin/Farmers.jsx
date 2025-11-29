import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Clock, MapPin, Check, X } from 'lucide-react';

export default function FarmersIndex({ auth, approvedFarmers = [], pendingFarmers = [], municipalities = [], filters = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMunicipality, setSelectedMunicipality] = useState(filters.municipality_id || '');
    const [selectedBarangay, setSelectedBarangay] = useState(filters.barangay_id || '');
    const [selectedSitio, setSelectedSitio] = useState(filters.sitio_id || '');
    const [showApproved, setShowApproved] = useState(true);
    const [barangays, setBarangays] = useState([]);
    const [sitios, setSitios] = useState([]);

    // Get farmers to display based on toggle
    const farmers = showApproved ? approvedFarmers : pendingFarmers;

    // Filter farmers based on search
    const filteredFarmers = farmers.filter(farmer => {
        const farmerName = farmer.user?.name || '';
        const matchesSearch = farmerName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleMunicipalityChange = async (municipalityId) => {
        setSelectedMunicipality(municipalityId);
        setSelectedBarangay('');
        setSelectedSitio('');
        setSitios([]);

        if (municipalityId) {
            try {
                const response = await fetch(`/api/barangays?municipality_id=${municipalityId}`);
                const data = await response.json();
                setBarangays(data);
            } catch (error) {
                console.error('Error fetching barangays:', error);
            }
        } else {
            setBarangays([]);
        }
    };

    const handleBarangayChange = async (barangayId) => {
        setSelectedBarangay(barangayId);
        setSelectedSitio('');

        if (barangayId) {
            try {
                const response = await fetch(`/api/sitios?barangay_id=${barangayId}`);
                const data = await response.json();
                setSitios(data);
            } catch (error) {
                console.error('Error fetching sitios:', error);
            }
        } else {
            setSitios([]);
        }
    };

    const handleFilter = () => {
        router.get(route('admin.farmers.index'), {
            municipality_id: selectedMunicipality,
            barangay_id: selectedBarangay,
            sitio_id: selectedSitio,
        });
    };

    const handleApproveFarmer = (userId) => {
        if (confirm('Are you sure you want to approve this farmer?')) {
            router.post(route('admin.farmers.approve', userId));
        }
    };

    const handleDeleteFarmer = (farmerId) => {
        if (confirm('Are you sure you want to delete this farmer? This action cannot be undone.')) {
            router.delete(route('admin.farmers.destroy', farmerId));
        }
    };

    return (
        <>
            <Head title="Farmers" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
                {/* Header */}
                <Navbar auth={auth} />

                {/* Main Content */}
                <div className="flex h-[calc(100vh-64px)]">
                    {/* Sidebar - Filters */}
                    <div className="w-64 bg-white p-6 border-r border-gray-200 overflow-y-auto">
                        {/* Search */}
                        <div className="mb-6">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search Farmers"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        {/* Status Toggle */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Status</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowApproved(true)}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                                        showApproved
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Approved
                                </button>
                                <button
                                    onClick={() => setShowApproved(false)}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                                        !showApproved
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Pending
                                </button>
                            </div>
                        </div>

                        {/* Location Filters */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Location</h3>
                            <div className="space-y-3">
                                {/* Municipality */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Municipality
                                    </label>
                                    <select
                                        value={selectedMunicipality}
                                        onChange={(e) => handleMunicipalityChange(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    >
                                        <option value="">All</option>
                                        {municipalities.map((municipality) => (
                                            <option key={municipality.id} value={municipality.id}>
                                                {municipality.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Barangay */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Barangay
                                    </label>
                                    <select
                                        value={selectedBarangay}
                                        onChange={(e) => handleBarangayChange(e.target.value)}
                                        disabled={!selectedMunicipality}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">All</option>
                                        {barangays.map((barangay) => (
                                            <option key={barangay.id} value={barangay.id}>
                                                {barangay.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sitio */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Sitio
                                    </label>
                                    <select
                                        value={selectedSitio}
                                        onChange={(e) => setSelectedSitio(e.target.value)}
                                        disabled={!selectedBarangay}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">All</option>
                                        {sitios.map((sitio) => (
                                            <option key={sitio.id} value={sitio.id}>
                                                {sitio.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Apply Filter Button */}
                                <button
                                    onClick={handleFilter}
                                    className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Farmers Grid */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-7xl mx-auto">
                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {showApproved ? 'Approved Farmers' : 'Pending Farmers'}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {filteredFarmers.length} {filteredFarmers.length === 1 ? 'farmer' : 'farmers'} found
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredFarmers.map((farmer) => (
                                    <div key={farmer.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                                        {/* Farmer Header */}
                                        <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative">
                                            <div className="text-5xl">👨‍🌾</div>
                                            {!showApproved && (
                                                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                                                    Pending
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Farmer Details */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">{farmer.user?.name || 'Unknown'}</h3>
                                            
                                            {/* Location */}
                                            <div className="flex items-start gap-1 text-xs text-gray-600 mb-3">
                                                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    {farmer.municipality?.name && <div>{farmer.municipality.name}</div>}
                                                    {farmer.barangay?.name && <div>{farmer.barangay.name}</div>}
                                                    {farmer.sitio?.name && <div>{farmer.sitio.name}</div>}
                                                </div>
                                            </div>

                                            {/* Crops */}
                                            {farmer.crops && farmer.crops.length > 0 && (
                                                <div className="mb-3">
                                                    <p className="text-xs font-medium text-gray-700 mb-1">Crops:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {farmer.crops.slice(0, 3).map((crop) => (
                                                            <span
                                                                key={crop.id}
                                                                className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded"
                                                            >
                                                                {crop.name}
                                                            </span>
                                                        ))}
                                                        {farmer.crops.length > 3 && (
                                                            <span className="text-xs text-gray-500">
                                                                +{farmer.crops.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Action Buttons */}
                                            <div className="space-y-2">
                                                {!showApproved && (
                                                    <button
                                                        onClick={() => handleApproveFarmer(farmer.user_id)}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Approve
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteFarmer(farmer.id)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* No Results */}
                            {filteredFarmers.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No farmers found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Clock Icon - Top Right */}
                    <div className="fixed top-20 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-[1000]">
                        <Clock className="w-6 h-6 text-gray-600" />
                    </div>
                </div>
            </div>
        </>
    );
}
