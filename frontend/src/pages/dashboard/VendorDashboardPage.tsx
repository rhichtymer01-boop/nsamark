import { useQuery } from '@tanstack/react-query';

import { VendorKYCSection } from '../../components/dashboard/VendorKYCSection';
import { apiClient } from '../../services/apiClient';

const metrics = [
  { key: 'revenue', label: 'Revenue (GHS)' },
  { key: 'walletBalance', label: 'Wallet Balance (GHS)' },
  { key: 'pluginCount', label: 'Active Plugins' },
  { key: 'subscriptionPlan', label: 'Subscription Plan' }
];

const VendorDashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['vendor-dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/vendors/demo-vendor/dashboard');
      return response.data.data ?? {};
    }
  });

  if (isLoading) {
    return <div>Loading vendor dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-slate-800">Vendor Dashboard</h2>
        <p className="text-sm text-slate-500">Monitor your revenue, subscription, and plugin performance.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.key} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{data[metric.key] ?? '—'}</p>
          </div>
        ))}
      </div>
      <VendorKYCSection />
    </div>
  );
};

export default VendorDashboardPage;
