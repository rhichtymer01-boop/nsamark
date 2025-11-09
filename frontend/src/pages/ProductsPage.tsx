import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../services/apiClient';

const ProductsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.get('/products');
      return response.data.data ?? [];
    }
  });

  if (isLoading) {
    return <div className="p-8">Loading products...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-2xl font-semibold text-slate-800">Marketplace Products</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((product: any) => (
          <article key={product._id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-700">{product.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{product.description}</p>
            <p className="mt-4 text-lg font-bold text-primary">GHS {product.price}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
