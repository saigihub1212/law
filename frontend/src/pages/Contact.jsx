import React, { useState } from 'react';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
  const { showToast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  React.useEffect(() => {
    API.get('cms/pages/settings/')
      .then((res) => {
        if (res.data && res.data.content) {
          setSettings(res.data.content);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Directs to consultations bookings endpoint using the message fields
      const res = await API.post('consultations/', {
        name,
        email,
        phone: 'Not Provided',
        date: new Date().toISOString().split('T')[0], // placeholder date
        time: '12:00 PM',
        service: 'General Enquiry',
        message: `[Contact Form - Subject: ${subject}] ${message}`
      });
      if (res.status === 201) {
        showToast('Enquiry message sent successfully!', 'success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to deliver message. Please call our hotline.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans py-12 bg-slate-50 dark:bg-navy-dark min-h-screen dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold">Contact Us</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy dark:text-white">Connect with SR4IPR Partners</h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">Enquire about trademark protection terms or software registries. Our representatives respond within 24 business hours.</p>
        </div>

        {/* Form + Info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-6 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-navy dark:text-white border-b pb-3">Office Contacts</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin size={18} className="text-gold mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-navy dark:text-white">Corporate Headquarters</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{settings?.hq_address || "Level 14, Nariman Point, Mumbai - 400021, India"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin size={18} className="text-gold mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-navy dark:text-white">Liaison Desk</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{settings?.liaison_address || "Canary Wharf, London E14, United Kingdom"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Phone size={18} className="text-gold mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-navy dark:text-white">Direct Hotlines</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{settings?.phone || "+91 22 5543-0980"} (Admin Desk)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Mail size={18} className="text-gold mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-navy dark:text-white">Email Communications</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{settings?.email || "consult@sr4ipr.com"} (IP Enquiries)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-navy text-white rounded-lg p-6 border border-gold-dark/30 shadow-md space-y-3">
              <h4 className="font-serif font-semibold text-gold flex items-center gap-1.5">
                <Clock size={16} /> Operating Hours
              </h4>
              <p className="text-xs text-slate-350 leading-relaxed">
                Monday - Friday: 09:30 AM to 06:30 PM (IST)<br />
                Saturday: By pre-booked strategy session only.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-navy dark:text-white border-b pb-3 mb-6">Send Direct Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Patent search costs query"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Message details</label>
                <textarea
                  required
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline details you wish to discuss..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-gold-dark to-gold text-navy-dark font-bold rounded shadow-md transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Send size={16} /> {loading ? 'Sending message...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
