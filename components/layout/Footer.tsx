const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-6 flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white">
                <span className="material-icons text-xs">code</span>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                ExplainMyCode
              </span>
            </div>
            <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
              The world's most advanced AI code explanation engine for the next generation of software engineers.
            </p>
            <div className="flex space-x-4 text-slate-400">
              <a className="hover:text-primary transition-colors" href="#">
                <span className="material-icons">public</span>
              </a>
              <a className="hover:text-primary transition-colors" href="#">
                <span className="material-icons">terminal</span>
              </a>
              <a className="hover:text-primary transition-colors" href="#">
                <span className="material-icons">alternate_email</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              Product
            </h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-primary" href="#">Features</a></li>
              <li><a className="hover:text-primary" href="#">Extensions</a></li>
              <li><a className="hover:text-primary" href="#">Pricing</a></li>
              <li><a className="hover:text-primary" href="#">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              Company
            </h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-primary" href="#">About</a></li>
              <li><a className="hover:text-primary" href="#">Blog</a></li>
              <li><a className="hover:text-primary" href="#">Careers</a></li>
              <li><a className="hover:text-primary" href="#">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              Legal
            </h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-primary" href="#">Terms</a></li>
              <li><a className="hover:text-primary" href="#">Cookies</a></li>
              <li><a className="hover:text-primary" href="#">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-8 text-xs text-slate-500">
          <p>© 2026 ExplainMyCode AI. All rights reserved.</p>
          <p className="mt-4 md:mt-0 text-slate-500">Built with passion for the developer community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
