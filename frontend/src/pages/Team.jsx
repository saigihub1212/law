import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { Mail, Award, Clock } from 'lucide-react';

const LinkedinIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const Team = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    API.get('cms/team/')
      .then((res) => setMembers(res.data))
      .catch(() => {});
  }, []);

  const displayMembers = members.length > 0 ? members : [
    {
      name: "Siddharth Rao, Esq.",
      role: "Senior Managing Partner",
      image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300",
      bio: "Siddharth has over 20 years of experience in patent prosecution and technological joint-venture licensing. He regularly advises Fortune 100 technology corporations on global IP strategy.",
      qualifications: "L.L.M (IP Law) - Georgetown University, B.Tech (Computer Science)",
      experience: "22 Years",
      linkedin_url: "https://linkedin.com",
      twitter_url: "https://twitter.com",
      email: "s.rao@sr4ipr.com"
    },
    {
      name: "Dr. Aradhana Sen",
      role: "Head of Biotechnology & Patent Agent",
      image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      bio: "Dr. Sen is a registered patent agent managing pharmaceutical, biochemical, and agricultural gene-patenting applications. She is highly skilled in drafting complex cell cultures.",
      qualifications: "Ph.D in Molecular Biology - Stanford University, Registered Patent Agent",
      experience: "14 Years",
      linkedin_url: "https://linkedin.com",
      twitter_url: "https://twitter.com",
      email: "a.sen@sr4ipr.com"
    },
    {
      name: "Marcus Vance",
      role: "Lead Litigation Counsel",
      image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
      bio: "Marcus oversees our litigation and enforcement group, focusing on patent infringement, trademark oppositions, DMCA takedowns, and licensing disputes.",
      qualifications: "J.D. - Harvard Law School, BS in Mechanical Engineering",
      experience: "16 Years",
      linkedin_url: "https://linkedin.com",
      twitter_url: "https://twitter.com",
      email: "m.vance@sr4ipr.com"
    }
  ];

  return (
    <div className="font-sans py-12 bg-slate-50 dark:bg-navy-dark min-h-screen dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold">Our Specialists</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy dark:text-white">IP Lawyers & Technical Agents</h1>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">Combining PhD-level scientific depth with elite legal training to secure client innovations.</p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
          {displayMembers.map((m) => (
            <div key={m.name} className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm flex flex-col justify-between">
              
              {/* Photo Area */}
              <div className="space-y-4">
                <div className="aspect-[4/3] w-full bg-slate-200">
                  <img
                    src={m.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Info Text */}
                <div className="p-6 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-xl font-serif font-bold text-navy dark:text-white">{m.name}</h3>
                    <p className="text-gold font-semibold text-xs uppercase tracking-wider">{m.role}</p>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {m.bio}
                  </p>
                  
                  {/* Stats list */}
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Award size={14} className="text-gold shrink-0" />
                      <span>{m.qualifications}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gold shrink-0" />
                      <span>{m.experience} experience</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contacts Row */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-navy border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-slate-500">
                {m.email && (
                  <a href={`mailto:${m.email}`} className="text-xs hover:text-gold flex items-center gap-1">
                    <Mail size={14} /> {m.email}
                  </a>
                )}
                <div className="flex gap-2.5">
                  {m.linkedin_url && (
                    <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                      <LinkedinIcon size={16} />
                    </a>
                  )}
                  {m.twitter_url && (
                    <a href={m.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                      <TwitterIcon size={16} />
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Team;
