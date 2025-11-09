import { useQuery } from '@tanstack/react-query';

import { AdminKYCReviewSection } from '../../components/dashboard/AdminKYCReviewSection';
import { apiClient } from '../../services/apiClient';

const AdminDashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard');
      return response.data.data ?? {};
    }
  });

  if (isLoading) {
    return <div>Loading admin overview...</div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-slate-800">Admin Dashboard</h2>
        <p className="text-sm text-slate-500">Manage vendors, subscriptions, KYC, and system settings.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Vendors</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{data.vendorCount ?? 0}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Active Plans</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{data.subscriptions?.length ?? 0}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Pending KYC</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{data.pendingKYC ?? 0}</p>
        </div>
      </div>
      <AdminKYCReviewSection />
    </div>
  );
};

export default AdminDashboardPage;
