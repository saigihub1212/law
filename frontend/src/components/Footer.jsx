import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';
import API from '../utils/api';

const LinkedinIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const TwitterIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const FacebookIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    API.get('cms/pages/settings/')
      .then((res) => {
        if (res.data && res.data.content) {
          setSettings(res.data.content);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-navy-dark text-slate-300 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wider text-white">SR4IPR Partners</span>
              <span className="text-[9px] tracking-[0.25em] text-gold uppercase">Intellectual Property Counsel</span>
            </div>
            <p className="text-sm text-slate-400">
              Elite counsel securing patents, trademarks, and copyright assets for technology leaders across 45+ countries.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield size={14} className="text-gold" /> WIPO & USPTO Registered Practitioners
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-white font-semibold text-lg tracking-wide">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-gold transition-colors">Our History</Link></li>
              <li><Link to="/team" className="hover:text-gold transition-colors">IP Lawyers</Link></li>
              <li><Link to="/blog" className="hover:text-gold transition-colors">Knowledge Center</Link></li>
              <li><Link to="/calculator" className="hover:text-gold transition-colors">Cost Estimator</Link></li>
              <li><Link to="/patent-checker" className="hover:text-gold transition-colors">Patent Checker</Link></li>
            </ul>
          </div>

          {/* IPR Areas */}
          <div className="space-y-3">
            <h4 className="font-serif text-white font-semibold text-lg tracking-wide">Practice Areas</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services/patent-services" className="hover:text-gold transition-colors">Patent Prosecution</Link></li>
              <li><Link to="/services/trademark-services" className="hover:text-gold transition-colors">Trademarks clearance</Link></li>
              <li><Link to="/services/copyright-services" className="hover:text-gold transition-colors">Software Registration</Link></li>
              <li><Link to="/services/design-registration" className="hover:text-gold transition-colors">Industrial Designs</Link></li>
              <li><Link to="/services/litigation-enforcement" className="hover:text-gold transition-colors">IP Litigation</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-sm">
            <h4 className="font-serif text-white font-semibold text-lg tracking-wide">Corporate Offices</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-gold mt-1 shrink-0" />
                <span>
                  <strong>HQ:</strong> {settings?.hq_address || "Level 14, Nariman Point, Mumbai - 400021, India"}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-gold mt-1 shrink-0" />
                <span>
                  <strong>Liaison Desk:</strong> {settings?.liaison_address || "Canary Wharf, London E14, UK"}
                </span>
              </div>
              <div className="flex items-center gap-2.5 pt-2">
                <Phone size={16} className="text-gold shrink-0" />
                <span>{settings?.phone || "+91 22 5543-0980"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-gold shrink-0" />
                <span>{settings?.email || "consult@sr4ipr.com"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>&copy; {currentYear} {settings?.copyright || "SR4IPR Partners. All Rights Reserved."}</p>
          <div className="flex items-center gap-4">
            <Link to="/faqs" className="hover:text-gold">Disclaimer & Cookie Policy</Link>
            <span>|</span>
            <div className="flex items-center gap-3">
              {settings?.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-gold text-slate-400">
                  <LinkedinIcon size={14} />
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-gold text-slate-400">
                  <TwitterIcon size={14} />
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-gold text-slate-400">
                  <FacebookIcon size={14} />
                </a>
              )}
            </div>
            <span>|</span>
            <span className="text-slate-600">Enterprise Edition v2.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
