import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { Search, Calendar, ChevronRight, BookOpen } from 'lucide-react';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    API.get('cms/blogs/')
      .then((res) => setBlogs(res.data))
      .catch(() => {});
  }, []);

  const displayBlogs = blogs.length > 0 ? blogs : [
    {
      title: "Navigating the Patent Cooperation Treaty (PCT) for Global Scale",
      slug: "navigating-pct-global-patent",
      summary: "Expanding into international markets requires a strategic approach to patent protection. Learn how the PCT provides a unified procedure for filing patent applications to protect your inventions globally.",
      category: "Patents",
      image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
      published_at: "2026-06-12T10:00:00Z"
    }
  ];

  const categories = ['All', 'Patents', 'Trademarks', 'Copyrights', 'IPR Updates'];

  const filteredBlogs = displayBlogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || b.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent Post';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="font-sans py-12 bg-slate-50 dark:bg-navy-dark min-h-screen dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold">Knowledge Center</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy dark:text-white">IP Strategy & Law Briefings</h1>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">Expert commentary and regular legal updates compiled by our patent agents and trial attorneys.</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search strategy publications..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-accent dark:text-white border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:border-gold shadow-sm"
            />
          </div>
          <div className="md:col-span-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-3 px-4 bg-white dark:bg-navy-accent dark:text-white border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:border-gold shadow-sm text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'Filter by Category' : c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((b) => (
              <article key={b.slug} className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-lg transition-all">
                <div className="space-y-4">
                  <div className="aspect-[16/9] w-full bg-slate-200">
                    <img src={b.image_url || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600"} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="bg-gold/10 text-gold-dark dark:text-gold px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
                        {b.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(b.published_at)}
                      </span>
                    </div>
                    <h2 className="text-xl font-serif font-bold text-navy dark:text-white line-clamp-2 hover:text-gold transition-colors">
                      <Link to={`/blog/${b.slug}`}>{b.title}</Link>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {b.summary}
                    </p>
                  </div>
                </div>
                
                <div className="px-6 pb-6 pt-2">
                  <Link to={`/blog/${b.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-gold-dark dark:text-gold hover:underline">
                    Read strategic overview <ChevronRight size={14} />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded text-slate-400 text-sm">
              No matching briefings found. Try refining search parameters.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BlogList;
