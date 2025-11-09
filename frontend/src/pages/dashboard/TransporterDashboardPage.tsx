import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../../services/apiClient';

const TransporterDashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['transporter-orders'],
    queryFn: async () => {
      const response = await apiClient.get('/orders/transporters/demo-transporter');
      return response.data.data ?? [];
    }
  });

  if (isLoading) {
    return <div>Loading transporter orders...</div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-slate-800">Transporter Dashboard</h2>
        <p className="text-sm text-slate-500">Accept delivery tasks and manage trip history.</p>
      </header>
      <div className="space-y-3">
        {data.map((order: any) => (
          <div key={order._id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-700">Order #{order._id}</p>
            <p className="text-xs text-slate-500">Status: {order.status}</p>
            <p className="text-xs text-slate-500">Delivery Fee: GHS {order.deliveryFee}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransporterDashboardPage;
