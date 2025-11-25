import { Head, Link } from '@inertiajs/react';
import { Sprout } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome - Hrvst" />
            <div className="min-h-screen bg-white flex flex-col">
                {/* Header */}
                <header className="border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2">
                                <div className="flex items-center">
                                    <Sprout className="w-6 h-6 text-green-600" />
                                    <span className="ml-2 text-xl font-semibold text-gray-900">Hrvst</span>
                                </div>
                            </Link>

                            {/* Navigation */}
                            <nav className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors border border-gray-300 rounded-md"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors rounded-md"
                                        >
                                            Sign up
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Crop Prices Updates{' '}
                            <span className="text-green-600">from Trading Post</span>
                        </h1>
                        <p className="text-gray-600 text-lg mb-8">
                            All information is provided by the Benguet Trading Post Cooperatives
                        </p>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-black text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Logo and Copyright */}
                            <div className="col-span-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sprout className="w-6 h-6 text-green-600" />
                                    <span className="text-xl font-semibold">Hrvst</span>
                                </div>
                                <p className="text-sm text-gray-400">
                                    Copyright © 2025 Hrvst ltd.
                                </p>
                                <p className="text-sm text-gray-400">
                                    All rights reserved
                                </p>
                            </div>

                            {/* Company */}
                            <div>
                                <h3 className="font-semibold mb-4">Company</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Works</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Career</a></li>
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h3 className="font-semibold mb-4">Support</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">Customer Support</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Delivery Details</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                </ul>
                            </div>

                            {/* Stay up to date */}
                            <div>
                                <h3 className="font-semibold mb-4">Stay up to date</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition-colors">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
