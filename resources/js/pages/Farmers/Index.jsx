import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ farmers, municipalities, filters }) {
    const [selectedMunicipality, setSelectedMunicipality] = useState(filters.municipality_id || '');
    const [selectedBarangay, setSelectedBarangay] = useState(filters.barangay_id || '');
    const [selectedSitio, setSelectedSitio] = useState(filters.sitio_id || '');
    const [barangays, setBarangays] = useState([]);
    const [sitios, setSitios] = useState([]);

    const handleMunicipalityChange = async (e) => {
        const municipalityId = e.target.value;
        setSelectedMunicipality(municipalityId);
        setSelectedBarangay('');
        setSelectedSitio('');
        setBarangays([]);
        setSitios([]);

        if (municipalityId) {
            const response = await fetch(`/api/barangays?municipality_id=${municipalityId}`);
            const data = await response.json();
            setBarangays(data);
        }

        applyFilters({ municipality_id: municipalityId, barangay_id: '', sitio_id: '' });
    };

    const handleBarangayChange = async (e) => {
        const barangayId = e.target.value;
        setSelectedBarangay(barangayId);
        setSelectedSitio('');
        setSitios([]);

        if (barangayId) {
            const response = await fetch(`/api/sitios?barangay_id=${barangayId}`);
            const data = await response.json();
            setSitios(data);
        }

        applyFilters({ municipality_id: selectedMunicipality, barangay_id: barangayId, sitio_id: '' });
    };

    const handleSitioChange = (e) => {
        const sitioId = e.target.value;
        setSelectedSitio(sitioId);
        applyFilters({ municipality_id: selectedMunicipality, barangay_id: selectedBarangay, sitio_id: sitioId });
    };

    const applyFilters = (filters) => {
        router.get(route('farmers.index'), filters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setSelectedMunicipality('');
        setSelectedBarangay('');
        setSelectedSitio('');
        setBarangays([]);
        setSitios([]);
        router.get(route('farmers.index'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Farmers
                </h2>
            }
        >
            <Head title="Farmers" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-semibold">Filter Farmers</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Municipality</label>
                                <select
                                    value={selectedMunicipality}
                                    onChange={handleMunicipalityChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All Municipalities</option>
                                    {municipalities.map((municipality) => (
                                        <option key={municipality.id} value={municipality.id}>
                                            {municipality.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Barangay</label>
                                <select
                                    value={selectedBarangay}
                                    onChange={handleBarangayChange}
                                    disabled={!selectedMunicipality}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                                >
                                    <option value="">All Barangays</option>
                                    {barangays.map((barangay) => (
                                        <option key={barangay.id} value={barangay.id}>
                                            {barangay.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sitio</label>
                                <select
                                    value={selectedSitio}
                                    onChange={handleSitioChange}
                                    disabled={!selectedBarangay}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                                >
                                    <option value="">All Sitios</option>
                                    {sitios.map((sitio) => (
                                        <option key={sitio.id} value={sitio.id}>
                                            {sitio.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={resetFilters}
                                    className="w-full rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Farmers List */}
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold">
                                Approved Farmers ({farmers.length})
                            </h3>
                            
                            {farmers.length === 0 ? (
                                <p className="text-gray-500">No farmers found.</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {farmers.map((farmer) => (
                                        <div
                                            key={farmer.id}
                                            className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => router.visit(route('farmers.show', farmer.id))}
                                        >
                                            <h4 className="font-semibold text-lg text-gray-900">
                                                {farmer.user.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">{farmer.user.email}</p>
                                            
                                            <div className="mt-3 space-y-1 text-sm text-gray-700">
                                                <p><span className="font-medium">Municipality:</span> {farmer.municipality?.name}</p>
                                                <p><span className="font-medium">Barangay:</span> {farmer.barangay?.name}</p>
                                                {farmer.sitio && (
                                                    <p><span className="font-medium">Sitio:</span> {farmer.sitio.name}</p>
                                                )}
                                            </div>

                                            {farmer.crops && farmer.crops.length > 0 && (
                                                <div className="mt-3">
                                                    <p className="text-xs font-medium text-gray-600 mb-1">Crops:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {farmer.crops.map((crop) => (
                                                            <span
                                                                key={crop.id}
                                                                className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-800"
                                                            >
                                                                {crop.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
