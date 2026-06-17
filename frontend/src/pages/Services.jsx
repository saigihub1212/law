import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { ShieldCheck, Cpu, Scale, FileText, Award, Globe2, ChevronRight } from 'lucide-react';

const iconMap = {
  ShieldAlert: ShieldCheck,
  Tags: Award,
  FileText: FileText,
  Cpu: Cpu,
  Globe: Globe2,
  Scale: Scale,
};

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    API.get('cms/services/')
      .then((res) => setServices(res.data))
      .catch(() => {});
  }, []);

  const displayServices = services.length > 0 ? services : [
    { name: "Patent Prosecution & Drafting", slug: "patent-services", category: "PATENT", short_desc: "End-to-end patent drafting, filing, and prosecution services with high approval ratios.", icon: "ShieldAlert" },
    { name: "Trademark Portfolio Management", slug: "trademark-services", category: "TRADEMARK", short_desc: "Global brand searches, class allocation, applications, and opposition defense.", icon: "Tags" },
    { name: "Copyright Protection & Registration", slug: "copyright-services", category: "COPYRIGHT", short_desc: "Software code registry, database rights, and artistic ownership legal filings.", icon: "FileText" },
    { name: "Industrial Design Registration", slug: "design-registration", category: "DESIGN", short_desc: "Securing exclusive visual aesthetic structures and unique hardware outlines.", icon: "Cpu" },
    { name: "Geographical Indication Registry", slug: "geographical-indication", category: "GI", short_desc: "Securing community rights for regional products and indigenous goods.", icon: "Globe" },
    { name: "IP Litigation & Enforcement", slug: "litigation-enforcement", category: "LITIGATION", short_desc: "Aggressive legal action, patent litigation, injunctions, and custom clearances.", icon: "Scale" }
  ];

  return (
    <div className="font-sans py-12 bg-slate-50 dark:bg-navy-dark min-h-screen dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold">Legal Capabilities</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy dark:text-white">IP Practice Directory</h1>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">Click through any sector to explore detailed timelines, required disclosures, and corporate registry pricing.</p>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
          {displayServices.map((s) => {
            const Icon = iconMap[s.icon] || ShieldCheck;
            return (
              <div key={s.slug} className="card-premium flex flex-col justify-between space-y-6 hover:-translate-y-1 transform transition-all duration-300">
                <div className="space-y-4">
                  <div className="inline-flex p-3 bg-gold/10 text-gold rounded border border-gold-dark/20">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-navy dark:text-white">{s.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.short_desc}</p>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  <Link to={`/services/${s.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-gold-dark dark:text-gold hover:underline">
                    Explore practice specifics <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Services;
