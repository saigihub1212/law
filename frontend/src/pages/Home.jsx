import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { ShieldCheck, Cpu, Scale, FileText, ChevronRight, MessageSquare, PhoneCall, Award, Users, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Mapping icons by string from the backend model
const iconMap = {
  ShieldAlert: ShieldCheck,
  Tags: Award,
  FileText: FileText,
  Cpu: Cpu,
  Globe: Globe2,
  Scale: Scale,
};

const Home = () => {
  const [content, setContent] = useState({
    hero_title: "Enterprise Intellectual Property Protection Globally",
    hero_subtitle: "SR4IPR Partners provides elite, cross-border patent prosecution, strategic trademark portfolio management, and rigorous copyright enforcement for pioneering technology companies.",
    stats_claims_resolved: "1,500+",
    stats_patent_rate: "97.4%",
    stats_active_clients: "350+",
    stats_countries: "45+",
    why_choose_title: "Why Global Innovators Choose SR4IPR",
    why_choose_desc: "We combine advanced technical expertise in engineering and biosciences with elite legal acumen to secure and monetize your most valuable commercial assets.",
  });
  
  const [services, setServices] = useState([]);
  const [team, setTeam] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // 1. Fetch homepage content
    API.get('cms/pages/home/')
      .then((res) => setContent(res.data.content))
      .catch(() => {});

    // 2. Fetch services
    API.get('cms/services/')
      .then((res) => setServices(res.data))
      .catch(() => {});

    // 3. Fetch team members
    API.get('cms/team/')
      .then((res) => setTeam(res.data))
      .catch(() => {});

    // 4. Fetch testimonials
    API.get('cms/testimonials/')
      .then((res) => setTestimonials(res.data.slice(0, 3)))
      .catch(() => {});

    // 5. Fetch recent blogs
    API.get('cms/blogs/')
      .then((res) => setBlogs(res.data.slice(0, 2)))
      .catch(() => {});
  }, []);

  // Set default services fallback if API yields empty array
  const displayServices = services.length > 0 ? services : [
    { name: "Patent Prosecution", slug: "patent-services", short_desc: "Drafting, filing, and prosecution services with high approval ratios.", icon: "ShieldAlert" },
    { name: "Trademark Portfolio", slug: "trademark-services", short_desc: "Global brand searches, class allocation, registrations, and enforcement.", icon: "Tags" },
    { name: "Copyright Protection", slug: "copyright-services", short_desc: "Software code registry, database rights, and creative licensing contracts.", icon: "FileText" },
    { name: "IP Litigation", slug: "litigation-enforcement", short_desc: "Aggressive trial support, injunctions, and custom anti-counterfeiting policing.", icon: "Scale" }
  ];

  return (
    <div className="font-sans dark:text-slate-200 overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-[#071120] bg-cover bg-center overflow-hidden" style={{ backgroundImage: "linear-gradient(rgba(7, 17, 32, 0.93), rgba(7, 17, 32, 0.97))" }}>
        
        {/* Background mesh glow */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 space-y-6"
          >
            <span className="text-gold tracking-[0.25em] text-xs font-bold uppercase block border-l-2 border-gold pl-3">Elite IP Rights Counsel</span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-tight font-bold tracking-tight">
              {content.hero_title}
            </h1>
            
            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
              {content.hero_subtitle}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400 py-2">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-navy-accent/50 border border-slate-700/60 rounded-full">
                <ShieldCheck size={14} className="text-gold" /> Confidential NDA Protected
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-navy-accent/50 border border-slate-700/60 rounded-full">
                <Globe2 size={14} className="text-gold" /> WIPO Certified Filings
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-navy-accent/50 border border-slate-700/60 rounded-full">
                <Award size={14} className="text-gold" /> USPTO Clearance Agents
              </span>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/book-consultation" className="px-6 py-3 bg-gradient-to-r from-gold-dark to-gold text-navy-dark hover:from-gold hover:to-gold-light font-bold rounded shadow-lg transition-all transform hover:-translate-y-0.5">
                Schedule Strategy Session
              </Link>
              <Link to="/patent-checker" className="px-6 py-3 bg-transparent border border-slate-650 hover:border-gold hover:text-gold text-slate-200 rounded font-semibold transition-all">
                Run AI Patent Check
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Client Logos Marquee Section */}
      <section className="bg-white dark:bg-navy py-10 border-b border-slate-150 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mb-6">
            TRUSTED BY EMERGING TECH LEADERS & SCIENTIFIC ENTERPRISES
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-70">
            <div className="flex items-center gap-2 font-serif text-sm font-bold text-slate-600 dark:text-slate-400">
              <Cpu size={18} className="text-gold" />
              <span>Aether ML</span>
            </div>
            <div className="flex items-center gap-2 font-serif text-sm font-bold text-slate-600 dark:text-slate-400">
              <Globe2 size={18} className="text-gold" />
              <span>BioHelix Labs</span>
            </div>
            <div className="flex items-center gap-2 font-serif text-sm font-bold text-slate-600 dark:text-slate-400">
              <Award size={18} className="text-gold" />
              <span>HoloSphere</span>
            </div>
            <div className="flex items-center gap-2 font-serif text-sm font-bold text-slate-600 dark:text-slate-400">
              <ShieldCheck size={18} className="text-gold" />
              <span>QuantumCore</span>
            </div>
            <div className="flex items-center gap-2 font-serif text-sm font-bold text-slate-600 dark:text-slate-400">
              <FileText size={18} className="text-gold" />
              <span>SecurSaaS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Success Metrics Dashboard */}
      <section className="bg-navy border-y border-gold-dark/30 py-8 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="text-3xl lg:text-4xl font-serif font-bold text-gold">{content.stats_claims_resolved}</div>
            <div className="text-xs tracking-wider text-slate-400 font-semibold uppercase mt-1">IP Claims Resolved</div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div className="text-3xl lg:text-4xl font-serif font-bold text-gold">{content.stats_patent_rate}</div>
            <div className="text-xs tracking-wider text-slate-400 font-semibold uppercase mt-1">Patent Allowance Rate</div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="text-3xl lg:text-4xl font-serif font-bold text-gold">{content.stats_active_clients}</div>
            <div className="text-xs tracking-wider text-slate-400 font-semibold uppercase mt-1">Active Tech Clients</div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <div className="text-3xl lg:text-4xl font-serif font-bold text-gold">{content.stats_countries}</div>
            <div className="text-xs tracking-wider text-slate-400 font-semibold uppercase mt-1">Countries Represented</div>
          </motion.div>
        </div>
      </section>

      {/* 4. Services Overview Grid */}
      <section className="py-20 bg-slate-50 dark:bg-navy-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-gold uppercase tracking-[0.2em] font-semibold text-xs">Core Specializations</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy dark:text-white">IPR Protection Practices</h2>
            <p className="text-slate-500 text-sm">We provide tailored intellectual property counsel structured to increase corporate valuation margins.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayServices.map((s, idx) => {
              const ServiceIcon = iconMap[s.icon] || ShieldCheck;
              return (
                <motion.div 
                  key={s.slug} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="card-premium flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="inline-flex p-3 bg-navy-accent/5 dark:bg-navy-light text-navy dark:text-gold rounded border border-slate-200 dark:border-slate-800">
                      <ServiceIcon size={24} />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-navy dark:text-white group-hover:text-gold transition-colors">{s.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.short_desc}</p>
                  </div>
                  <div className="pt-6">
                    <Link to={`/services/${s.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy dark:text-gold hover:underline">
                      Practice Details <ChevronRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Section */}
      <section className="py-20 bg-white dark:bg-navy-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-gold uppercase tracking-widest text-xs font-semibold">Technical Excellence</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy dark:text-white">
              {content.why_choose_title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              {content.why_choose_desc}
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-gold/10 text-gold rounded flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-navy dark:text-white text-sm">PhD-Level Technical Experts</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Drafting led by scientists specializing in computer models, pharmaceuticals, and semiconductors.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-gold/10 text-gold rounded flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-navy dark:text-white text-sm">Cross-Border Execution</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Unified management of national phase files in the United States, Europe, and Asian technology zones.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-[#E5E7EB]">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600"
                alt="Lawyers analyzing patent drafts"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Callout box */}
            <div className="absolute -bottom-6 -left-6 bg-navy text-white p-5 border border-gold rounded shadow-2xl space-y-1">
              <div className="text-2xl font-serif font-semibold text-gold">NDA Protected</div>
              <p className="text-[10px] tracking-wide text-slate-300">Confidential patent evaluation environment</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Selected Case Studies */}
      <section className="py-20 bg-slate-50 dark:bg-navy-dark border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-gold uppercase tracking-[0.2em] font-semibold text-xs">Proven Precedents</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy dark:text-white">Success Case Studies</h2>
            <p className="text-slate-500 text-sm">Real-world outcomes showing how we defend client intellectual assets and increase enterprise threshold valuations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-navy-accent border border-slate-200/60 dark:border-slate-800 rounded-lg p-6 space-y-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <span className="text-[9px] uppercase tracking-wider bg-gold/10 text-gold-dark dark:text-gold px-2.5 py-1 rounded font-bold">Patent Prosecution</span>
                <h4 className="text-xl font-serif font-bold text-navy dark:text-white">NeuraLink Analytics</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Drafted and prosecuted global utility patents protecting core multi-threaded neural network query architectures. Secured grants in both the USPTO and European Patent Office inside 18 months, boosting client acquisition valuation by 140%.
                </p>
              </div>
              <div className="text-xs font-bold text-slate-400 border-t dark:border-slate-800 pt-3">
                Industry: Machine Learning
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white dark:bg-navy-accent border border-slate-200/60 dark:border-slate-800 rounded-lg p-6 space-y-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <span className="text-[9px] uppercase tracking-wider bg-gold/10 text-gold-dark dark:text-gold px-2.5 py-1 rounded font-bold">Trademark Clearance</span>
                <h4 className="text-xl font-serif font-bold text-navy dark:text-white">HoloSphere Robotics</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Managed international brand clearance and filing across 45 countries. Successfully resolved direct trademark opposition battles in multiple Asian markets within 6 months, securing complete global brand monopoly.
                </p>
              </div>
              <div className="text-xs font-bold text-slate-400 border-t dark:border-slate-800 pt-3">
                Industry: Advanced Hardware
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white dark:bg-navy-accent border border-slate-200/60 dark:border-slate-800 rounded-lg p-6 space-y-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <span className="text-[9px] uppercase tracking-wider bg-gold/10 text-gold-dark dark:text-gold px-2.5 py-1 rounded font-bold">Copyright Protection</span>
                <h4 className="text-xl font-serif font-bold text-navy dark:text-white">SecurSaaS Infrastructure</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Structured developer IP assignment models and registered proprietary database schema copyrights. Enforced DMCA copyright takedown mechanisms globally, removing copycat competitors within 48 hours of filing.
                </p>
              </div>
              <div className="text-xs font-bold text-slate-400 border-t dark:border-slate-800 pt-3">
                Industry: Cloud Cybersecurity
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Attorney Showcase Section */}
      <section className="py-20 bg-white dark:bg-navy-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-gold uppercase tracking-[0.2em] font-semibold text-xs">Expert Counsel</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy dark:text-white">Attorney Showcase</h2>
            <p className="text-slate-500 text-sm">Speak directly with registered attorneys possessing both legal and advanced scientific qualifications.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.length > 0 ? (
              team.map((t, idx) => (
                <motion.div 
                  key={t.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-50 dark:bg-navy-accent border border-slate-200/60 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] bg-slate-250 overflow-hidden relative">
                      <img src={t.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 space-y-2">
                      <h4 className="font-serif font-bold text-lg text-navy dark:text-white">{t.name}</h4>
                      <p className="text-xs font-semibold text-gold-dark dark:text-gold uppercase tracking-wider">{t.role}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">{t.bio}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 text-[10px] text-slate-400 border-t dark:border-slate-800 mt-4">
                    <strong>Credentials:</strong> {t.qualifications || "L.L.M., Registered Patent Agent"}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center text-slate-400 py-10 bg-white dark:bg-navy-accent border border-slate-200/60 dark:border-slate-800 rounded-lg text-xs">
                Syncing attorneys directory...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. Testimonials Review Desk */}
      <section className="py-20 bg-slate-50 dark:bg-navy-dark border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-gold uppercase tracking-[0.2em] font-semibold text-xs">Client Validation</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy dark:text-white">Innovator Testimonials</h2>
            <p className="text-slate-500 text-sm">Hear from founders, CTOs, and general counsel who partner with us for corporate asset protection.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((t) => (
                <div key={t.client_name} className="bg-white dark:bg-navy-accent border border-slate-200/60 dark:border-slate-850 p-6 rounded-lg shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <p className="text-slate-600 dark:text-slate-350 italic text-sm leading-relaxed">
                    "{t.feedback}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t dark:border-slate-850">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                      <img src={t.image_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"} alt={t.client_name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-navy dark:text-white">{t.client_name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{t.client_role} at {t.company}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-slate-400 py-10 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                No verified client reviews currently displayed.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9. Recent Blogs & Publications */}
      <section className="py-20 bg-white dark:bg-navy-accent/20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-gold uppercase tracking-[0.2em] font-semibold text-xs">Knowledge Center</span>
              <h2 className="text-3xl font-serif font-bold text-navy dark:text-white">IP Updates & Strategy Briefings</h2>
            </div>
            <Link to="/blog" className="text-sm font-semibold text-navy dark:text-gold flex items-center gap-1 hover:underline">
              Browse All Articles <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {blogs.length > 0 ? (
              blogs.map((b) => (
                <div key={b.slug} className="bg-slate-50 dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-full sm:w-1/3 aspect-[4/3] sm:aspect-square bg-slate-200">
                    <img src={b.image_url || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300"} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[11px] bg-slate-200 dark:bg-navy px-2 py-0.5 rounded text-slate-600 dark:text-gold uppercase font-semibold">{b.category}</span>
                      <h3 className="font-serif font-bold text-navy dark:text-white text-lg line-clamp-2">{b.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-3">{b.summary}</p>
                    </div>
                    <Link to={`/blog/${b.slug}`} className="text-xs font-semibold text-gold-dark dark:text-gold hover:underline flex items-center gap-1">
                      Read Article <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-slate-400 py-10 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg">
                No recent publications loaded.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 10. Action CTA & Consultation Banner */}
      <section className="bg-navy text-white py-16 text-center border-t border-gold relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-navy-accent/50 via-navy-dark/95 to-navy-dark pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">Secure Your Innovation Threshold</h2>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto">
            Book a confidential portfolio evaluation session. Speak with our managing partners to establish a timeline for patent, design, or brand registrations.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link to="/book-consultation" className="btn-gold">
              Schedule Consultation
            </Link>
            <Link to="/calculator" className="btn-navy bg-transparent border-slate-600 hover:bg-navy-accent">
              Estimate Registration Cost
            </Link>
          </div>
          <div className="flex justify-center items-center gap-4 text-xs text-slate-400 pt-4">
            <a href="https://wa.me/912255430980" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-green-400 transition-colors">
              <MessageSquare size={16} /> Chat on WhatsApp
            </a>
            <span>•</span>
            <a href="tel:+912255430980" className="flex items-center gap-1.5 hover:text-gold transition-colors">
              <PhoneCall size={16} /> Direct Hotline
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
