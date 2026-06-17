import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';

const defaultBlogs = {
  "navigating-pct-global-patent": {
    title: "Navigating the Patent Cooperation Treaty (PCT) for Global Scale",
    summary: "Expanding into international markets requires a strategic approach to patent protection. Learn how the PCT provides a unified procedure for filing patent applications to protect your inventions globally.",
    content: `
Filing patent applications in individual foreign countries can be an administrative and financial nightmare for startups. The Patent Cooperation Treaty (PCT) offers a streamlined solution.

### What is the PCT?
The PCT is an international treaty with more than 150 contracting states. It is administered by WIPO (World Intellectual Property Organization). By filing a single 'international' patent application under the PCT, you can simultaneously seek protection for an invention in a vast number of countries.

### Key Advantages:
1. **Time and Flexibility:** You get up to 30 months from your initial filing date to decide which specific countries you wish to proceed in. This gives you extra time to secure seed funding or assess product-market fit.
2. **Unified Search Report:** You receive an International Search Report (ISR) containing prior-art citations. This allows you to evaluate your patent's chances of success before spending thousands in regional filing fees.
3. **Simplified Process:** One application, filed in one language, with one set of formal requirements.

### Best Practices for Technology Startups:
- Always file a **Provisional Application** first to lock in your priority date cheap.
- Use the **WIPO search report** to modify claims and delete uninventive parameters before entering national phases.
- Budget for national phase translation fees and local foreign attorneys ahead of the 30-month deadline.
    `,
    category: "Patents",
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    published_at: "2026-06-12T10:00:00Z"
  }
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`cms/blogs/${slug}/`)
      .then((res) => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch(() => {
        if (defaultBlogs[slug]) {
          setBlog(defaultBlogs[slug]);
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

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-navy-dark p-6 text-center">
        <h2 className="text-2xl font-serif font-bold text-navy dark:text-white mb-2">Briefing Not Found</h2>
        <p className="text-slate-500 mb-6">The requested publication could not be loaded.</p>
        <Link to="/blog" className="px-6 py-2 bg-navy text-white rounded font-semibold flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Knowledge Center
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent Post';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="font-sans py-12 bg-slate-50 dark:bg-navy-dark min-h-screen dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back navigation */}
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-gold transition-colors">
          <ArrowLeft size={16} /> Back to Knowledge Center
        </Link>

        {/* Feature Image */}
        <div className="aspect-[21/9] w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
          <img
            src={blog.image_url || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="bg-gold/10 text-gold-dark dark:text-gold px-3 py-1 rounded-md font-bold uppercase tracking-wider">
              {blog.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(blog.published_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} /> SR4IPR Partners Editorial
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-navy dark:text-white leading-tight">
            {blog.title}
          </h1>

          <p className="text-slate-500 dark:text-slate-400 font-sans italic text-sm border-l-4 border-gold pl-4 py-1 leading-relaxed">
            {blog.summary}
          </p>
        </div>

        {/* Main Post Body */}
        <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-sm">
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-350 text-sm leading-relaxed whitespace-pre-wrap space-y-4 font-sans">
            {blog.content}
          </div>
        </div>

        {/* Disclaimer footer inside reader */}
        <div className="text-xs text-slate-400 dark:text-slate-500 italic bg-slate-100 dark:bg-navy p-4 rounded border border-slate-200 dark:border-slate-850">
          Disclaimer: This strategic briefing is compiled for educational references only. Individual patent descriptions or mechanical drawings require specific prior art assessment. Standard consultation is recommended prior to filing applications.
        </div>

      </div>
    </div>
  );
};

export default BlogDetail;
