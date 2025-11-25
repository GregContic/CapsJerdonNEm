import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Register({ municipalities = [], crops = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '',
        municipality_id: '',
        barangay_id: '',
        sitio_id: '',
        latitude: '',
        longitude: '',
        crops: [],
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [barangays, setBarangays] = useState([]);
    const [sitios, setSitios] = useState([]);
    const [locating, setLocating] = useState(false);

    const handleMunicipalityChange = async (municipalityId) => {
        setData({ ...data, municipality_id: municipalityId, barangay_id: '', sitio_id: '' });
        setBarangays([]);
        setSitios([]);
        
        if (municipalityId) {
            try {
                const response = await fetch(`/api/barangays?municipality_id=${municipalityId}`);
                const result = await response.json();
                setBarangays(result);
            } catch (error) {
                console.error('Error fetching barangays:', error);
            }
        }
    };

    const handleBarangayChange = async (barangayId) => {
        setData({ ...data, barangay_id: barangayId, sitio_id: '' });
        setSitios([]);
        
        if (barangayId) {
            try {
                const response = await fetch(`/api/sitios?barangay_id=${barangayId}`);
                const result = await response.json();
                setSitios(result);
            } catch (error) {
                console.error('Error fetching sitios:', error);
            }
        }
    };

    const handleLocateAddress = () => {
        if (navigator.geolocation) {
            setLocating(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setData({
                        ...data,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString(),
                    });
                    setLocating(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please enable location services.');
                    setLocating(false);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    const handleCropToggle = (cropId) => {
        const currentCrops = data.crops;
        if (currentCrops.includes(cropId)) {
            setData('crops', currentCrops.filter(id => id !== cropId));
        } else if (currentCrops.length < 5) {
            setData('crops', [...currentCrops, cropId]);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            
            <div className="flex min-h-screen">
                {/* Left Side - Dark Background */}
                <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center p-12">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold text-white mb-6">
                            Create your free account
                        </h1>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                    <div className="w-full max-w-md">
                        {/* Already have an account link */}
                        <div className="text-right mb-8">
                            <span className="text-gray-600">Already have an account?</span>
                            {' '}
                            <Link
                                href={route('login')}
                                className="text-gray-900 font-medium hover:underline"
                            >
                                Sign In →
                            </Link>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Jane Doe"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="name@email.com"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Create a password"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showPasswordConfirmation ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm your Password"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswordConfirmation ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            {/* Phone Number Field */}
                            <div>
                                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    placeholder="+63 912 345 6789"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                    required
                                />
                                <InputError message={errors.phone_number} className="mt-2" />
                            </div>

                            {/* Municipality/Barangay/Sitio Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-900">Municipality/Barangay/Sitio</h3>
                                
                                {/* Municipality */}
                                <div>
                                    <select
                                        value={data.municipality_id}
                                        onChange={(e) => handleMunicipalityChange(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white"
                                        required
                                    >
                                        <option value="">Municipality</option>
                                        {municipalities.map((municipality) => (
                                            <option key={municipality.id} value={municipality.id}>
                                                {municipality.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.municipality_id} className="mt-2" />
                                </div>

                                {/* Barangay */}
                                <div>
                                    <select
                                        value={data.barangay_id}
                                        onChange={(e) => handleBarangayChange(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white"
                                        required
                                        disabled={!data.municipality_id}
                                    >
                                        <option value="">Barangay</option>
                                        {barangays.map((barangay) => (
                                            <option key={barangay.id} value={barangay.id}>
                                                {barangay.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.barangay_id} className="mt-2" />
                                </div>

                                {/* Sitio */}
                                <div>
                                    <select
                                        value={data.sitio_id}
                                        onChange={(e) => setData('sitio_id', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white"
                                        required
                                        disabled={!data.barangay_id}
                                    >
                                        <option value="">Sitio</option>
                                        {sitios.map((sitio) => (
                                            <option key={sitio.id} value={sitio.id}>
                                                {sitio.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.sitio_id} className="mt-2" />
                                </div>
                            </div>

                            {/* Geolocation Section */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-900">Geolocation</h3>
                                <button
                                    type="button"
                                    onClick={handleLocateAddress}
                                    disabled={locating}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {locating ? 'Locating...' : 'Locate your Address'}
                                </button>
                                {data.latitude && data.longitude && (
                                    <p className="text-xs text-gray-500 text-center">
                                        Location: {parseFloat(data.latitude).toFixed(6)}, {parseFloat(data.longitude).toFixed(6)}
                                    </p>
                                )}
                                <InputError message={errors.latitude || errors.longitude} className="mt-2" />
                            </div>

                            {/* Crops Selection */}
                            {crops.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        Select Crops (1-5) <span className="text-gray-500">- {data.crops.length} selected</span>
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                                        {crops.map((crop) => (
                                            <label
                                                key={crop.id}
                                                className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                                                    data.crops.includes(crop.id)
                                                        ? 'bg-green-100 border-2 border-green-600'
                                                        : 'bg-gray-50 border border-gray-300 hover:bg-gray-100'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.crops.includes(crop.id)}
                                                    onChange={() => handleCropToggle(crop.id)}
                                                    className="mr-2"
                                                    disabled={!data.crops.includes(crop.id) && data.crops.length >= 5}
                                                />
                                                <span className="text-sm">{crop.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.crops} className="mt-2" />
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Creating Account...' : 'Create Account'}
                            </button>

                            {/* Terms and Privacy */}
                            <div className="flex items-start gap-2 pt-4">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="mt-1 rounded border-gray-300"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-600">
                                    I've read and agree with the{' '}
                                    <a href="#" className="text-gray-900 font-medium hover:underline">
                                        Terms and Conditions
                                    </a>
                                    {' '}and the{' '}
                                    <a href="#" className="text-gray-900 font-medium hover:underline">
                                        Privacy Policy
                                    </a>
                                    .
                                </label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
