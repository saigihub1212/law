"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, User, LogOut } from 'lucide-react';
import API from '../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const isDark = typeof window !== 'undefined' && localStorage.getItem('dark_mode') === 'true';
    setDark(isDark);
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !dark;
    setDark(nextDark);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dark_mode', String(nextDark));
    }
    if (nextDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      await API.post('auth/logout/', { refresh: refreshToken });
    } catch (e) {
      console.error("Logout failed on server.", e);
    }
    logout();
    router.push('/');
  };

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-500 ${
      scrolled 
        ? 'bg-[#F8F5F0]/90 dark:bg-[#121110]/95 backdrop-blur-md shadow-xs border-b border-[#DDD5C8]/80 dark:border-slate-800/40' 
        : 'bg-transparent border-b border-transparent'
    } text-[#171717] dark:text-[#F8F5F0]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Branding (left aligned) */}
          <div className="w-1/4 flex justify-start flex-shrink-0">
            <Link href="/" className="flex flex-col justify-center group">
              <span className="font-serif text-xl 2xl:text-2xl font-bold tracking-wider gradient-gold whitespace-nowrap transition-transform duration-300 group-hover:scale-[1.01]">SR4IPR Partners</span>
              <span className="text-[8px] tracking-[0.25em] text-[#6D6258] dark:text-[#C9C1B5] font-sans uppercase whitespace-nowrap">Intellectual Property Counsel</span>
            </Link>
          </div>

          {/* Desktop Nav Links (centered) */}
          <div className="hidden xl:flex w-2/4 justify-center items-center xl:space-x-3.5 2xl:space-x-6 text-[10px] 2xl:text-xs font-sans tracking-widest uppercase flex-shrink-0">
            <Link href="/" className={`font-medium link-underline transition-colors whitespace-nowrap ${pathname === '/' ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>Home</Link>
            <Link href="/about" className={`font-medium link-underline transition-colors whitespace-nowrap ${pathname === '/about' ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>About</Link>
            <Link href="/services" className={`font-medium link-underline transition-colors whitespace-nowrap ${pathname.startsWith('/services') ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>Services</Link>
            <Link href="/team" className={`font-medium link-underline transition-colors whitespace-nowrap ${pathname === '/team' ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>Team</Link>
            <Link href="/blog" className={`font-medium link-underline transition-colors whitespace-nowrap ${pathname.startsWith('/blog') ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>Blogs</Link>
            <Link href="/gallery" className={`font-medium link-underline transition-colors whitespace-nowrap ${pathname === '/gallery' ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>Gallery</Link>
            <Link href="/client-success" className={`font-medium link-underline transition-colors whitespace-nowrap ${pathname === '/client-success' ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>Outcomes</Link>
            <Link href="/faqs" className={`font-medium link-underline transition-colors whitespace-nowrap ${pathname === '/faqs' ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>FAQs</Link>
          </div>

          {/* Action Area (right aligned) */}
          <div className="hidden xl:flex w-1/4 justify-end items-center xl:space-x-3 2xl:space-x-5 flex-shrink-0">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-[#EFE8DD] dark:hover:bg-slate-800/60 rounded-full transition-all text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57] flex-shrink-0 cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#171717] dark:bg-[#F8F5F0] text-white dark:text-[#171717] hover:bg-[#8B6B57] dark:hover:bg-[#8B6B57] hover:text-white dark:hover:text-white rounded-full font-sans font-semibold tracking-wider text-[10px] uppercase transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <User size={13} strokeWidth={1.5} /> Portal
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-rose-500 hover:text-rose-700 transition-colors flex-shrink-0 cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3.5">
                <Link
                  href="/book-consultation"
                  className="px-5 py-2 bg-[#171717] dark:bg-[#F8F5F0] text-white dark:text-[#171717] hover:bg-[#8B6B57] dark:hover:bg-[#8B6B57] hover:text-white dark:hover:text-white font-sans text-[10px] font-semibold tracking-widest uppercase rounded-full shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.01] whitespace-nowrap"
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
              className="p-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57] cursor-pointer"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#171717] dark:hover:text-white cursor-pointer"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="xl:hidden bg-[#F8F5F0] dark:bg-[#1C1A19] border-t border-[#DDD5C8] dark:border-slate-850 py-4 px-6 space-y-3 font-sans shadow-lg text-xs uppercase tracking-widest">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">Home</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">About Us</Link>
          <Link href="/services" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">Services</Link>
          <Link href="/team" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">Our Team</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">Blogs</Link>
          <Link href="/gallery" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">Gallery</Link>
          <Link href="/client-success" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">Client Success</Link>
          <Link href="/faqs" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">FAQs</Link>
          <div className="border-t border-[#DDD5C8] dark:border-slate-800 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-[#171717] dark:bg-[#F8F5F0] text-white dark:text-[#171717] rounded-full text-xs font-semibold"
                >
                  <User size={14} /> Portal Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="py-2.5 bg-rose-500/10 text-rose-500 rounded-full text-xs font-semibold cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/book-consultation"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-2.5 bg-[#171717] dark:bg-[#F8F5F0] text-white dark:text-[#171717] rounded-full text-xs font-semibold"
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
