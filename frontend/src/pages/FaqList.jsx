import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    API.get('cms/faqs/')
      .then((res) => setFaqs(res.data))
      .catch(() => {});
  }, []);

  const displayFaqs = faqs.length > 0 ? faqs : [
    { question: "What is the difference between a Patent, Trademark, and Copyright?", answer: "A patent protects new inventions (e.g. mechanisms, software solutions, chemical compounds). A trademark protects brand identifiers (e.g. logos, brand names, slogans). A copyright protects original creative works of authorship (e.g. source code, books, paintings, music).", category: "General" },
    { question: "How long does a patent application take to be granted?", answer: "The duration varies depending on jurisdictions. For example, in the US (USPTO) or India (IPO), it can take between 2 to 4 years. Utilizing expedited examination schemes (such as for startups) can reduce the timeline to 1 to 2 years.", category: "Patent" },
    { question: "Can software source code be patented?", answer: "Generally, software code itself is protected by copyright. However, if the software solves a technical problem in a novel, non-obvious way and has a concrete utility (e.g. speeding up image processing, enhancing device communication), it may be eligible for a utility patent.", category: "Patent" },
    { question: "What is a Provisional Patent and why should I file it?", answer: "A provisional patent is a lightweight application that establishes an early priority filing date. It gives you 12 months to refine your invention and seek funding before you must file a detailed Complete Specification.", category: "Patent" },
    { question: "What does a trademark clearance search involve?", answer: "A clearance search checks national and international trademark databases to verify that your proposed brand name or logo is not identical or confusingly similar to already registered marks in the same product/service classes.", category: "Trademark" }
  ];

  // Filters
  const categories = ['All', 'General', 'Patent', 'Trademark', 'Copyright'];

  const filteredFaqs = displayFaqs.filter((f) => {
    const matchesSearch = f.question.toLowerCase().includes(search.toLowerCase()) || 
                          f.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || 
                            f.category.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="font-sans py-12 bg-slate-50 dark:bg-navy-dark min-h-screen dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold">Support Center</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy dark:text-white">Frequently Asked Questions</h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">Common questions regarding global patent procedures, brand registrations, and copyright filing terms.</p>
        </div>

        {/* Search & Categories Bar */}
        <div className="space-y-4">
          
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions or keyword replies..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-accent dark:text-white border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:border-gold shadow-sm"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold font-sans border transition-all ${
                  activeCategory === cat
                    ? 'bg-navy text-white dark:bg-gold dark:text-navy-dark border-transparent shadow-sm'
                    : 'bg-white dark:bg-navy-accent border-slate-200 dark:border-slate-800 hover:border-gold text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3 pt-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((f, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800/80 rounded-md overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center hover:bg-slate-50/50 dark:hover:bg-navy/40 transition-colors"
                >
                  <span className="font-serif font-semibold text-navy dark:text-white flex items-center gap-2">
                    <HelpCircle size={16} className="text-gold shrink-0" />
                    {f.question}
                  </span>
                  {openIndex === idx ? (
                    <ChevronUp size={18} className="text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400 shrink-0" />
                  )}
                </button>
                {openIndex === idx && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/60 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {f.answer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded text-slate-400 text-sm">
              No matching FAQs found. Please enter alternative keywords.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FaqList;
