import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { Compass, Eye, Shield, Users } from 'lucide-react';

const About = () => {
  const [content, setContent] = useState({
    company_overview: "SR4IPR Partners is a premier, tier-one international intellectual property firm representing venture-backed startups, research universities, and Fortune 500 corporations. Our team comprises registered patent attorneys, technical PhDs, and litigators who operate at the intersection of emerging technologies and complex statutory law.",
    vision: "To lead the global standard for IP protection by developing hyper-effective patent structures and trademark defense strategies that protect enterprise value in a hyper-competitive digital economy.",
    mission: "To provide rigorous, technical, and commercial-minded counsel that transforms scientific innovations into bulletproof global patent assets.",
    history_timeline: [
      {"year": "2015", "event": "SR4IPR Partners founded by veteran IP litigators in response to cross-border tech infringement rises."},
      {"year": "2018", "event": "Expanded practice to include specialized biochemical and machine-learning patent drafting groups."},
      {"year": "2021", "event": "Opened overseas liaison desks to expedite WIPO and USPTO client portfolio filings."},
      {"year": "2024", "event": "Ranked in top legal indexes for Patent Prosecution & Trademark enforcement success rates."}
    ]
  });

  useEffect(() => {
    API.get('cms/pages/about/')
      .then((res) => setContent(res.data.content))
      .catch(() => {});
  }, []);

  return (
    <div className="font-sans py-12 bg-slate-50 dark:bg-navy-dark min-h-screen dark:text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title Header */}
        <div className="text-center space-y-3">
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold">About SR4IPR Partners</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy dark:text-white">Securing Intellectual Innovation</h1>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">Providing elite statutory counsel and technology auditing to establish defendable corporate parameters.</p>
        </div>

        {/* Firm Overview */}
        <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-sm space-y-6">
          <h2 className="text-2xl font-serif font-bold text-navy dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Users className="text-gold" size={24} /> Firm Overview & Philosophy
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            {content.company_overview}
          </p>
        </div>

        {/* Vision & Mission Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vision card */}
          <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-gold/10 text-gold rounded-full flex items-center justify-center shrink-0">
              <Eye size={20} />
            </div>
            <h3 className="text-xl font-serif font-bold text-navy dark:text-white">Our Vision</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {content.vision}
            </p>
          </div>

          {/* Mission card */}
          <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-gold/10 text-gold rounded-full flex items-center justify-center shrink-0">
              <Compass size={20} />
            </div>
            <h3 className="text-xl font-serif font-bold text-navy dark:text-white">Our Mission</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {content.mission}
            </p>
          </div>
        </div>

        {/* History Timeline */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-navy dark:text-white text-center">Milestones & Firm Evolution</h2>
          <div className="border-l-2 border-slate-300 dark:border-slate-800 ml-4 md:mx-auto max-w-2xl pl-6 space-y-8 relative">
            {content.history_timeline.map((item, idx) => (
              <div key={idx} className="relative space-y-1">
                {/* Timeline node */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-gold rounded-full border-4 border-slate-50 dark:border-navy-dark"></div>
                <div className="text-gold font-serif font-bold text-lg">{item.year}</div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.event}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
