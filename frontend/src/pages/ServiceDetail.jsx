import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';
import { ShieldCheck, Cpu, Scale, FileText, Award, Globe2, ArrowLeft, Mail, Calendar } from 'lucide-react';

const iconMap = {
  ShieldAlert: ShieldCheck,
  Tags: Award,
  FileText: FileText,
  Cpu: Cpu,
  Globe: Globe2,
  Scale: Scale,
};

// Seeding default contents in case DB fails or isn't connected
const defaultServices = {
  "patent-services": {
    name: "Patent Prosecution & Drafting",
    category: "PATENT",
    short_desc: "End-to-end patent drafting, filing, and prosecution services with high approval ratios.",
    long_desc: "Our team drafts detailed specifications for provisional and complete patents. We possess deep technical experts in software, AI, electronics, chemical mixtures, and mechanical structures, ensuring your patent passes rigourous examiner audits.",
    icon: "ShieldAlert",
    details_list: ["Provisional Patent Specifications", "Utility Patent Drafting", "WIPO / PCT International Filing", "Office Action Analysis & Responses", "Patent Landscaping & Prior Art Searches"]
  },
  "trademark-services": {
    name: "Trademark Portfolio Management",
    category: "TRADEMARK",
    short_desc: "Global brand searches, class allocation, applications, and opposition defense.",
    long_desc: "We establish, protect, and police brand assets, product marks, and logos. Our specialists manage brand clearances, address examiner objections, and enforce trademarks against counterfeiters globally.",
    icon: "Tags",
    details_list: ["Comprehensive Clearance Search", "Trademark Class Classification", "Filing & Prosecution Management", "Trademark Monitoring & Enforcement", "Opposition & Rectification Proceedings"]
  },
  "copyright-services": {
    name: "Copyright Protection & Registration",
    category: "COPYRIGHT",
    short_desc: "Software code registry, database rights, and artistic ownership legal filings.",
    long_desc: "We secure registrations for software codebases, proprietary databases, API architectures, literary works, and designs, ensuring solid legal standing for copyright claims.",
    icon: "FileText",
    details_list: ["Software & Codebase Registration", "Database Rights Protection", "Licensing & Assignment Contracts", "Digital Millennium Copyright Act (DMCA) Take-Downs", "Copyright Infringement Remedies"]
  },
  "design-registration": {
    name: "Industrial Design Registration",
    category: "DESIGN",
    short_desc: "Securing exclusive visual aesthetic structures and unique hardware outlines.",
    long_desc: "We file design protection requests to prevent competitors from copying the shape, configuration, ornament, or aesthetic layout of your manufactured hardware products.",
    icon: "Cpu",
    details_list: ["Novelty Assessment & Drawings", "Filing & Class Registrations", "Design Prosecution support", "Infringement Auditing"]
  },
  "geographical-indication": {
    name: "Geographical Indication Registry",
    category: "GI",
    short_desc: "Securing community rights for regional products and indigenous goods.",
    long_desc: "We represent trade boards, state agencies, and agricultural associations in registering geographical source titles to maintain exclusive quality margins.",
    icon: "Globe",
    details_list: ["GI clearance & historical audit", "Association incorporation support", "Enforcement against generic label fraud"]
  },
  "litigation-enforcement": {
    name: "IP Litigation & Enforcement",
    category: "LITIGATION",
    short_desc: "Aggressive legal action, patent litigation, injunctions, and custom clearances.",
    long_desc: "Our veteran trial lawyers represent plaintiffs and defendants in high-stakes patent battles, copyright actions, trade secret thefts, and trademark infringement litigations.",
    icon: "Scale",
    details_list: ["Cease & Desist Orders", "Temporary & Permanent Injunctions", "Patent & Trademark Litigation", "Custom Enforcement & Anti-Counterfeiting", "Trade Secret Protection & Auditing"]
  }
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`cms/services/${slug}/`)
      .then((res) => {
        setService(res.data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback
        if (defaultServices[slug]) {
          setService(defaultServices[slug]);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-dark">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-navy-dark p-6 text-center">
        <h2 className="text-2xl font-serif font-bold text-navy dark:text-white mb-2">Practice Area Not Found</h2>
        <p className="text-slate-500 mb-6">The requested service directory could not be located.</p>
        <Link to="/services" className="px-6 py-2 bg-navy text-white rounded font-semibold flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Services
        </Link>
      </div>
    );
  }

  const Icon = iconMap[service.icon] || ShieldCheck;

  return (
    <div className="font-sans py-12 bg-slate-50 dark:bg-navy-dark min-h-screen dark:text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <Link to="/services" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-gold transition-colors">
          <ArrowLeft size={16} /> Back to Practices
        </Link>

        {/* Hero Area */}
        <div className="bg-navy text-white rounded-lg p-8 border-b border-gold-dark/40 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold">{service.category} SECTOR</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold">{service.name}</h1>
            <p className="text-slate-300 text-sm max-w-2xl">{service.short_desc}</p>
          </div>
          <div className="p-4 bg-navy-accent border border-slate-700 text-gold rounded-full shrink-0">
            <Icon size={36} />
          </div>
        </div>

        {/* Body columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main info */}
          <div className="lg:col-span-8 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-8 space-y-6 shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-navy dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Practice Overview</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
              {service.long_desc || service.short_desc}
            </p>

            <h4 className="text-xl font-serif font-bold text-navy dark:text-white pt-4">Sub-Practice Areas & Offerings</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.details_list.map((point, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0"></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-4 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-6 shadow-sm h-fit">
            <h4 className="text-xl font-serif font-bold text-navy dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Initiate File</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Submit technological disclosures or scheduling requests. All briefs are protected under client-attorney confidentiality.
            </p>
            <div className="space-y-3 pt-2">
              <Link
                to={`/book-consultation?service=${encodeURIComponent(service.name)}`}
                className="w-full py-3 bg-gradient-to-r from-gold-dark to-gold text-navy-dark font-bold rounded shadow text-center block text-sm transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="inline-block mr-1.5" size={16} /> Book Strategy Session
              </Link>
              <Link
                to="/patent-checker"
                className="w-full py-3 border border-slate-300 dark:border-slate-700 hover:border-gold dark:hover:border-gold text-slate-700 dark:text-slate-300 font-semibold rounded text-center block text-sm transition-all"
              >
                Evaluate Patent Eligibility
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ServiceDetail;
