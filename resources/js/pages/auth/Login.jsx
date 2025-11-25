import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onSuccess: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />
            
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Welcome Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome!
                        </h1>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 text-center">
                            {status}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={submit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Email Address"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                                required
                                autoFocus
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all pr-10"
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

                        {/* Forgot Password Link */}
                        {canResetPassword && (
                            <div className="text-left">
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Logging in...' : 'Login'}
                        </button>

                        {/* Register Link */}
                        <div className="text-center">
                            <span className="text-gray-600">Not a member? </span>
                            <Link
                                href={route('register')}
                                className="text-gray-900 font-semibold hover:underline"
                            >
                                Register now
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
