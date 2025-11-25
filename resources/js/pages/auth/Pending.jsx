import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function Pending({ location_warning }) {
    return (
        <GuestLayout>
            <Head title="Pending Approval" />

            <div className="mb-4 text-sm text-gray-600">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Account Pending Approval
                </h2>
                
                <p className="mb-4">
                    Thank you for registering! Your farmer account is currently pending approval from an administrator.
                </p>

                {location_warning && (
                    <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-yellow-800">
                            <strong>Note:</strong> {location_warning}
                        </p>
                    </div>
                )}

                <p className="mb-4">
                    You will receive access to the platform once your account has been reviewed and approved.
                </p>

                <p className="text-sm text-gray-500">
                    If you have any questions, please contact the administrator.
                </p>
            </div>
        </GuestLayout>
    );
}
