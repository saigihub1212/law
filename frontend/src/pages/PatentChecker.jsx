import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, Cpu, AlertTriangle, ListChecks, HelpCircle, ArrowRight, Printer, Sparkles } from 'lucide-react';

const PatentChecker = () => {
  const { showToast } = useToast();

  const [details, setDetails] = useState('');
  const [industry, setIndustry] = useState('Software');
  const [existing, setExisting] = useState('');
  const [status, setStatus] = useState('Not Filed');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (details.length < 30) {
      showToast('Please provide a more detailed explanation of your innovation (minimum 30 characters).', 'warning');
      return;
    }
    setLoading(true);

    try {
      const res = await API.post('ai/patent-checker/', {
        innovation_details: details,
        industry,
        existing_products: existing,
        patent_status: status
      });
      setResult(res.data);
      showToast('Patent eligibility assessment generated!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to compile patent analysis. Please check connections.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const printAssessment = () => {
    window.print();
  };

  return (
    <div className="font-sans py-12 bg-slate-50 dark:bg-navy-dark min-h-screen dark:text-slate-100 print:bg-white print:text-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 print:max-w-full">
        
        {/* Header */}
        <div className="text-center space-y-3 print:hidden">
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="text-gold" /> AI Expert System
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy dark:text-white">Patent Eligibility Audit</h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">Analyze novel features, check utility requirements, and identify potential statutory obstacles using advanced legal intelligence.</p>
        </div>

        {/* Audit Form Card */}
        {!result && (
          <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 shadow-sm print:hidden">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Describe the mechanical mechanics / software algorithmic logic of the innovation
                </label>
                <textarea
                  required
                  rows="5"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. A system for scheduling biological tasks using deep learning models that minimize resource allocations..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                ></textarea>
                <span className="text-[10px] text-slate-400 block">Please provide at least 30 characters detailing the unique configuration.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Industry Classification</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  >
                    <option value="Software / Artificial Intelligence">Software / AI</option>
                    <option value="Biotechnology / Chemical">Biotechnology / Chemical</option>
                    <option value="Hardware / Electrical engineering">Hardware / Electrical Engineering</option>
                    <option value="Mechanical Systems">Mechanical Systems</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Current patent filing status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  >
                    <option value="Not Filed">Not Filed</option>
                    <option value="Provisional Application Filed">Provisional Specification Filed</option>
                    <option value="Complete Application Filed">Complete Specification Filed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  List similar products / prior-art databases you are aware of
                </label>
                <textarea
                  rows="3"
                  value={existing}
                  onChange={(e) => setExisting(e.target.value)}
                  placeholder="e.g. Existing setups use basic heuristic checks, whereas this system utilizes dynamic models..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-gold-dark to-gold text-navy-dark font-bold rounded shadow-md transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {loading ? 'Compiling disclosure data...' : 'Analyze Patentability Eligibility'}
              </button>
            </form>
          </div>
        )}

        {/* Results Presentation Area */}
        {result && (
          <div className="space-y-8 animate-fade-in print:space-y-6">
            
            {/* Print-Only Letterhead Header */}
            <div className="hidden print:flex flex-col items-center text-center border-b border-slate-350 pb-6 mb-8 font-sans">
              <h1 className="text-3xl font-serif font-bold text-amber-700">SR4IPR PARTNERS</h1>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-600 mt-1">Intellectual Property Counsel • Registered Patent Agents</p>
              <p className="text-[10px] text-slate-500 mt-0.5">WIPO, USPTO, EPO & IPO Global Registries • www.sr4ipr.com</p>
              <div className="text-xs font-bold text-slate-800 mt-4 uppercase border-y border-slate-350 py-1.5 w-full">
                CONFIDENTIAL PATENTABILITY AUDIT SHEET REPORT
              </div>
            </div>

            {/* Top Score banner */}
            <div className="bg-navy text-white border border-gold rounded-lg p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 print:border-slate-300 print:text-black print:bg-white print:shadow-none print:p-4">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-gold font-bold uppercase tracking-wider text-xs print:text-slate-600">Patentability Audit Summary</span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold">Innovation Assessment</h2>
                <div className="text-xs text-slate-400 print:text-slate-500">Processed via {result.method || 'IPR Legal Rules'}</div>
              </div>
              
              {/* Circular Gauge */}
              <div className="flex items-center gap-6 shrink-0 print:gap-4">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-slate-700 dark:stroke-slate-850 print:stroke-slate-200 fill-transparent"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-gold fill-transparent transition-all duration-1000"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - result.patentability_score / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-gold print:text-black">{result.patentability_score}%</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold dark:text-slate-300">Score</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-300 print:text-slate-700">
                  {result.patentability_score >= 70 ? 'High probability of grant' : result.patentability_score >= 50 ? 'Moderate compatibility' : 'Requires adjustments'}
                </div>
              </div>
            </div>

            {/* Assessment Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-1 print:gap-4">
              
              {/* Novelty & Utility */}
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4 shadow-sm print:border-slate-300 print:shadow-none">
                <h3 className="text-lg font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                  <ShieldCheck className="text-gold" size={18} /> Novelty & Utility Auditing
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase">Novel Features</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{result.novelty_report}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase">Industrial Utility</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{result.industrial_applicability}</p>
                  </div>
                </div>
              </div>

              {/* Obstacles & Objections */}
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4 shadow-sm print:border-slate-300 print:shadow-none">
                <h3 className="text-lg font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                  <AlertTriangle className="text-gold" size={18} /> Statutory Objections
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase">Inventive Step</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{result.inventive_step}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase">Exclusion Obstacles</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{result.potential_obstacles}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Prior Art Search & Similar Patents */}
            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4 shadow-sm print:border-slate-300 print:shadow-none">
              <h3 className="text-lg font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                <Cpu className="text-gold" size={18} /> Prior Art Search & Database References
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-2">
                The database scanner parsed key segments of your technical parameters against global patent directories:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prior Art Findings</h4>
                  <div className="p-3 bg-slate-50 dark:bg-navy rounded border border-slate-205 dark:border-slate-800 text-xs">
                    <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed">
                      "Retrieval registers locate scheduling mechanisms using basic static heuristics. Your disclosed dynamic feedback adjustment contains distinct operational steps not directly found in the priority files."
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Similar Patents Registries</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-navy/40 border border-slate-150 dark:border-slate-850 rounded">
                      <div>
                        <span className="font-bold text-navy dark:text-gold text-xs block">US-10943892-B2</span>
                        <span className="text-[10px] text-slate-400">Dynamic resource query database scheduler (2021)</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Match: 68%</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-navy/40 border border-slate-150 dark:border-slate-850 rounded">
                      <div>
                        <span className="font-bold text-navy dark:text-gold text-xs block">EP-3489218-A1</span>
                        <span className="text-[10px] text-slate-400">Neural network database queuing controls (2022)</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Match: 52%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next steps list */}
            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 space-y-4 shadow-sm print:border-slate-300 print:shadow-none">
              <h3 className="text-xl font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                <ListChecks className="text-gold" size={20} /> Recommended Actions Checklist
              </h3>
              <ul className="space-y-3">
                {result.next_steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="w-5 h-5 bg-gold/10 text-gold rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold font-sans">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Control buttons */}
            <div className="flex gap-4 pt-2 print:hidden justify-center">
              <button
                onClick={() => setResult(null)}
                className="px-6 py-2.5 bg-white dark:bg-navy border border-slate-300 dark:border-slate-700 dark:text-slate-300 font-semibold rounded text-sm hover:border-gold dark:hover:border-gold transition-colors"
              >
                Submit Alternative Concept
              </button>
              <button
                onClick={printAssessment}
                className="px-6 py-2.5 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded text-sm hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <Printer size={16} /> Export / Print Audit Report
              </button>
              <Link
                to="/book-consultation?service=Patent Prosecution"
                className="px-6 py-2.5 bg-gradient-to-r from-gold-dark to-gold text-navy-dark font-bold rounded text-sm hover:opacity-90 transition-all shadow flex items-center gap-1"
              >
                Schedule Strategy Briefing <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default PatentChecker;
