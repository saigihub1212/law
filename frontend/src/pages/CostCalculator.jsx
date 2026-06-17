import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, HelpCircle, Shield, Award, Cpu, FileText } from 'lucide-react';


const CostCalculator = () => {
  const [activeTab, setActiveTab] = useState('patent');
  
  // Entity type (corporate vs individual/startups get standard government discounts)
  const [entityType, setEntityType] = useState('start-up'); // start-up/individual gets 80% government fee deduction

  // Patent States
  const [patentType, setPatentType] = useState('complete'); // provisional / complete
  const [patentSearch, setPatentSearch] = useState(true);
  const [patentDrafting, setPatentDrafting] = useState(true);
  const [internationalPCT, setInternationalPCT] = useState(false);

  // Trademark States
  const [trademarkClasses, setTrademarkClasses] = useState(1);
  const [trademarkSearch, setTrademarkSearch] = useState(true);
  const [trademarkExpedited, setTrademarkExpedited] = useState(false);

  // Copyright States
  const [copyrightType, setCopyrightType] = useState('software'); // software, literary, artistic
  const [copyrightContracts, setCopyrightContracts] = useState(false);

  // Design States
  const [designDrawings, setDesignDrawings] = useState(true);

  // Cost calculation functions
  const calculatePatentCost = () => {
    let governmentFee = patentType === 'provisional' ? 1600 : 4000;
    if (entityType === 'corporate') governmentFee *= 5; // corporate pays 5x govt fee (standard rule)

    let legalFee = 0;
    if (patentSearch) legalFee += 8000;
    if (patentDrafting) {
      legalFee += patentType === 'provisional' ? 15000 : 35000;
    }
    if (internationalPCT) legalFee += 45000;

    return { govt: governmentFee, legal: legalFee, total: governmentFee + legalFee };
  };

  const calculateTrademarkCost = () => {
    let baseGovtFee = 4500; // Individual/Startup per class
    if (entityType === 'corporate') baseGovtFee = 9000; // Corporate per class

    const governmentFee = baseGovtFee * trademarkClasses;
    
    let legalFee = 0;
    if (trademarkSearch) legalFee += 2500;
    legalFee += (5000 * trademarkClasses); // filing charges
    if (trademarkExpedited) legalFee += 3000;

    return { govt: governmentFee, legal: legalFee, total: governmentFee + legalFee };
  };

  const calculateCopyrightCost = () => {
    let governmentFee = 500; // default artistic / literary
    if (copyrightType === 'software') governmentFee = 500;
    // Goverment fees are standard. Corporate pays the same.
    
    let legalFee = copyrightType === 'software' ? 12000 : 8000;
    if (copyrightContracts) legalFee += 5000;

    return { govt: governmentFee, legal: legalFee, total: governmentFee + legalFee };
  };

  const calculateDesignCost = () => {
    let governmentFee = entityType === 'corporate' ? 4000 : 1000;
    
    let legalFee = 10000; // filing
    if (designDrawings) legalFee += 5000;

    return { govt: governmentFee, legal: legalFee, total: governmentFee + legalFee };
  };

  const getActiveCosts = () => {
    switch (activeTab) {
      case 'patent': return calculatePatentCost();
      case 'trademark': return calculateTrademarkCost();
      case 'copyright': return calculateCopyrightCost();
      case 'design': return calculateDesignCost();
      default: return { govt: 0, legal: 0, total: 0 };
    }
  };

  const formatCurrency = (val) => {
    if (isNaN(val)) val = 0;
    return "₹" + new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(val);
  };

  const costs = getActiveCosts();

  return (
    <div className="font-sans py-12 bg-slate-50 dark:bg-navy-dark min-h-screen dark:text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold">Cost Estimator</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy dark:text-white">IPR Registry Calculator</h1>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">Estimate governmental filing fees and legal professional drafting services charges interactively.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('patent')}
            className={`pb-4 px-6 font-serif font-bold text-lg flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'patent' ? 'border-gold text-gold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield size={18} /> Patents
          </button>
          <button
            onClick={() => setActiveTab('trademark')}
            className={`pb-4 px-6 font-serif font-bold text-lg flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'trademark' ? 'border-gold text-gold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award size={18} /> Trademarks
          </button>
          <button
            onClick={() => setActiveTab('copyright')}
            className={`pb-4 px-6 font-serif font-bold text-lg flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'copyright' ? 'border-gold text-gold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={18} /> Copyrights
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`pb-4 px-6 font-serif font-bold text-lg flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'design' ? 'border-gold text-gold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu size={18} /> Designs
          </button>
        </div>

        {/* Grid panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls col */}
          <div className="lg:col-span-7 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
            
            {/* Entity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Applicant Entity Type (Governs Official Government fees)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEntityType('start-up')}
                  className={`py-2 px-4 rounded text-sm font-semibold border transition-all ${
                    entityType === 'start-up'
                      ? 'bg-navy dark:bg-gold text-white dark:text-navy-dark border-transparent shadow'
                      : 'bg-slate-50 dark:bg-navy border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 hover:border-gold'
                  }`}
                >
                  Startup / Individual / MSME
                </button>
                <button
                  type="button"
                  onClick={() => setEntityType('corporate')}
                  className={`py-2 px-4 rounded text-sm font-semibold border transition-all ${
                    entityType === 'corporate'
                      ? 'bg-navy dark:bg-gold text-white dark:text-navy-dark border-transparent shadow'
                      : 'bg-slate-50 dark:bg-navy border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 hover:border-gold'
                  }`}
                >
                  Large Corporate Entity
                </button>
              </div>
            </div>

            {/* Content per Tab */}
            {activeTab === 'patent' && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Patent Filing Specification</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPatentType('provisional')}
                      className={`py-2 rounded text-xs font-semibold border ${patentType === 'provisional' ? 'bg-navy dark:bg-gold text-white dark:text-navy-dark border-transparent' : 'bg-slate-50 dark:bg-navy border-slate-200 dark:border-slate-700 text-slate-500'}`}
                    >
                      Provisional Draft (Locks priority date)
                    </button>
                    <button
                      onClick={() => setPatentType('complete')}
                      className={`py-2 rounded text-xs font-semibold border ${patentType === 'complete' ? 'bg-navy dark:bg-gold text-white dark:text-navy-dark border-transparent' : 'bg-slate-50 dark:bg-navy border-slate-200 dark:border-slate-700 text-slate-500'}`}
                    >
                      Complete Draft (Formal specification)
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-2.5 text-sm dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={patentSearch}
                      onChange={(e) => setPatentSearch(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-gold focus:ring-0 w-4 h-4"
                    />
                    <span>Include Prior Art clearance search & Landscaping</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-sm dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={patentDrafting}
                      onChange={(e) => setPatentDrafting(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-gold focus:ring-0 w-4 h-4"
                    />
                    <span>Professional attorney drafting & compilation services</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-sm dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={internationalPCT}
                      onChange={(e) => setInternationalPCT(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-gold focus:ring-0 w-4 h-4"
                    />
                    <span>File WIPO / PCT International entry dossier</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'trademark' && (
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    <span>Number of brand classes: {trademarkClasses}</span>
                    <span>Max: 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={trademarkClasses}
                    onChange={(e) => setTrademarkClasses(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-2.5 text-sm dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trademarkSearch}
                      onChange={(e) => setTrademarkSearch(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-gold focus:ring-0 w-4 h-4"
                    />
                    <span>Include Trademark registry compatibility clearance checks</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-sm dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trademarkExpedited}
                      onChange={(e) => setTrademarkExpedited(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-gold focus:ring-0 w-4 h-4"
                    />
                    <span>Expedited examination monitoring filing request</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'copyright' && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Work Classification</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setCopyrightType('software')}
                      className={`py-2 rounded text-xs font-semibold border ${copyrightType === 'software' ? 'bg-navy dark:bg-gold text-white dark:text-navy-dark border-transparent' : 'bg-slate-50 dark:bg-navy border-slate-200 dark:border-slate-700 text-slate-500'}`}
                    >
                      Software / Code
                    </button>
                    <button
                      onClick={() => setCopyrightType('artistic')}
                      className={`py-2 rounded text-xs font-semibold border ${copyrightType === 'artistic' ? 'bg-navy dark:bg-gold text-white dark:text-navy-dark border-transparent' : 'bg-slate-50 dark:bg-navy border-slate-200 dark:border-slate-700 text-slate-500'}`}
                    >
                      Artistic / Logo
                    </button>
                    <button
                      onClick={() => setCopyrightType('literary')}
                      className={`py-2 rounded text-xs font-semibold border ${copyrightType === 'literary' ? 'bg-navy dark:bg-gold text-white dark:text-navy-dark border-transparent' : 'bg-slate-50 dark:bg-navy border-slate-200 dark:border-slate-700 text-slate-500'}`}
                    >
                      Literary / Book
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-2.5 text-sm dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={copyrightContracts}
                      onChange={(e) => setCopyrightContracts(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-gold focus:ring-0 w-4 h-4"
                    />
                    <span>Draft licensing / assignment agreements documentation</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-4 pt-2">
                <div className="space-y-3">
                  <label className="flex items-center gap-2.5 text-sm dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={designDrawings}
                      onChange={(e) => setDesignDrawings(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-gold focus:ring-0 w-4 h-4"
                    />
                    <span>Include 3D wireframe / visual layout illustration generation</span>
                  </label>
                </div>
              </div>
            )}

          </div>

          {/* Results box col */}
          <div className="lg:col-span-5 bg-navy text-white rounded-lg p-6 sm:p-8 space-y-6 shadow-xl border border-gold-dark/40 h-fit">
            <h3 className="text-2xl font-serif font-bold text-center border-b border-slate-700 pb-4">Estimate Breakdown</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>Government Registry Fee</span>
                <span className="font-semibold text-white">{formatCurrency(costs.govt)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Professional drafting & search</span>
                <span className="font-semibold text-white">{formatCurrency(costs.legal)}</span>
              </div>
              <div className="border-t border-slate-700 pt-4 flex justify-between items-center text-lg font-serif">
                <span className="text-gold font-bold">Estimated Total</span>
                <span className="font-bold text-gold text-2xl">{formatCurrency(costs.total)}</span>
              </div>
            </div>

            <div className="bg-navy-accent/50 p-4 border border-slate-800 rounded text-center text-xs text-slate-400 space-y-2">
              <p>Government fees fluctuate according to applicant classification. Startup entities receive 80% subsidies.</p>
              <p className="font-semibold text-gold">NDA Confidentiality protects all pricing reviews.</p>
            </div>

            <div className="pt-2">
              <Link
                to={`/book-consultation?service=${encodeURIComponent(activeTab === 'patent' ? 'Patent Prosecution' : activeTab === 'trademark' ? 'Trademark Portfolio Management' : activeTab === 'copyright' ? 'Copyright Registration' : 'Industrial Design Registration')}`}
                className="w-full py-3 bg-gradient-to-r from-gold-dark to-gold text-navy-dark font-bold rounded shadow text-center block text-sm hover:opacity-90 transition-all transform hover:-translate-y-0.5"
              >
                Submit Estimate & Book Briefing
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CostCalculator;
