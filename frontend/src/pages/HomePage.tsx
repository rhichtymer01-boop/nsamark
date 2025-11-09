import { Link } from 'react-router-dom';

const heroLinks = [
  { to: '/products', label: 'Explore Products' },
  { to: '/classifieds', label: 'Buy & Sell' },
  { to: '/dashboard/vendor', label: 'Vendor Dashboard' }
];

const HomePage = () => {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-slate-800 md:text-5xl">
        One Marketplace. Multiple Vendors. Endless Possibilities.
      </h1>
      <p className="max-w-2xl text-lg text-slate-600">
        Nsamark unifies cold stores, restaurants, internet vendors, transporters, artisans, and more under one digital roof. Manage your business, subscriptions, and plugins with ease.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {heroLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary/90"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomePage;
