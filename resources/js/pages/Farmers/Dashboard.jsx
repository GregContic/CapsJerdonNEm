import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MapView from '@/components/MapView';

export default function FarmerDashboard({ auth, farmers = [], municipalities = [], barangays = [], sitios = [] }) {
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
                    </div>
                </div>
            </div>
        </>
    );
}
