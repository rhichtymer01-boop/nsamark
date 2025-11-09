export const AppFooter = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-sm text-slate-500 md:flex-row">
        <span>© {new Date().getFullYear()} Nsamark Marketplace</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary">
            Terms
          </a>
          <a href="#" className="hover:text-primary">
            Privacy
          </a>
          <a href="#" className="hover:text-primary">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};
