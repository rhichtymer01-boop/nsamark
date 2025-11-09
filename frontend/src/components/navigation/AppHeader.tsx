import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/classifieds', label: 'Buy & Sell' },
  { to: '/internet-vendors', label: 'Internet Vendors' },
  { to: '/dashboard', label: 'Dashboards' }
];

export const AppHeader = () => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <NavLink to="/" className="text-xl font-semibold text-primary">
          Nsamark
        </NavLink>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition hover:text-primary ${isActive ? 'text-primary' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary shadow-sm transition hover:bg-primary hover:text-white">
          Login
        </button>
      </div>
    </header>
  );
};
