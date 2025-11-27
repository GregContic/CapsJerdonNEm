import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { MapPin, Check } from 'lucide-react';

export default function AdminDashboard({ auth, farmers = [], municipalities = [], barangays = [], sitios = [] }) {
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');
    const [selectedSitio, setSelectedSitio] = useState('');
    const [filteredBarangays, setFilteredBarangays] = useState([]);
    const [filteredSitios, setFilteredSitios] = useState([]);
    const [filteredFarmers, setFilteredFarmers] = useState(farmers);

    // Mock farmer data for display
    const mockFarmers = [
        { id: 1, name: 'Maribel Espada', crops: 3, lat: 16.42, lng: 120.59, municipality: 'La Trinidad', barangay: 'Ambiong', sitio: 'Boliwliw' },
        { id: 2, name: 'Daisy Soriano', crops: 2, lat: 16.45, lng: 120.64, municipality: 'La Trinidad', barangay: 'Ambiong', sitio: 'Boliwliw' },
        { id: 3, name: 'Joel Pacalso', crops: 3, lat: 16.38, lng: 120.60, municipality: 'La Trinidad', barangay: 'Ambiong', sitio: 'Boliwliw' },
    ];

    const displayFarmers = farmers.length > 0 ? farmers : mockFarmers;

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
            <Head title="Admin Dashboard" />
            
            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2">
                                <img src="/logo.png" alt="Hrvst Logo" className="w-8 h-8" />
                                <span className="text-xl font-semibold text-gray-900">Hrvst</span>
                            </Link>

                            {/* Centered Navigation */}
                            <nav className="flex items-center gap-6 mx-auto">
                                <Link href={route('admin.dashboard')} className="text-gray-900 font-medium">
                                    Farmers
                                </Link>
                                <Link href={route('admin.crops.manage')} className="text-gray-600 hover:text-gray-900">
                                    Crops
                                </Link>
                            </nav>

                            {/* Log out Button */}
                            <button
                                onClick={() => router.post(route('logout'))}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </header>

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
                    <div className="flex-1 relative">
                        {/* Embedded Map with OpenStreetMap */}
                        <div className="w-full h-full relative">
                            <iframe
                                src="https://www.openstreetmap.org/export/embed.html?bbox=120.55%2C16.35%2C120.65%2C16.47&layer=mapnik&marker=16.41%2C120.59"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                className="absolute inset-0"
                            />
                            
                            {/* Farmer Markers Overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                {filteredFarmers.map((farmer, index) => (
                                    <div
                                        key={farmer.id}
                                        className="absolute pointer-events-auto"
                                        style={{
                                            left: `${20 + (index * 22)}%`,
                                            top: `${15 + (index * 25)}%`,
                                        }}
                                    >
                                        {/* Farmer Info Card */}
                                        <div className="bg-white rounded-lg shadow-lg p-3 mb-2 min-w-[140px]">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-medium text-sm">{farmer.name}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {Array.from({ length: farmer.crops || 3 }).map((_, idx) => (
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

                            {/* Clock Icon - Top Right */}
                            <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg pointer-events-auto">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
