import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import { Calendar, Clock, CheckCircle, ShieldAlert, Award, FileText } from 'lucide-react';

const BookConsultation = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const timeSlots = [
    '09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const services = [
    'Patent Prosecution',
    'Trademark Portfolio Management',
    'Copyright Registration',
    'Industrial Design Registration',
    'Geographical Indication Registry',
    'IP Litigation & Enforcement'
  ];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:30 AM');
  const [service, setService] = useState('Patent Prosecution');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    // Generate dates for the next 10 days (excluding Sundays)
    const dates = [];
    let current = new Date();
    current.setDate(current.getDate() + 1); // Start tomorrow
    for (let i = 0; i < 12; i++) {
      if (current.getDay() !== 0) { // Exclude Sundays
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    setAvailableDates(dates);
    if (dates.length > 0) {
      const yyyy = dates[0].getFullYear();
      const mm = String(dates[0].getMonth() + 1).padStart(2, '0');
      const dd = String(dates[0].getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);
    }
  }, []);

  useEffect(() => {
    if (date) {
      API.get(`consultations/?date=${date}`)
        .then((res) => {
          const booked = res.data
            .filter(c => c.status !== 'CLOSED')
            .map(c => c.time);
          setBookedSlots(booked);
          
          // Select first available slot
          const nextSlot = timeSlots.find(slot => !booked.includes(slot));
          if (nextSlot) {
            setTime(nextSlot);
          }
        })
        .catch(() => {});
    }
  }, [date]);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setService(serviceParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('consultations/', {
        name,
        email,
        phone,
        date,
        time,
        service,
        message
      });
      if (res.status === 201) {
        showToast('Consultation request submitted successfully!', 'success');
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.detail || 'Failed to submit request. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 dark:bg-navy-dark px-4 font-sans">
        <div className="max-w-md w-full bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-2xl text-center space-y-6">
          <div className="inline-flex p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-navy dark:text-white">Request Received</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Thank you, <strong>{name}</strong>. Your appointment request for <strong>{service}</strong> has been logged in our queue.
          </p>
          
          <div className="bg-slate-50 dark:bg-navy p-4 rounded text-left text-xs space-y-2 border border-slate-100 dark:border-slate-850 dark:text-slate-350">
            <div><strong>Requested Date:</strong> {date}</div>
            <div><strong>Requested Time Slot:</strong> {time}</div>
            <div><strong>Target Practice Area:</strong> {service}</div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/80">
              An confirmation mail has been printed to the console/mailbox. An attorney will verify and send the meeting link (Zoom/Google Meet).
            </div>
          </div>
          
          <button
            onClick={() => setSubmitted(false)}
            className="w-full py-2.5 border border-slate-300 dark:border-slate-700 dark:text-slate-350 rounded text-sm hover:border-gold dark:hover:border-gold transition-colors font-semibold"
          >
            Schedule Another Strategy Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans py-12 bg-slate-50 dark:bg-navy-dark min-h-screen dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold">Schedule Strategy Session</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy dark:text-white">Confidential IPR Evaluation</h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">Book a 30-minute introductory meeting with our managing attorneys. All details submitted are strictly protected under confidentiality protocols.</p>
        </div>

        {/* Layout Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Booking Form */}
          <div className="lg:col-span-8 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 shadow-sm">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 012-3456"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">IPR Practice Area</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  >
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide block">Preferred Date</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {availableDates.map((d) => {
                      const yyyy = d.getFullYear();
                      const mm = String(d.getMonth() + 1).padStart(2, '0');
                      const dd = String(d.getDate()).padStart(2, '0');
                      const dateVal = `${yyyy}-${mm}-${dd}`;
                      
                      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNum = d.getDate();
                      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
                      const isSelected = date === dateVal;

                      return (
                        <button
                          key={dateVal}
                          type="button"
                          onClick={() => setDate(dateVal)}
                          className={`flex flex-col items-center justify-center p-2.5 border rounded-lg transition-all font-sans ${
                            isSelected
                              ? 'bg-navy dark:bg-gold text-white dark:text-navy-dark border-transparent shadow-md'
                              : 'bg-slate-50 dark:bg-navy border-slate-200 dark:border-slate-700 hover:border-gold text-slate-700 dark:text-slate-350'
                          }`}
                        >
                          <span className="text-[9px] uppercase font-bold tracking-wider">{dayName}</span>
                          <span className="text-base font-bold my-0.5">{dayNum}</span>
                          <span className="text-[9px] uppercase">{monthName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide block">Preferred Time Slot</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {timeSlots.map((slot) => {
                      const isSelected = time === slot;
                      const isBooked = bookedSlots.includes(slot);

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setTime(slot)}
                          className={`py-2 px-1 text-[11px] font-sans font-semibold border rounded-lg transition-all text-center ${
                            isSelected
                              ? 'bg-navy dark:bg-gold text-white dark:text-navy-dark border-transparent shadow'
                              : isBooked
                                ? 'opacity-45 cursor-not-allowed bg-slate-105 dark:bg-navy-dark/10 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 line-through'
                                : 'bg-slate-50 dark:bg-navy border-slate-200 dark:border-slate-700 hover:border-gold text-slate-600 dark:text-slate-350'
                          }`}
                        >
                          {slot}
                          {isBooked && <span className="block text-[8px] font-bold tracking-tight text-rose-500 font-sans uppercase">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Technology description / briefing</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  placeholder="Outline details of patent drafts or trademarks search titles you wish to consult on..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold focus:ring-0"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-gold-dark to-gold text-navy-dark font-bold rounded shadow-md transition-all hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Registering Booking request...' : 'Book strategy session'}
              </button>
            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-6 shadow-sm text-xs leading-relaxed text-slate-500">
            <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-1.5">
              Booking Guidelines
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="w-5 h-5 bg-gold/10 text-gold rounded flex items-center justify-center shrink-0">
                  ✓
                </div>
                <div>
                  <strong>NDA Coverage:</strong> All consultations operate under legal privilege. Do not hesitate to discuss mechanisms or code logics.
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-5 h-5 bg-gold/10 text-gold rounded flex items-center justify-center shrink-0">
                  ✓
                </div>
                <div>
                  <strong>Calendly/Zoom Link:</strong> Meeting invitations containing Google Meet or Zoom coordinates are shared via email after admin approval.
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-5 h-5 bg-gold/10 text-gold rounded flex items-center justify-center shrink-0">
                  ✓
                </div>
                <div>
                  <strong>Rescheduling policy:</strong> You may modify booking requests up to 12 hours prior to scheduled sessions.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookConsultation;
