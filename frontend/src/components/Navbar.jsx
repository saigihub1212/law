import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('dark_mode') === 'true';
    setDark(isDark);
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !dark;
    setDark(nextDark);
    localStorage.setItem('dark_mode', String(nextDark));
    if (nextDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const services = [
    { name: 'Patent Prosecution', path: '/services/patent-services' },
    { name: 'Trademark Portfolio', path: '/services/trademark-services' },
    { name: 'Copyright Registration', path: '/services/copyright-services' },
    { name: 'Design Registration', path: '/services/design-registration' },
    { name: 'Geographical Indication (GI)', path: '/services/geographical-indication' },
    { name: 'IP Litigation', path: '/services/litigation-enforcement' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-navy text-white border-b border-gold-dark/40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center gap-4">
          {/* Logo Branding */}
          <Link to="/" className="flex flex-col justify-center flex-shrink-0">
            <span className="font-serif text-2xl font-bold tracking-wider gradient-gold whitespace-nowrap">SR4IPR Partners</span>
            <span className="text-[10px] tracking-[0.25em] text-slate-300 font-sans uppercase whitespace-nowrap">Intellectual Property Counsel</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center xl:space-x-3 2xl:space-x-5 text-sm flex-shrink-0">
            <Link to="/" className={`font-medium hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/' ? 'text-gold' : 'text-slate-200'}`}>Home</Link>
            <Link to="/about" className={`font-medium hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/about' ? 'text-gold' : 'text-slate-200'}`}>About Us</Link>
            
            {/* Services Dropdown */}
            <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)}
                className="flex items-center gap-1 font-medium hover:text-gold transition-colors text-slate-200 whitespace-nowrap"
              >
                Services <ChevronDown size={14} />
              </button>
              {dropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-64 bg-navy-accent border border-slate-700 rounded-md shadow-2xl py-2 z-50 text-slate-200"
                >
                  {services.map((s) => (
                    <Link
                      key={s.path}
                      to={s.path}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-navy hover:text-gold transition-colors text-sm"
                    >
                      {s.name}
                    </Link>
                  ))}
                  <div className="border-t border-slate-700 my-1"></div>
                  <Link
                    to="/services"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-navy hover:text-gold font-semibold transition-colors text-sm"
                  >
                    View All Services
                  </Link>
                </div>
              )}
            </div>

            <Link to="/team" className={`font-medium hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/team' ? 'text-gold' : 'text-slate-200'}`}>Our Team</Link>
            <Link to="/blog" className={`font-medium hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/blog' ? 'text-gold' : 'text-slate-200'}`}>Knowledge Center</Link>
            <Link to="/faqs" className={`font-medium hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/faqs' ? 'text-gold' : 'text-slate-200'}`}>FAQs</Link>
            <Link to="/calculator" className={`font-medium hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/calculator' ? 'text-gold' : 'text-slate-200'}`}>Cost Estimator</Link>
            <Link to="/patent-checker" className={`font-medium hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/patent-checker' ? 'text-gold' : 'text-slate-200'}`}>AI Patent Checker</Link>
          </div>

          {/* Action Area (Theme, Login, Mobile Toggle) */}
          <div className="hidden xl:flex items-center xl:space-x-3 2xl:space-x-4 flex-shrink-0">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-navy-accent rounded-full transition-colors text-slate-300 hover:text-gold flex-shrink-0"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={user.role === 'CLIENT' ? '/client' : '/admin'}
                  className="flex items-center gap-1.5 px-4 py-2 bg-navy-accent hover:bg-navy border border-gold-dark hover:border-gold rounded font-medium text-sm transition-colors text-slate-100 whitespace-nowrap"
                >
                  <User size={16} /> Portal Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-rose-400 hover:text-rose-600 transition-colors flex-shrink-0"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-slate-600 hover:border-gold rounded text-sm font-medium transition-colors text-slate-100 whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to="/book-consultation"
                  className="px-4 py-2 bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-light text-navy-dark font-semibold rounded text-sm shadow-md transition-all duration-300 whitespace-nowrap"
                >
                  Book Consultation
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="flex xl:hidden items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-300 hover:text-gold"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-slate-200 hover:text-white"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="xl:hidden bg-navy-accent border-t border-slate-700 py-4 px-6 space-y-3 font-sans">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-200 hover:text-gold">Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-200 hover:text-gold">About Us</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-200 hover:text-gold">Services</Link>
          <Link to="/team" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-200 hover:text-gold">Our Team</Link>
          <Link to="/blog" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-200 hover:text-gold">Knowledge Center</Link>
          <Link to="/faqs" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-200 hover:text-gold">FAQs</Link>
          <Link to="/calculator" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-200 hover:text-gold">Cost Estimator</Link>
          <Link to="/patent-checker" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-200 hover:text-gold">AI Patent Checker</Link>
          <div className="border-t border-slate-700 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={user.role === 'CLIENT' ? '/client' : '/admin'}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-navy border border-gold rounded text-sm font-semibold"
                >
                  <User size={16} /> Portal Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="py-2 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 rounded text-sm font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-2.5 border border-slate-600 rounded text-sm font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/book-consultation"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-2.5 bg-gradient-to-r from-gold-dark to-gold text-navy-dark font-bold rounded text-sm"
                >
                  Book Consultation
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
