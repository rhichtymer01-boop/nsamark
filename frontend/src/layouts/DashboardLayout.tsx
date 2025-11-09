import { NavLink, Outlet } from 'react-router-dom';

const dashboardLinks = [
  { to: 'vendor', label: 'Vendor Dashboard' },
  { to: 'transporter', label: 'Transporter Dashboard' },
  { to: 'admin', label: 'Admin Dashboard' }
];

export const DashboardLayout = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8">
      <aside className="w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700">Dashboards</h2>
        <nav className="mt-4 flex flex-col gap-2">
          {dashboardLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition hover:bg-primary/10 ${
                  isActive ? 'bg-primary text-white hover:bg-primary/90' : 'text-slate-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="flex-1 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Outlet />
      </section>
    </div>
  );
};
