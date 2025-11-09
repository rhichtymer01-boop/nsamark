import { useMutation, useQuery } from '@tanstack/react-query';

import { apiClient } from '../services/apiClient';

const networks = ['MTN', 'AirtelTigo', 'Telecel'];

const InternetVendorsPage = () => {
  const { data, refetch } = useQuery({
    queryKey: ['internet-vendors'],
    queryFn: async () => {
      const response = await apiClient.get('/internet-vendors');
      return response.data.data ?? [];
    }
  });

  const mutation = useMutation({
    mutationFn: async (network: string) => {
      await apiClient.put('/internet-vendors/networks', {
        supportedNetworks: [network]
      });
    },
    onSuccess: () => {
      refetch();
    }
  });

  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white px-4 py-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-800">Internet Vendors</h2>
      <p className="mt-2 text-sm text-slate-500">
        Configure supported networks and manage bulk SMS plugins.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {networks.map((network) => (
          <button
            key={network}
            onClick={() => mutation.mutate(network)}
            className="rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
          >
            {network}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-700">Configured Vendors</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          {data?.map((vendor: any) => (
            <li key={vendor._id} className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2">
              <span className="font-medium">Vendor:</span> {vendor.vendor?.storeName ?? vendor.vendor}
              <div className="mt-1 text-xs text-slate-500">Networks: {vendor.supportedNetworks.join(', ')}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InternetVendorsPage;
