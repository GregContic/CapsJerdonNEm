import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff, MapPin } from 'lucide-react';

export default function Register({ municipalities = [], crops = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '+63',
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
                        <div className="flex items-center gap-4 mb-8">
                            <img src="/logo.png" alt="Hrvst Logo" className="w-20 h-20" />
                            <h1 className="text-4xl font-bold text-white">
                                Welcome, Farmer!
                            </h1>
                        </div>
                        <p className="text-xl text-gray-300">
                            Let's maximize your efforts from seed to harvest.
                        </p>
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

                        <form onSubmit={submit} className="space-y-4">
                            {/* Display general errors */}
                            {Object.keys(errors).length > 0 && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    <p className="font-medium mb-2">Please fix the following errors:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {Object.entries(errors).map(([key, value]) => (
                                            <li key={key} className="text-sm">{value}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Jane Doe"
                                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="name@email.com"
                                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                    required
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
                                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1" />
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
                                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswordConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>

                            {/* Phone Number Field */}
                            <div>
                                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    value={data.phone_number}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        // Always start with +63
                                        if (!value.startsWith('+63')) {
                                            value = '+63';
                                        }
                                        // Remove any non-digit characters except the + at the start
                                        value = '+63' + value.slice(3).replace(/\D/g, '');
                                        // Limit to +63 plus 10 digits
                                        if (value.length > 13) {
                                            value = value.slice(0, 13);
                                        }
                                        setData('phone_number', value);
                                    }}
                                    placeholder="+63 9123456789"
                                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                    required
                                    maxLength={13}
                                />
                                <InputError message={errors.phone_number} className="mt-1" />
                            </div>

                            {/* Municipality/Barangay/Sitio Section */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-900">Municipality/Barangay/Sitio</h3>
                                
                                {/* Municipality */}
                                <div>
                                    <select
                                        value={data.municipality_id}
                                        onChange={(e) => handleMunicipalityChange(e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white"
                                    >
                                        <option value="">Municipality</option>
                                        {municipalities.map((municipality) => (
                                            <option key={municipality.id} value={municipality.id}>
                                                {municipality.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.municipality_id} className="mt-1" />
                                </div>

                                {/* Barangay */}
                                <div>
                                    <select
                                        value={data.barangay_id}
                                        onChange={(e) => handleBarangayChange(e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white"
                                        disabled={!data.municipality_id}
                                    >
                                        <option value="">Barangay</option>
                                        {barangays.map((barangay) => (
                                            <option key={barangay.id} value={barangay.id}>
                                                {barangay.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.barangay_id} className="mt-1" />
                                </div>

                                {/* Sitio */}
                                <div>
                                    <select
                                        value={data.sitio_id}
                                        onChange={(e) => setData('sitio_id', e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white"
                                        disabled={!data.barangay_id}
                                    >
                                        <option value="">Sitio</option>
                                        {sitios.map((sitio) => (
                                            <option key={sitio.id} value={sitio.id}>
                                                {sitio.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.sitio_id} className="mt-1" />
                                </div>
                            </div>

                            {/* Geolocation Section */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900">Point your Farm!</h3>
                                <button
                                    type="button"
                                    onClick={handleLocateAddress}
                                    disabled={locating}
                                    className="w-full bg-green-600 text-white py-2 text-sm rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-green-600 text-white py-2 text-sm rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
