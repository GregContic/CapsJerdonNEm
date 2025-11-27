import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome - Hrvst" />
            <div className="min-h-screen bg-white flex flex-col">
                {/* Header */}
                <Navbar auth={auth} />

                {/* Hero Section with Background Image */}
                <main 
                    className="flex-1 relative bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url(/trading-post-hero.jpg)' }}
                >
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-white/70"></div>
                    
                    {/* Content */}
                    <div className="relative flex items-center justify-center h-full px-4 sm:px-6 lg:px-8 pt-24">
                        <div className="max-w-xl -ml-32">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                                Crop Prices Updates
                            </h1>
                            <h2 className="text-4xl md:text-5xl font-bold text-green-600 mb-5 leading-tight">
                                from Trading Post
                            </h2>
                            <p className="text-gray-800 text-sm mb-1">
                                All information is provided by the Benguet Trading Post
                            </p>
                            <p className="text-gray-800 text-sm">
                                Cooperatives
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-black text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Logo and Copyright */}
                            <div className="col-span-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <img src="/logo.png" alt="Hrvst Logo" className="w-8 h-8" />
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
