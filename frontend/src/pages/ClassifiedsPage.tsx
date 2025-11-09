import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../services/apiClient';

const ClassifiedsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['classifieds'],
    queryFn: async () => {
      const response = await apiClient.get('/classifieds');
      return response.data.data ?? [];
    }
  });

  if (isLoading) {
    return <div className="p-8">Loading listings...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Buy & Sell</h2>
          <p className="text-sm text-slate-500">Community listings from artisans, phone shops, transporters, and more.</p>
        </div>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90">
          Post Listing
        </button>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {data?.map((listing: any) => (
          <article key={listing._id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-700">{listing.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{listing.description}</p>
            <p className="mt-4 text-lg font-bold text-primary">GHS {listing.price}</p>
            <p className="mt-2 text-xs text-slate-400">Contact: {listing.contactNumber}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ClassifiedsPage;
