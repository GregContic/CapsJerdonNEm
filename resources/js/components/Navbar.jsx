import { Link } from '@inertiajs/react';

export default function Navbar({ auth }) {
    return (
        <header className="bg-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Hrvst Logo" className="w-8 h-8" />
                        <span className="text-xl font-semibold text-gray-900">Hrvst</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-8 text-sm font-medium">
                        <Link href="#" className="text-gray-900 hover:text-gray-600 transition-colors">
                            Farmers
                        </Link>
                        <Link href="/crops" className="text-gray-900 hover:text-gray-600 transition-colors">
                            Crops
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <>
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors rounded-md"
                                >
                                    Log out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-6 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors border border-green-600 rounded-md"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors rounded-md"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
