import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  FileText, Award, Calendar, RefreshCw, User, Folder, Activity, 
  ExternalLink, MessageSquare, CreditCard, Send, CheckCircle, X
} from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState('progress');
  
  // Custom Features state
  const [messages, setMessages] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Reschedule states
  const [reschedulingConsultation, setReschedulingConsultation] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('10:30 AM');
  const [availableDates, setAvailableDates] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  
  // Stripe simulation states
  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paying, setPaying] = useState(false);

  const timeSlots = [
    '09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const fetchClientCases = async () => {
    setLoading(true);
    try {
      const res = await API.get('cases/cases/my_cases/');
      setCases(res.data);
      if (res.data.length > 0) {
        // Keep currently selected case if it exists, otherwise default to first
        const exists = res.data.find(c => c.id === selectedCase?.id);
        setSelectedCase(exists || res.data[0]);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load portfolio details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoicesAndMessages = async (caseId) => {
    try {
      const [invRes, msgRes] = await Promise.all([
        API.get(`cases/invoices/?case=${caseId}`),
        API.get(`cases/messages/?case=${caseId}`)
      ]);
      setInvoices(invRes.data);
      setMessages(msgRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConsultations = async () => {
    try {
      const res = await API.get('consultations/');
      setConsultations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClientCases();
    fetchConsultations();
    
    // Generate dates for rescheduling
    const dates = [];
    let current = new Date();
    current.setDate(current.getDate() + 1); // Start tomorrow
    for (let i = 0; i < 10; i++) {
      if (current.getDay() !== 0) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    setAvailableDates(dates);
  }, []);

  useEffect(() => {
    if (selectedCase) {
      fetchInvoicesAndMessages(selectedCase.id);
    }
  }, [selectedCase]);

  useEffect(() => {
    if (rescheduleDate) {
      API.get(`consultations/?date=${rescheduleDate}`)
        .then((res) => {
          const booked = res.data
            .filter(c => c.status !== 'CLOSED')
            .map(c => c.time);
          setBookedSlots(booked);
        })
        .catch(() => {});
    }
  }, [rescheduleDate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCase) return;
    try {
      const res = await API.post('cases/messages/', {
        case: selectedCase.id,
        content: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
      showToast('Message sent secure.', 'success');
    } catch (err) {
      showToast('Message failed to send.', 'error');
    }
  };

  const handleCancelConsultation = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this consultation booking?')) return;
    try {
      await API.patch(`consultations/${id}/`, { status: 'CLOSED', notes: 'Cancelled by client.' });
      showToast('Appointment cancelled successfully.', 'success');
      fetchConsultations();
    } catch (err) {
      showToast('Failed to cancel consultation.', 'error');
    }
  };

  const triggerReschedule = (c) => {
    setReschedulingConsultation(c);
    setRescheduleDate(c.date);
    setRescheduleTime(c.time);
  };

  const handleRescheduleConsultation = async (e) => {
    e.preventDefault();
    if (!reschedulingConsultation) return;
    try {
      await API.patch(`consultations/${reschedulingConsultation.id}/`, {
        date: rescheduleDate,
        time: rescheduleTime
      });
      showToast('Rescheduled successfully. Meeting invite updated.', 'success');
      setReschedulingConsultation(null);
      fetchConsultations();
    } catch (err) {
      showToast('Failed to reschedule appointment.', 'error');
    }
  };

  const handlePayInvoice = async (e) => {
    e.preventDefault();
    if (!paymentInvoice) return;
    if (!cardNumber || !cardExpiry || !cardCvc) {
      showToast('Please fill in card credentials.', 'warning');
      return;
    }
    setPaying(true);
    try {
      // Create Stripe Intent Mock
      const intentRes = await API.post('cases/create-payment-intent/', {
        invoice_id: paymentInvoice.id
      });
      const clientSecret = intentRes.data.clientSecret;
      console.log('Stripe clientSecret acquired:', clientSecret);

      // Perform Mock Pay update call
      const res = await API.post(`cases/invoices/${paymentInvoice.id}/pay_invoice/`, {
        payment_method_id: 'pm_card_visa'
      });

      if (res.status === 200) {
        showToast('Payment processed via Stripe. Invoice marked paid.', 'success');
        setPaymentInvoice(null);
        setCardNumber('');
        setCardExpiry('');
        setCardCvc('');
        fetchClientCases();
        if (selectedCase) {
          fetchInvoicesAndMessages(selectedCase.id);
        }
      }
    } catch (err) {
      showToast('Failed to process payment.', 'error');
    } finally {
      setPaying(false);
    }
  };

  const getStatusPercentage = (status) => {
    switch (status) {
      case 'DRAFTING': return 20;
      case 'FILING': return 40;
      case 'EXAMINATION': return 60;
      case 'RESPONSE': return 80;
      case 'GRANT': return 100;
      default: return 10;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'GRANT': return 'bg-emerald-500';
      case 'RESPONSE': return 'bg-amber-500';
      default: return 'bg-gold';
    }
  };

  return (
    <div className="font-sans min-h-screen bg-slate-50 dark:bg-navy-dark dark:text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-navy-accent p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center shrink-0">
              <User size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-navy dark:text-white">
                Welcome, {user?.first_name || 'Client'}!
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-semibold">Secure client portal session • {user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => { fetchClientCases(); fetchConsultations(); }}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-350 dark:border-slate-700 hover:border-gold rounded text-xs font-semibold font-sans bg-slate-50 dark:bg-navy transition-all"
          >
            <RefreshCw size={14} /> Refresh Dashboard
          </button>
        </div>

        {/* Dashboard Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : cases.length === 0 && consultations.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg space-y-4 shadow-sm">
            <Folder size={48} className="text-slate-300 mx-auto" />
            <h3 className="text-xl font-serif font-bold text-navy dark:text-white">No Active Files Found</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
              We have not synced any active cases or bookings to your portal account yet. Select 'Book Consultation' to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col: Case list selector */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                  <Folder size={18} className="text-gold" /> Case Portfolio
                </h2>
                {cases.length > 0 ? (
                  <div className="space-y-2">
                    {cases.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCase(c); setActiveTab('progress'); }}
                        className={`w-full text-left p-4 rounded-lg border transition-all flex justify-between items-center ${
                          selectedCase?.id === c.id
                            ? 'bg-navy dark:bg-navy-accent text-white border-gold shadow'
                            : 'bg-white dark:bg-navy-accent/40 border-slate-200 dark:border-slate-800 hover:border-gold dark:text-slate-300'
                        }`}
                      >
                        <div>
                          <h4 className="font-semibold text-sm font-sans line-clamp-1">{c.title}</h4>
                          <p className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${selectedCase?.id === c.id ? 'text-gold' : 'text-slate-500'}`}>
                            {c.type} • {c.case_number}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold border ${
                          c.status === 'GRANT' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-gold/10 border-gold/20 text-gold-dark dark:text-gold'
                        }`}>
                          {c.status}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 p-4 bg-white dark:bg-navy-accent border rounded-lg text-center">No cases active.</div>
                )}
              </div>
            </div>

            {/* Right Col: Tabs & Detailed Details */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Tab Header Selector */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`pb-2 border-b-2 transition-all ${activeTab === 'progress' ? 'border-gold text-gold font-bold' : 'border-transparent hover:text-slate-700'}`}
                >
                  Dossier Tracking
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`pb-2 border-b-2 transition-all ${activeTab === 'messages' ? 'border-gold text-gold font-bold' : 'border-transparent hover:text-slate-700'}`}
                >
                  Secure Chat ({messages.length})
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`pb-2 border-b-2 transition-all ${activeTab === 'billing' ? 'border-gold text-gold font-bold' : 'border-transparent hover:text-slate-700'}`}
                >
                  Invoices ({invoices.length})
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`pb-2 border-b-2 transition-all ${activeTab === 'appointments' ? 'border-gold text-gold font-bold' : 'border-transparent hover:text-slate-700'}`}
                >
                  Bookings ({consultations.length})
                </button>
              </div>

              {/* Tab Content 1: Dossier Tracking details */}
              {activeTab === 'progress' && selectedCase && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Case Info and Progress pipeline */}
                  <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
                    <div className="space-y-1">
                      <span className="text-gold font-bold text-xs uppercase tracking-wider">{selectedCase.type} CASE</span>
                      <h2 className="text-2xl font-serif font-bold text-navy dark:text-white">{selectedCase.title}</h2>
                      <p className="text-slate-500 text-xs font-semibold">Filing Serial Number: {selectedCase.case_number}</p>
                    </div>

                    {selectedCase.description && (
                      <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-850 pt-4">
                        {selectedCase.description}
                      </p>
                    )}

                    {/* Progress timeline gauge */}
                    <div className="space-y-4 pt-4">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <span>Status Pipeline: <strong>{selectedCase.status}</strong></span>
                        <span>{getStatusPercentage(selectedCase.status)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-navy rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${getStatusColor(selectedCase.status)}`}
                          style={{ width: `${getStatusPercentage(selectedCase.status)}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-5 gap-1 text-[9px] font-bold text-slate-400 text-center uppercase pt-1">
                        <span className={selectedCase.status !== 'DRAFTING' ? 'text-gold' : 'text-slate-500'}>Drafting</span>
                        <span className={['FILING', 'EXAMINATION', 'RESPONSE', 'GRANT'].includes(selectedCase.status) ? 'text-gold' : 'text-slate-500'}>Filing</span>
                        <span className={['EXAMINATION', 'RESPONSE', 'GRANT'].includes(selectedCase.status) ? 'text-gold' : 'text-slate-500'}>Examination</span>
                        <span className={['RESPONSE', 'GRANT'].includes(selectedCase.status) ? 'text-gold' : 'text-slate-500'}>Response</span>
                        <span className={selectedCase.status === 'GRANT' ? 'text-emerald-500 font-extrabold' : 'text-slate-500'}>Grant</span>
                      </div>
                    </div>
                  </div>

                  {/* Updates logs */}
                  <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 space-y-4 shadow-sm">
                    <h3 className="text-lg font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                      <Activity size={18} className="text-gold" /> Dossier Audit Logs
                    </h3>
                    {selectedCase.updates && selectedCase.updates.length > 0 ? (
                      <div className="border-l border-slate-200 dark:border-slate-800 ml-3 pl-4 space-y-6 relative text-xs">
                        {selectedCase.updates.map((upd) => (
                          <div key={upd.id} className="relative space-y-1">
                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-gold rounded-full border-2 border-white dark:border-navy-accent"></div>
                            <div className="text-slate-400 font-semibold">{new Date(upd.date).toLocaleDateString()}</div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{upd.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-400 text-xs">No updates logged. Initial filing has been completed.</div>
                    )}
                  </div>

                  {/* Documents & certificates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
                      <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                        <FileText size={16} className="text-gold" /> Dossier Documents
                      </h3>
                      {selectedCase.documents && selectedCase.documents.length > 0 ? (
                        <div className="space-y-2">
                          {selectedCase.documents.map((doc) => (
                            <div key={doc.id} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-navy/40 border border-slate-150 dark:border-slate-850 rounded text-xs">
                              <span className="font-semibold text-slate-700 dark:text-slate-350 line-clamp-1 flex-1 pr-4">{doc.name}</span>
                              <a
                                href={`http://localhost:8000${doc.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold-dark dark:text-gold font-bold hover:underline shrink-0 flex items-center gap-0.5"
                              >
                                Download <ExternalLink size={12} />
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-slate-400 text-xs">No documents uploaded.</div>
                      )}
                    </div>

                    <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
                      <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                        <Award size={16} className="text-gold" /> Grant Certificates
                      </h3>
                      {selectedCase.certificates && selectedCase.certificates.length > 0 ? (
                        <div className="space-y-2">
                          {selectedCase.certificates.map((cert) => (
                            <div key={cert.id} className="flex justify-between items-center p-2.5 bg-emerald-500/5 dark:bg-emerald-950/5 border border-emerald-500/10 dark:border-emerald-900/10 rounded text-xs">
                              <span className="font-semibold text-emerald-800 dark:text-emerald-350 line-clamp-1 flex-1 pr-4">{cert.name}</span>
                              <a
                                href={`http://localhost:8000${cert.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline shrink-0 flex items-center gap-0.5"
                              >
                                View Certificate <ExternalLink size={12} />
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-slate-400 text-xs">Case registration certificate pending examiner grants.</div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* Tab Content 2: Secure Messaging chat */}
              {activeTab === 'messages' && selectedCase && (
                <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4 flex flex-col h-[550px] justify-between animate-fade-in">
                  
                  <div className="border-b pb-3 shrink-0">
                    <h3 className="text-base font-serif font-bold text-navy dark:text-white flex items-center gap-1.5">
                      <MessageSquare size={18} className="text-gold" /> Attorney Secure Channel
                    </h3>
                    <p className="text-[10px] text-slate-400">All communication is protected under legal privilege & client confidentiality.</p>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-4 px-2 bg-slate-50 dark:bg-navy/20 rounded-md border border-slate-100 dark:border-slate-850 my-2">
                    {messages.length > 0 ? (
                      messages.map((m) => {
                        const isSelf = m.sender === user?.id;
                        return (
                          <div key={m.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} max-w-[85%] ${isSelf ? 'ml-auto' : 'mr-auto'}`}>
                            <span className="text-[9px] text-slate-400 font-bold mb-0.5 px-1">
                              {isSelf ? 'You' : `${m.sender_name || 'Attorney'} (${m.sender_role})`} • {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                            <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                              isSelf 
                                ? 'bg-navy dark:bg-gold text-white dark:text-navy-dark rounded-tr-none' 
                                : 'bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-tl-none text-slate-850 dark:text-slate-200'
                            }`}>
                              {m.content}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-20 text-slate-400 text-xs">Secure channel initialized. Drop a note to your managing attorney partner.</div>
                    )}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0 pt-2">
                    <input
                      type="text"
                      required
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type details or query regarding dossier specifications..."
                      className="flex-grow px-3 py-2 text-xs bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-gold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-navy dark:bg-gold text-white dark:text-navy-dark hover:opacity-90 font-bold rounded-md text-xs flex items-center gap-1 shadow-sm font-sans"
                    >
                      <Send size={12} /> Send message
                    </button>
                  </form>

                </div>
              )}

              {/* Tab Content 3: Billing & Invoices */}
              {activeTab === 'billing' && selectedCase && (
                <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                      <CreditCard size={18} className="text-gold" /> Billing Ledger & Retainers
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">Review processing retainers and file invoices. Pay secure via Stripe gateway.</p>
                  </div>

                  {invoices.length > 0 ? (
                    <div className="space-y-4">
                      {invoices.map((inv) => (
                        <div key={inv.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 dark:bg-navy/40 border border-slate-200 dark:border-slate-800 rounded-lg gap-4 text-xs">
                          <div>
                            <div className="font-bold text-slate-850 dark:text-slate-100">Invoice: #{inv.invoice_number}</div>
                            <div className="text-slate-500 font-medium mt-0.5">{inv.description || 'Professional filing fees'}</div>
                            <div className="text-[10px] text-slate-400 mt-1">Due date: {inv.due_date}</div>
                          </div>
                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            <span className="text-base font-serif font-bold text-navy dark:text-white">${inv.amount}</span>
                            
                            {inv.status === 'PAID' ? (
                              <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full font-bold uppercase tracking-wider text-[10px]">
                                <CheckCircle size={10} /> Paid via Stripe
                              </span>
                            ) : (
                              <button
                                onClick={() => setPaymentInvoice(inv)}
                                className="px-4 py-1.5 bg-navy dark:bg-gold text-white dark:text-navy-dark hover:opacity-90 font-bold rounded text-[11px]"
                              >
                                Pay Invoice (Stripe)
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs">No billing records logged for this case portfolio.</div>
                  )}

                  {/* Payment Modal popup */}
                  {paymentInvoice && (
                    <div className="fixed inset-0 bg-slate-900/60 dark:bg-navy-dark/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                      <div className="max-w-md w-full bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-850 rounded-lg p-6 shadow-2xl space-y-6">
                        
                        <div className="flex justify-between items-center border-b pb-2">
                          <h4 className="font-serif font-bold text-navy dark:text-white text-lg">Stripe Credit Card Payment</h4>
                          <button onClick={() => setPaymentInvoice(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <p><strong>Paying invoice:</strong> #{paymentInvoice.invoice_number}</p>
                          <p><strong>Amount:</strong> <span className="font-serif font-bold text-navy dark:text-white">${paymentInvoice.amount} USD</span></p>
                        </div>

                        <form onSubmit={handlePayInvoice} className="space-y-4 text-xs font-sans">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-400">Card Number</label>
                            <input
                              type="text"
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4111 2222 3333 4444"
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-400">Expiration date</label>
                              <input
                                type="text"
                                required
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="MM/YY"
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-400">CVC CVV</label>
                              <input
                                type="password"
                                required
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                placeholder="•••"
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={paying}
                            className="w-full py-2.5 bg-gradient-to-r from-gold-dark to-gold text-navy-dark font-bold rounded text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1"
                          >
                            {paying ? 'Authorizing stripe payment...' : `Charge Card $${paymentInvoice.amount}`}
                          </button>
                        </form>

                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Tab Content 4: Bookings & Consultations */}
              {activeTab === 'appointments' && (
                <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-6 animate-fade-in text-xs">
                  <div>
                    <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                      <Calendar size={18} className="text-gold" /> Consultation Bookings Queue
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">Review scheduled meetings or request updates to timings.</p>
                  </div>

                  {consultations.length > 0 ? (
                    <div className="space-y-4">
                      {consultations.map((c) => (
                        <div key={c.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 dark:bg-navy/40 border border-slate-200 dark:border-slate-800 rounded-lg gap-4">
                          <div>
                            <div className="font-bold text-slate-850 dark:text-slate-100">{c.service} Consultation</div>
                            <div className="font-semibold text-gold-dark dark:text-gold mt-0.5">{c.date} • {c.time}</div>
                            <div className="text-[10px] text-slate-400 mt-1">Status: <strong>{c.status}</strong></div>
                            {c.assigned_lawyer && <div className="text-[10px] text-slate-500">Lawyer: {c.assigned_lawyer}</div>}
                          </div>
                          
                          {c.status !== 'CLOSED' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => triggerReschedule(c)}
                                className="px-3 py-1.5 bg-white dark:bg-navy border border-slate-350 dark:border-slate-700 dark:text-slate-300 font-semibold rounded"
                              >
                                Reschedule Slot
                              </button>
                              <button
                                onClick={() => handleCancelConsultation(c.id)}
                                className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded font-semibold hover:bg-rose-500/20"
                              >
                                Cancel Booking
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs">No consultation reservations scheduled.</div>
                  )}

                  {/* Rescheduling Modal popup */}
                  {reschedulingConsultation && (
                    <div className="fixed inset-0 bg-slate-900/60 dark:bg-navy-dark/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                      <div className="max-w-xl w-full bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-850 rounded-lg p-6 shadow-2xl space-y-6">
                        
                        <div className="flex justify-between items-center border-b pb-2">
                          <h4 className="font-serif font-bold text-navy dark:text-white text-lg">Reschedule Consultation Timing</h4>
                          <button onClick={() => setReschedulingConsultation(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleRescheduleConsultation} className="space-y-4">
                          
                          {/* Available Reschedule Dates grid */}
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500">Select Date</label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {availableDates.map((d) => {
                                const yyyy = d.getFullYear();
                                const mm = String(d.getMonth() + 1).padStart(2, '0');
                                const dd = String(d.getDate()).padStart(2, '0');
                                const dateVal = `${yyyy}-${mm}-${dd}`;
                                
                                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                                const dayNum = d.getDate();
                                const monthName = d.toLocaleDateString('en-US', { month: 'short' });
                                const isSelected = rescheduleDate === dateVal;

                                return (
                                  <button
                                    key={dateVal}
                                    type="button"
                                    onClick={() => setRescheduleDate(dateVal)}
                                    className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-all font-sans ${
                                      isSelected
                                        ? 'bg-navy dark:bg-gold text-white dark:text-navy-dark border-transparent shadow'
                                        : 'bg-slate-50 dark:bg-navy border-slate-200 dark:border-slate-700 hover:border-gold text-slate-700 dark:text-slate-350'
                                    }`}
                                  >
                                    <span className="text-[8px] uppercase font-bold tracking-wider">{dayName}</span>
                                    <span className="text-sm font-bold my-0.5">{dayNum}</span>
                                    <span className="text-[8px] uppercase">{monthName}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Time Slots grid */}
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500">Select Time Slot</label>
                            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                              {timeSlots.map((slot) => {
                                const isSelected = rescheduleTime === slot;
                                const isBooked = bookedSlots.includes(slot);

                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    disabled={isBooked}
                                    onClick={() => setRescheduleTime(slot)}
                                    className={`py-2 px-1 text-[11px] font-sans font-semibold border rounded-lg transition-all text-center ${
                                      isSelected
                                        ? 'bg-navy dark:bg-gold text-white dark:text-navy-dark border-transparent shadow'
                                        : isBooked
                                          ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-navy-dark/10 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 line-through'
                                          : 'bg-slate-50 dark:bg-navy border-slate-200 dark:border-slate-700 hover:border-gold text-slate-600 dark:text-slate-350'
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-gradient-to-r from-gold-dark to-gold text-navy-dark font-bold rounded text-xs hover:opacity-90 shadow-sm"
                          >
                            Save Rescheduled Timing
                          </button>
                        </form>

                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ClientDashboard;
