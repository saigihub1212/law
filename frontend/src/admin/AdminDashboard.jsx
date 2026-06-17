import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, Users, FolderOpen, Calendar, HelpCircle,
  FileText, Plus, Edit2, Trash2, Check, X, Upload, Download, Settings, BarChart2,
  Eye, EyeOff
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');

  // Stats data
  const [stats, setStats] = useState({
    consultations: 0,
    blogs: 0,
    testimonials: 0,
    cases: 0,
    clients: 0
  });

  // Data lists
  const [consultations, setConsultations] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [team, setTeam] = useState([]);
  const [services, setServices] = useState([]);
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);

  // Filter/Search states
  const [consultationSearch, setConsultationSearch] = useState('');
  const [consultationStatus, setConsultationStatus] = useState('');

  // Editing / Creating Forms Modal states
  const [currentEditItem, setCurrentEditItem] = useState(null);
  
  // Loading indicator
  const [loading, setLoading] = useState(false);

  // Form states for creating cases / uploads
  const [newCaseClient, setNewCaseClient] = useState('');
  const [newCaseNumber, setNewCaseNumber] = useState('');
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseType, setNewCaseType] = useState('PATENT');
  const [newCaseStatus, setNewCaseStatus] = useState('FILED');
  const [newCaseDesc, setNewCaseDesc] = useState('');

  const [uploadDocCase, setUploadDocCase] = useState('');
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadDocFile, setUploadDocFile] = useState(null);

  const [uploadCertCase, setUploadCertCase] = useState('');
  const [uploadCertName, setUploadCertName] = useState('');
  const [uploadCertFile, setUploadCertFile] = useState(null);

  const [newUpdateCase, setNewUpdateCase] = useState('');
  const [newUpdateMessage, setNewUpdateMessage] = useState('');

  // New Client Account Registration Form
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPass, setNewClientPass] = useState('');
  const [showClientPassword, setShowClientPassword] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  // CMS Home state
  const [cmsHomeTitle, setCmsHomeTitle] = useState('');
  const [cmsHomeSubtitle, setCmsHomeSubtitle] = useState('');

  // Services form state
  const [serviceName, setServiceName] = useState('');
  const [serviceSlug, setServiceSlug] = useState('');
  const [serviceCategory, setServiceCategory] = useState('PATENT');
  const [serviceShortDesc, setServiceShortDesc] = useState('');
  const [serviceLongDesc, setServiceLongDesc] = useState('');
  const [serviceIcon, setServiceIcon] = useState('Scale');
  const [serviceDetailsList, setServiceDetailsList] = useState('');
  const [isEditingService, setIsEditingService] = useState(null);

  // Team form state
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [teamImageUrl, setTeamImageUrl] = useState('');
  const [teamBio, setTeamBio] = useState('');
  const [teamQualifications, setTeamQualifications] = useState('');
  const [teamExperience, setTeamExperience] = useState('');
  const [teamLinkedinUrl, setTeamLinkedinUrl] = useState('');
  const [teamTwitterUrl, setTeamTwitterUrl] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  const [isEditingTeam, setIsEditingTeam] = useState(null);

  // Blogs form state
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('IPR Updates');
  const [blogImageUrl, setBlogImageUrl] = useState('');
  const [blogSeoTitle, setBlogSeoTitle] = useState('');
  const [blogSeoDescription, setBlogSeoDescription] = useState('');
  const [blogStatus, setBlogStatus] = useState('DRAFT');
  const [isEditingBlog, setIsEditingBlog] = useState(null);

  // Settings form state
  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsPhone, setSettingsPhone] = useState('');
  const [settingsHqAddress, setSettingsHqAddress] = useState('');
  const [settingsLiaisonAddress, setSettingsLiaisonAddress] = useState('');
  const [settingsCopyright, setSettingsCopyright] = useState('');
  const [settingsLinkedin, setSettingsLinkedin] = useState('');
  const [settingsTwitter, setSettingsTwitter] = useState('');
  const [settingsFacebook, setSettingsFacebook] = useState('');

  // Fetch all management records
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [consRes, blogRes, faqRes, testRes, teamRes, svcRes, caseRes, clientRes, cmsHomeRes] = await Promise.all([
        API.get('consultations/'),
        API.get('cms/blogs/'),
        API.get('cms/faqs/'),
        API.get('cms/testimonials/'),
        API.get('cms/team/'),
        API.get('cms/services/'),
        API.get('cases/cases/'),
        API.get('auth/clients/'),
        API.get('cms/pages/home/')
      ]);

      setConsultations(consRes.data);
      setBlogs(blogRes.data);
      setFaqs(faqRes.data);
      setTestimonials(testRes.data);
      setTeam(teamRes.data);
      setServices(svcRes.data);
      setCases(caseRes.data);
      setClients(clientRes.data);

      if (cmsHomeRes.data && cmsHomeRes.data.content) {
        setCmsHomeTitle(cmsHomeRes.data.content.hero_title || '');
        setCmsHomeSubtitle(cmsHomeRes.data.content.hero_subtitle || '');
      }

      setStats({
        consultations: consRes.data.length,
        blogs: blogRes.data.length,
        testimonials: testRes.data.length,
        cases: caseRes.data.length,
        clients: clientRes.data.length
      });

      try {
        const settingsRes = await API.get('cms/pages/settings/');
        if (settingsRes.data && settingsRes.data.content) {
          setSettingsEmail(settingsRes.data.content.email || '');
          setSettingsPhone(settingsRes.data.content.phone || '');
          setSettingsHqAddress(settingsRes.data.content.hq_address || '');
          setSettingsLiaisonAddress(settingsRes.data.content.liaison_address || '');
          setSettingsCopyright(settingsRes.data.content.copyright || '');
          setSettingsLinkedin(settingsRes.data.content.linkedin_url || '');
          setSettingsTwitter(settingsRes.data.content.twitter_url || '');
          setSettingsFacebook(settingsRes.data.content.facebook_url || '');
        }
      } catch (err) {
        console.log("No global site settings found in CMS yet.");
      }
    } catch (err) {
      console.error(err);
      showToast('Error syncing dashboard management records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // 1. Manage Consultations status updates
  const handleUpdateConsultationStatus = async (id, statusVal, lawyerVal, notesVal) => {
    try {
      await API.patch(`consultations/${id}/`, {
        status: statusVal,
        assigned_lawyer: lawyerVal,
        notes: notesVal
      });
      showToast('Consultation record updated.', 'success');
      loadAdminData();
    } catch (err) {
      showToast('Failed to modify consultation status.', 'error');
    }
  };

  // 2. Manage Testimonial Approval
  const handleApproveTestimonial = async (id, approvedStatus) => {
    try {
      await API.patch(`cms/testimonials/${id}/`, { approved: approvedStatus });
      showToast(approvedStatus ? 'Testimonial approved.' : 'Testimonial hidden.', 'success');
      loadAdminData();
    } catch (err) {
      showToast('Failed to toggle testimonial status.', 'error');
    }
  };

  // 3. Register client user account
  const handleRegisterClient = async (e) => {
    e.preventDefault();
    try {
      await API.post('auth/register-client/', {
        email: newClientEmail,
        password: newClientPass,
        first_name: newClientName,
        phone: newClientPhone,
        role: 'CLIENT'
      });
      showToast('Client portal login created successfully.', 'success');
      setNewClientEmail('');
      setNewClientPass('');
      setNewClientName('');
      setNewClientPhone('');
      loadAdminData();
    } catch (err) {
      showToast('Failed to register client account.', 'error');
    }
  };

  // 4. Create new client case
  const handleCreateCase = async (e) => {
    e.preventDefault();
    try {
      await API.post('cases/cases/', {
        client: newCaseClient,
        case_number: newCaseNumber,
        title: newCaseTitle,
        type: newCaseType,
        status: newCaseStatus,
        description: newCaseDesc
      });
      showToast('Client case created.', 'success');
      setNewCaseNumber('');
      setNewCaseTitle('');
      setNewCaseDesc('');
      loadAdminData();
    } catch (err) {
      showToast('Failed to add client case.', 'error');
    }
  };

  // 5. Upload document files
  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!uploadDocFile) return;

    const formData = new FormData();
    formData.append('case', uploadDocCase);
    formData.append('name', uploadDocName);
    formData.append('file', uploadDocFile);

    try {
      await API.post('cases/documents/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Dossier document uploaded.', 'success');
      setUploadDocName('');
      setUploadDocFile(null);
      loadAdminData();
    } catch (err) {
      showToast('File upload failed.', 'error');
    }
  };

  // 6. Upload certificates
  const handleUploadCertificate = async (e) => {
    e.preventDefault();
    if (!uploadCertFile) return;

    const formData = new FormData();
    formData.append('case', uploadCertCase);
    formData.append('name', uploadCertName);
    formData.append('file', uploadCertFile);

    try {
      await API.post('cases/certificates/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Grant certificate uploaded.', 'success');
      setUploadCertName('');
      setUploadCertFile(null);
      loadAdminData();
    } catch (err) {
      showToast('File upload failed.', 'error');
    }
  };

  // 7. Add Case Update messages
  const handleAddCaseUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.post('cases/updates/', {
        case: newUpdateCase,
        message: newUpdateMessage
      });
      showToast('Case progress log added.', 'success');
      setNewUpdateMessage('');
      loadAdminData();
    } catch (err) {
      showToast('Failed to log update.', 'error');
    }
  };

  // 8. Update Homepage CMS values
  const handleUpdateCmsHome = async () => {
    try {
      await API.put('cms/pages/home/', {
        page_name: 'home',
        content: {
          hero_title: cmsHomeTitle,
          hero_subtitle: cmsHomeSubtitle,
          stats_claims_resolved: "1,500+",
          stats_patent_rate: "97.4%",
          stats_active_clients: "350+",
          stats_countries: "45+",
          why_choose_title: "Why Global Innovators Choose SR4IPR",
          why_choose_desc: "We combine advanced technical expertise in engineering and biosciences with elite legal acumen to secure and monetize your most valuable commercial assets."
        }
      });
      showToast('Home hero copy saved successfully.', 'success');
      loadAdminData();
    } catch (err) {
      showToast('Failed to save CMS copy.', 'error');
    }
  };

  // Export consultations leads to Excel compatible CSV
  const handleExportCSV = () => {
    window.open(`http://localhost:8000/api/consultations/export_csv/`, '_blank');
  };

  const getFilteredConsultations = () => {
    return consultations.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(consultationSearch.toLowerCase()) || 
                            c.email.toLowerCase().includes(consultationSearch.toLowerCase());
      const matchesStatus = !consultationStatus || c.status === consultationStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredConsultations = getFilteredConsultations();

  // Service CRUD Handlers
  const handleSaveService = async (e) => {
    e.preventDefault();
    const servicePayload = {
      name: serviceName,
      slug: serviceSlug || undefined,
      category: serviceCategory,
      short_desc: serviceShortDesc,
      long_desc: serviceLongDesc || '',
      icon: serviceIcon || 'Scale',
      details_list: serviceDetailsList.split('\n').map(l => l.trim()).filter(Boolean)
    };

    try {
      if (isEditingService) {
        await API.put(`cms/services/${isEditingService.slug}/`, servicePayload);
        showToast('Service updated successfully.', 'success');
      } else {
        await API.post('cms/services/', servicePayload);
        showToast('Service created successfully.', 'success');
      }
      resetServiceForm();
      loadAdminData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save service.', 'error');
    }
  };

  const handleDeleteService = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await API.delete(`cms/services/${slug}/`);
      showToast('Service deleted.', 'success');
      loadAdminData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete service.', 'error');
    }
  };

  const resetServiceForm = () => {
    setServiceName('');
    setServiceSlug('');
    setServiceCategory('PATENT');
    setServiceShortDesc('');
    setServiceLongDesc('');
    setServiceIcon('Scale');
    setServiceDetailsList('');
    setIsEditingService(null);
  };

  const startEditService = (svc) => {
    setIsEditingService(svc);
    setServiceName(svc.name);
    setServiceSlug(svc.slug);
    setServiceCategory(svc.category);
    setServiceShortDesc(svc.short_desc);
    setServiceLongDesc(svc.long_desc || '');
    setServiceIcon(svc.icon || 'Scale');
    setServiceDetailsList(Array.isArray(svc.details_list) ? svc.details_list.join('\n') : '');
  };

  // Team CRUD Handlers
  const handleSaveTeamMember = async (e) => {
    e.preventDefault();
    const teamPayload = {
      name: teamName,
      role: teamRole,
      image_url: teamImageUrl || undefined,
      bio: teamBio,
      qualifications: teamQualifications || '',
      experience: teamExperience || '',
      linkedin_url: teamLinkedinUrl || undefined,
      twitter_url: teamTwitterUrl || undefined,
      email: teamEmail || undefined
    };

    try {
      if (isEditingTeam) {
        await API.put(`cms/team/${isEditingTeam.id}/`, teamPayload);
        showToast('Team member updated successfully.', 'success');
      } else {
        await API.post('cms/team/', teamPayload);
        showToast('Team member added successfully.', 'success');
      }
      resetTeamForm();
      loadAdminData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save team member.', 'error');
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      await API.delete(`cms/team/${id}/`);
      showToast('Team member deleted.', 'success');
      loadAdminData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete team member.', 'error');
    }
  };

  const resetTeamForm = () => {
    setTeamName('');
    setTeamRole('');
    setTeamImageUrl('');
    setTeamBio('');
    setTeamQualifications('');
    setTeamExperience('');
    setTeamLinkedinUrl('');
    setTeamTwitterUrl('');
    setTeamEmail('');
    setIsEditingTeam(null);
  };

  const startEditTeam = (tm) => {
    setIsEditingTeam(tm);
    setTeamName(tm.name);
    setTeamRole(tm.role);
    setTeamImageUrl(tm.image_url || '');
    setTeamBio(tm.bio || '');
    setTeamQualifications(tm.qualifications || '');
    setTeamExperience(tm.experience || '');
    setTeamLinkedinUrl(tm.linkedin_url || '');
    setTeamTwitterUrl(tm.twitter_url || '');
    setTeamEmail(tm.email || '');
  };

  // Blog CRUD Handlers
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    const blogPayload = {
      title: blogTitle,
      slug: blogSlug || undefined,
      summary: blogSummary,
      content: blogContent,
      category: blogCategory,
      image_url: blogImageUrl || undefined,
      seo_title: blogSeoTitle || '',
      seo_description: blogSeoDescription || '',
      status: blogStatus
    };

    try {
      if (isEditingBlog) {
        await API.put(`cms/blogs/${isEditingBlog.slug}/`, blogPayload);
        showToast('Blog article updated successfully.', 'success');
      } else {
        await API.post('cms/blogs/', blogPayload);
        showToast('Blog article published/saved successfully.', 'success');
      }
      resetBlogForm();
      loadAdminData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save blog article.', 'error');
    }
  };

  const handleDeleteBlog = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this blog article?')) return;
    try {
      await API.delete(`cms/blogs/${slug}/`);
      showToast('Blog article deleted.', 'success');
      loadAdminData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete blog article.', 'error');
    }
  };

  const resetBlogForm = () => {
    setBlogTitle('');
    setBlogSlug('');
    setBlogSummary('');
    setBlogContent('');
    setBlogCategory('IPR Updates');
    setBlogImageUrl('');
    setBlogSeoTitle('');
    setBlogSeoDescription('');
    setBlogStatus('DRAFT');
    setIsEditingBlog(null);
  };

  const startEditBlog = (bg) => {
    setIsEditingBlog(bg);
    setBlogTitle(bg.title);
    setBlogSlug(bg.slug);
    setBlogSummary(bg.summary || '');
    setBlogContent(bg.content || '');
    setBlogCategory(bg.category || 'IPR Updates');
    setBlogImageUrl(bg.image_url || '');
    setBlogSeoTitle(bg.seo_title || '');
    setBlogSeoDescription(bg.seo_description || '');
    setBlogStatus(bg.status || 'DRAFT');
  };

  // Settings Handlers
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await API.put('cms/pages/settings/', {
        page_name: 'settings',
        content: {
          email: settingsEmail,
          phone: settingsPhone,
          hq_address: settingsHqAddress,
          liaison_address: settingsLiaisonAddress,
          copyright: settingsCopyright,
          linkedin_url: settingsLinkedin,
          twitter_url: settingsTwitter,
          facebook_url: settingsFacebook
        }
      });
      showToast('Global site settings updated.', 'success');
      loadAdminData();
    } catch (err) {
      console.error(err);
      showToast('Failed to update global site settings.', 'error');
    }
  };

  return (
    <div className="font-sans min-h-screen bg-slate-50 dark:bg-navy-dark dark:text-slate-100 flex flex-col lg:flex-row">
      
      {/* 1. Left Sidebar menu */}
      <div className="w-full lg:w-64 bg-navy text-white border-r border-gold-dark/30 shrink-0">
        <div className="p-6 border-b border-slate-800 text-center">
          <h2 className="font-serif font-bold text-lg text-gold">Management Portal</h2>
          <p className="text-[10px] uppercase text-slate-400 mt-1">Logged: {user?.username} ({user?.role})</p>
        </div>
        
        <nav className="p-4 space-y-1 text-sm font-semibold font-sans">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded transition-all ${activeTab === 'overview' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button
            onClick={() => setActiveTab('cms')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded transition-all ${activeTab === 'cms' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
          >
            <Settings size={18} /> Homepage copy CMS
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded transition-all ${activeTab === 'services' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
          >
            <HelpCircle size={18} /> Services CRUD
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded transition-all ${activeTab === 'team' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
          >
            <Users size={18} /> Team Members CRUD
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded transition-all ${activeTab === 'blogs' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
          >
            <BookOpen size={18} /> Blog Manager
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded transition-all ${activeTab === 'consultations' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
          >
            <Calendar size={18} /> Leads & Bookings
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded transition-all ${activeTab === 'cases' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
          >
            <FolderOpen size={18} /> Cases & Client Portal
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded transition-all ${activeTab === 'settings' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
          >
            <Settings size={18} /> Site Settings
          </button>
        </nav>
      </div>

      {/* 2. Main Dashboard Content Frame */}
      <div className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {loading && (
          <div className="fixed inset-0 bg-slate-500/10 dark:bg-navy-dark/10 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Administrative Dashboard</h1>
            
            {/* Stats widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-serif font-bold text-gold">{stats.consultations}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase mt-1">Consultations Enquiries</div>
              </div>
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-serif font-bold text-gold">{stats.cases}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase mt-1">Active Client Cases</div>
              </div>
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-serif font-bold text-gold">{stats.clients}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase mt-1">Clients Enrolled</div>
              </div>
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-serif font-bold text-gold">{stats.blogs}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase mt-1">Blog Articles</div>
              </div>
            </div>

            {/* Testimonials approvals */}
            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                Testimonials Validation Desk
              </h2>
              {testimonials.length > 0 ? (
                <div className="space-y-3">
                  {testimonials.map((t) => (
                    <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-navy border border-slate-200 dark:border-slate-850 rounded text-xs gap-4">
                      <div>
                        <strong>{t.client_name}</strong> ({t.client_role} at {t.company})
                        <p className="text-slate-500 italic mt-0.5">"{t.feedback}"</p>
                      </div>
                      <div className="flex gap-2">
                        {t.approved ? (
                          <button
                            onClick={() => handleApproveTestimonial(t.id, false)}
                            className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded font-semibold font-sans hover:bg-amber-500/20"
                          >
                            Hide Testimonial
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApproveTestimonial(t.id, true)}
                            className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded font-semibold font-sans hover:bg-emerald-500/20"
                          >
                            Approve testimonial
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">No client reviews registered.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: CMS copy Management */}
        {activeTab === 'cms' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Website Copy CMS</h1>
            
            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-navy dark:text-white border-b pb-2">Hero Section Editor</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Hero H1 Title copy</label>
                  <input
                    type="text"
                    value={cmsHomeTitle}
                    onChange={(e) => setCmsHomeTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Hero Subtitle Paragraph copy</label>
                  <textarea
                    rows="3"
                    value={cmsHomeSubtitle}
                    onChange={(e) => setCmsHomeSubtitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  ></textarea>
                </div>
                <button
                  type="button"
                  onClick={handleUpdateCmsHome}
                  className="px-6 py-2.5 bg-navy dark:bg-gold text-white dark:text-navy-dark font-semibold text-xs rounded hover:opacity-90 transition-all font-sans"
                >
                  Save Hero Copy Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Consultations Leads manager */}
        {activeTab === 'consultations' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-2">
              <h1 className="text-3xl font-serif font-bold text-navy dark:text-white">Strategy Bookings & Enquiries</h1>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 rounded text-xs font-semibold font-sans transition-all"
              >
                <Download size={14} /> Export leads to CSV
              </button>
            </div>

            {/* Filter inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={consultationSearch}
                onChange={(e) => setConsultationSearch(e.target.value)}
                placeholder="Search leads by name / email..."
                className="px-3 py-2 text-xs bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:border-gold shadow-sm"
              />
              <select
                value={consultationStatus}
                onChange={(e) => setConsultationStatus(e.target.value)}
                className="px-3 py-2 text-xs bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:border-gold shadow-sm"
              >
                <option value="">Filter by Status</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            {/* Leads Table List */}
            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-navy border-b border-slate-200 dark:border-slate-800/80 uppercase text-slate-500 font-semibold">
                    <th className="p-3">Client details</th>
                    <th className="p-3">Preferred schedule</th>
                    <th className="p-3">Practice category</th>
                    <th className="p-3">Status details</th>
                    <th className="p-3">Assigned lawyer</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredConsultations.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-navy/20">
                      <td className="p-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.email} • {c.phone}</div>
                        {c.message && <div className="text-[10px] text-slate-500 mt-1 max-w-[250px] truncate" title={c.message}>"{c.message}"</div>}
                      </td>
                      <td className="p-3 font-medium text-slate-700 dark:text-slate-350">{c.date} • {c.time}</td>
                      <td className="p-3 font-semibold text-gold-dark dark:text-gold">{c.service}</td>
                      <td className="p-3">
                        <select
                          value={c.status}
                          onChange={(e) => handleUpdateConsultationStatus(c.id, e.target.value, c.assigned_lawyer, c.notes)}
                          className="px-2 py-1 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded text-[11px]"
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          defaultValue={c.assigned_lawyer || ''}
                          onBlur={(e) => handleUpdateConsultationStatus(c.id, c.status, e.target.value, c.notes)}
                          placeholder="Assign lawyer name"
                          className="px-2 py-1 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded text-[11px] w-32"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input
                          type="text"
                          defaultValue={c.notes || ''}
                          onBlur={(e) => handleUpdateConsultationStatus(c.id, c.status, c.assigned_lawyer, e.target.value)}
                          placeholder="Lead notes memo"
                          className="px-2 py-1 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded text-[11px] w-40"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Client Accounts & Cases setup */}
        {activeTab === 'cases' && (
          <div className="space-y-12">
            
            {/* Create Client Login */}
            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                <Plus size={20} className="text-gold" /> Create Client login account
              </h2>
              
              <form onSubmit={handleRegisterClient} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Alex Novak"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Password</label>
                  <div className="relative">
                    <input
                      type={showClientPassword ? 'text' : 'password'}
                      required
                      value={newClientPass}
                      onChange={(e) => setNewClientPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-2.5 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowClientPassword(!showClientPassword)}
                      className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showClientPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-1.5 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded text-xs hover:opacity-90 transition-all shadow-sm"
                >
                  Create Client Login
                </button>
              </form>
            </div>

            {/* Create Case Dossier */}
            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                <Plus size={20} className="text-gold" /> Register Client case dossier
              </h2>

              <form onSubmit={handleCreateCase} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Select Client Account</label>
                    <select
                      required
                      value={newCaseClient}
                      onChange={(e) => setNewCaseClient(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    >
                      <option value="">Select Account</option>
                      {clients.map((cl) => (
                        <option key={cl.id} value={cl.id}>{cl.email} ({cl.first_name})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Case Dossier number</label>
                    <input
                      type="text"
                      required
                      value={newCaseNumber}
                      onChange={(e) => setNewCaseNumber(e.target.value)}
                      placeholder="e.g. SR/2026/PT-092"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">IPR Category</label>
                    <select
                      value={newCaseType}
                      onChange={(e) => setNewCaseType(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    >
                      <option value="PATENT">Patent</option>
                      <option value="TRADEMARK">Trademark</option>
                      <option value="COPYRIGHT">Copyright</option>
                      <option value="DESIGN">Design</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Starting Progress Status</label>
                    <select
                      value={newCaseStatus}
                      onChange={(e) => setNewCaseStatus(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    >
                      <option value="FILED">Filed</option>
                      <option value="EXAMINATION">Examination</option>
                      <option value="HEARING">Hearing</option>
                      <option value="REGISTERED">Registered</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Case Title / Short Description</label>
                    <input
                      type="text"
                      required
                      value={newCaseTitle}
                      onChange={(e) => setNewCaseTitle(e.target.value)}
                      placeholder="e.g. Algorithmic task execution database management patent"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-4 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded text-xs hover:opacity-90 shadow-sm"
                    >
                      Create Case Dossier
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Dossier updates & files Upload lists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Document upload form */}
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4 text-xs">
                <h3 className="text-sm font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                  <Upload size={14} className="text-gold" /> Upload Case Document
                </h3>
                <form onSubmit={handleUploadDocument} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Select Target Case</label>
                    <select
                      required
                      value={uploadDocCase}
                      onChange={(e) => setUploadDocCase(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded"
                    >
                      <option value="">Select Case</option>
                      {cases.map((cs) => (
                        <option key={cs.id} value={cs.id}>{cs.case_number} ({cs.title})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Document name</label>
                    <input
                      type="text"
                      required
                      value={uploadDocName}
                      onChange={(e) => setUploadDocName(e.target.value)}
                      placeholder="e.g. Prior Art Search sheet"
                      className="w-full px-2 py-1 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">File attachment (PDF/image)</label>
                    <input
                      type="file"
                      required
                      onChange={(e) => setUploadDocFile(e.target.files[0])}
                      className="w-full bg-slate-50 dark:bg-navy text-[10px] border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-navy dark:bg-gold text-white dark:text-navy-dark font-semibold rounded text-xs"
                  >
                    Upload Document File
                  </button>
                </form>
              </div>

              {/* Certificate upload form */}
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4 text-xs">
                <h3 className="text-sm font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                  <Upload size={14} className="text-gold" /> Upload Grant Certificate
                </h3>
                <form onSubmit={handleUploadCertificate} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Select Target Case</label>
                    <select
                      required
                      value={uploadCertCase}
                      onChange={(e) => setUploadCertCase(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded"
                    >
                      <option value="">Select Case</option>
                      {cases.map((cs) => (
                        <option key={cs.id} value={cs.id}>{cs.case_number} ({cs.title})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Certificate title name</label>
                    <input
                      type="text"
                      required
                      value={uploadCertName}
                      onChange={(e) => setUploadCertName(e.target.value)}
                      placeholder="e.g. Patent Grant Certificate"
                      className="w-full px-2 py-1 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">File attachment (PDF/image)</label>
                    <input
                      type="file"
                      required
                      onChange={(e) => setUploadCertFile(e.target.files[0])}
                      className="w-full bg-slate-50 dark:bg-navy text-[10px] border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-navy dark:bg-gold text-white dark:text-navy-dark font-semibold rounded text-xs"
                  >
                    Upload Grant Certificate
                  </button>
                </form>
              </div>

              {/* Progress updates logging */}
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4 text-xs">
                <h3 className="text-sm font-serif font-bold text-navy dark:text-white border-b pb-2 flex items-center gap-1.5">
                  <Plus size={14} className="text-gold" /> Log case progress updates
                </h3>
                <form onSubmit={handleAddCaseUpdate} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Select Target Case</label>
                    <select
                      required
                      value={newUpdateCase}
                      onChange={(e) => setNewUpdateCase(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded"
                    >
                      <option value="">Select Case</option>
                      {cases.map((cs) => (
                        <option key={cs.id} value={cs.id}>{cs.case_number} ({cs.title})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Progress message log description</label>
                    <textarea
                      required
                      rows="3"
                      value={newUpdateMessage}
                      onChange={(e) => setNewUpdateMessage(e.target.value)}
                      placeholder="e.g. Patent office issued first examination report. Deadline to submit response is September 12."
                      className="w-full px-2 py-1 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-navy dark:bg-gold text-white dark:text-navy-dark font-semibold rounded text-xs"
                  >
                    Log Progress Update
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* Tab 5: Services CRUD Management */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Services Portfolio CMS</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Service list */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-lg font-serif font-bold text-navy dark:text-white">Active Firm Offerings</h2>
                <div className="grid grid-cols-1 gap-4">
                  {services.map((svc) => (
                    <div key={svc.id} className="p-4 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{svc.category}</span>
                        <h4 className="font-serif font-bold text-sm text-navy dark:text-white mt-0.5">{svc.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{svc.short_desc}</p>
                        <div className="text-[10px] text-slate-400 mt-2 font-mono">Slug: {svc.slug} • Icon: {svc.icon}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => startEditService(svc)}
                          className="p-1.5 text-slate-500 hover:text-gold rounded border border-slate-200 dark:border-slate-800"
                          title="Edit Service"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteService(svc.slug)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded border border-rose-500/10"
                          title="Delete Service"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Form */}
              <div className="lg:col-span-5 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm space-y-4 text-xs">
                <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2">
                  {isEditingService ? 'Edit Practice Area' : 'Add New Practice Area'}
                </h3>
                <form onSubmit={handleSaveService} className="space-y-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Service Title</label>
                    <input
                      type="text"
                      required
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="e.g. Patent Filing Strategy"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Slug (Optional)</label>
                      <input
                        type="text"
                        value={serviceSlug}
                        onChange={(e) => setServiceSlug(e.target.value)}
                        placeholder="e.g. patent-filing"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Category</label>
                      <select
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      >
                        <option value="PATENT">Patent Services</option>
                        <option value="TRADEMARK">Trademark Services</option>
                        <option value="COPYRIGHT">Copyright Services</option>
                        <option value="DESIGN">Design Registration</option>
                        <option value="GI">Geographical Indication (GI)</option>
                        <option value="LITIGATION">Litigation & Enforcement</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Lucide Icon name</label>
                      <input
                        type="text"
                        value={serviceIcon}
                        onChange={(e) => setServiceIcon(e.target.value)}
                        placeholder="Scale, Cpu, Tags, ShieldAlert, etc."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Short description summary</label>
                    <textarea
                      required
                      rows="2"
                      value={serviceShortDesc}
                      onChange={(e) => setServiceShortDesc(e.target.value)}
                      placeholder="Brief 1-2 sentence overview shown in services lists..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    ></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Long description text</label>
                    <textarea
                      rows="4"
                      value={serviceLongDesc}
                      onChange={(e) => setServiceLongDesc(e.target.value)}
                      placeholder="In-depth details, methodology, and legal frameworks..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    ></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Sub-services checklist (One per line)</label>
                    <textarea
                      rows="3"
                      value={serviceDetailsList}
                      onChange={(e) => setServiceDetailsList(e.target.value)}
                      placeholder="e.g. Utility Patent Applications&#10;PCT International Filing&#10;Office Action Responses"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    ></textarea>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded"
                    >
                      {isEditingService ? 'Save Service' : 'Create Service'}
                    </button>
                    {isEditingService && (
                      <button
                        type="button"
                        onClick={resetServiceForm}
                        className="px-4 py-2 border border-slate-300 rounded font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Team Members CRUD Management */}
        {activeTab === 'team' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Firm Attorneys CMS</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Team list */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-lg font-serif font-bold text-navy dark:text-white">Active Attorney Roster</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.map((member) => (
                    <div key={member.id} className="p-4 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex flex-col justify-between gap-4">
                      <div className="flex gap-3">
                        {member.image_url ? (
                          <img src={member.image_url} alt={member.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-12 h-12 bg-slate-100 dark:bg-navy text-slate-400 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        <div>
                          <h4 className="font-serif font-bold text-sm text-navy dark:text-white">{member.name}</h4>
                          <p className="text-xs text-gold font-semibold">{member.role}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{member.experience || 'N/A Experience'} • {member.qualifications}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-3 italic">"{member.bio}"</p>
                      <div className="flex justify-between items-center border-t pt-2 border-slate-100 dark:border-slate-850">
                        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{member.email || 'No email'}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditTeam(member)}
                            className="p-1 text-slate-500 hover:text-gold rounded border border-slate-200 dark:border-slate-800"
                            title="Edit"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteTeamMember(member.id)}
                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded border border-rose-500/10"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Form */}
              <div className="lg:col-span-5 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm space-y-4 text-xs">
                <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2">
                  {isEditingTeam ? 'Edit Attorney Details' : 'Add New Attorney'}
                </h3>
                <form onSubmit={handleSaveTeamMember} className="space-y-4 font-sans">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Name</label>
                      <input
                        type="text"
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Siddharth Rao, Esq."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Role / Designation</label>
                      <input
                        type="text"
                        required
                        value={teamRole}
                        onChange={(e) => setTeamRole(e.target.value)}
                        placeholder="Senior Partner"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Experience (Years)</label>
                      <input
                        type="text"
                        value={teamExperience}
                        onChange={(e) => setTeamExperience(e.target.value)}
                        placeholder="e.g. 15+ Years"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Email Address</label>
                      <input
                        type="email"
                        value={teamEmail}
                        onChange={(e) => setTeamEmail(e.target.value)}
                        placeholder="s.rao@sr4ipr.com"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Qualifications</label>
                    <input
                      type="text"
                      value={teamQualifications}
                      onChange={(e) => setTeamQualifications(e.target.value)}
                      placeholder="e.g. LL.M. (Georgetown Law), B.Tech"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Image URL</label>
                    <input
                      type="text"
                      value={teamImageUrl}
                      onChange={(e) => setTeamImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or relative path"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">LinkedIn profile URL</label>
                      <input
                        type="text"
                        value={teamLinkedinUrl}
                        onChange={(e) => setTeamLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Twitter profile URL</label>
                      <input
                        type="text"
                        value={teamTwitterUrl}
                        onChange={(e) => setTeamTwitterUrl(e.target.value)}
                        placeholder="https://twitter.com/username"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Attorney Biography / Bio</label>
                    <textarea
                      required
                      rows="4"
                      value={teamBio}
                      onChange={(e) => setTeamBio(e.target.value)}
                      placeholder="Provide full legal history, publications, and specific technical fields..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    ></textarea>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded"
                    >
                      {isEditingTeam ? 'Save Attorney' : 'Add Attorney'}
                    </button>
                    {isEditingTeam && (
                      <button
                        type="button"
                        onClick={resetTeamForm}
                        className="px-4 py-2 border border-slate-300 rounded font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Blog Scheduling & Management */}
        {activeTab === 'blogs' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Knowledge center Blog Manager</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Blog list */}
              <div className="lg:col-span-6 space-y-4">
                <h2 className="text-lg font-serif font-bold text-navy dark:text-white">Draft & Published Articles</h2>
                <div className="space-y-3">
                  {blogs.map((bg) => (
                    <div key={bg.id} className="p-4 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex justify-between items-center gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-[3px] font-bold text-[9px] border ${
                            bg.status === 'PUBLISHED'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                          }`}>
                            {bg.status}
                          </span>
                          <span className="font-semibold text-slate-400">{bg.category}</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-navy dark:text-white mt-1.5">{bg.title}</h4>
                        <p className="text-slate-500 line-clamp-1 mt-1 text-[11px]">{bg.summary}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-mono">Slug: {bg.slug}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => startEditBlog(bg)}
                          className="p-1.5 text-slate-500 hover:text-gold rounded border border-slate-200 dark:border-slate-800"
                          title="Edit"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(bg.slug)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded border border-rose-500/10"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Form */}
              <div className="lg:col-span-6 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm space-y-4 text-xs">
                <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2">
                  {isEditingBlog ? 'Edit Article & SEO' : 'Compose New Article'}
                </h3>
                <form onSubmit={handleSaveBlog} className="space-y-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Article Title</label>
                    <input
                      type="text"
                      required
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder="e.g. Navigating WIPO Patents Class Allocations"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Slug (Optional)</label>
                      <input
                        type="text"
                        value={blogSlug}
                        onChange={(e) => setBlogSlug(e.target.value)}
                        placeholder="e.g. navigating-wipo-patents"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Category</label>
                      <input
                        type="text"
                        value={blogCategory}
                        onChange={(e) => setBlogCategory(e.target.value)}
                        placeholder="e.g. Patents, Trademarks, Industry News"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Image Cover URL</label>
                      <input
                        type="text"
                        value={blogImageUrl}
                        onChange={(e) => setBlogImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Publish Status</label>
                      <select
                        value={blogStatus}
                        onChange={(e) => setBlogStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      >
                        <option value="DRAFT">Draft (Save privately)</option>
                        <option value="PUBLISHED">Published (Go live instantly)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Short Summary description</label>
                    <textarea
                      required
                      rows="2"
                      value={blogSummary}
                      onChange={(e) => setBlogSummary(e.target.value)}
                      placeholder="Short teaser description shown in lists..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    ></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Article body content (Markdown / HTML)</label>
                    <textarea
                      required
                      rows="8"
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      placeholder="Write blog content here. Markdown headings, bold text, and code formatting are supported."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none font-mono text-[11px]"
                    ></textarea>
                  </div>

                  {/* SEO Metadata Fields */}
                  <div className="bg-slate-50 dark:bg-navy/40 p-4 rounded-md border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-[9px] tracking-wider uppercase font-bold text-gold">SEO Meta Tags Injection</span>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-450">SEO Title (Overrides Title)</label>
                      <input
                        type="text"
                        value={blogSeoTitle}
                        onChange={(e) => setBlogSeoTitle(e.target.value)}
                        placeholder="WIPO Patents Class Allocations Strategy | SR4IPR Partners"
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-450">SEO Description</label>
                      <textarea
                        rows="2"
                        value={blogSeoDescription}
                        onChange={(e) => setBlogSeoDescription(e.target.value)}
                        placeholder="Search engine search listing meta description..."
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-grow py-2 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded"
                    >
                      {isEditingBlog ? 'Save Article' : 'Publish Article'}
                    </button>
                    {isEditingBlog && (
                      <button
                        type="button"
                        onClick={resetBlogForm}
                        className="px-4 py-2 border border-slate-300 rounded font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: Global Site Settings Panel */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Global Site Settings</h1>
            
            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-lg shadow-sm max-w-3xl">
              <form onSubmit={handleSaveSettings} className="space-y-6 text-xs font-sans">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550 font-sans">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      placeholder="consult@sr4ipr.com"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550 font-sans">Contact Phone / Helpline</label>
                    <input
                      type="text"
                      required
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      placeholder="+91 22 5543-0980"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550 font-sans">Corporate Headquarters Address</label>
                  <input
                    type="text"
                    required
                    value={settingsHqAddress}
                    onChange={(e) => setSettingsHqAddress(e.target.value)}
                    placeholder="Level 14, Nariman Point, Mumbai - 400021, India"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550 font-sans">Liaison Office Address</label>
                  <input
                    type="text"
                    required
                    value={settingsLiaisonAddress}
                    onChange={(e) => setSettingsLiaisonAddress(e.target.value)}
                    placeholder="Canary Wharf, London E14, UK"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550 font-sans">Footer Copyright Text</label>
                  <input
                    type="text"
                    required
                    value={settingsCopyright}
                    onChange={(e) => setSettingsCopyright(e.target.value)}
                    placeholder="SR4IPR Partners. All Rights Reserved."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="bg-slate-50 dark:bg-navy/40 p-4 rounded-md border border-slate-200 dark:border-slate-800 space-y-4">
                  <span className="text-[10px] tracking-wider uppercase font-bold text-gold font-serif">Social Media Links</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-450">LinkedIn URL</label>
                      <input
                        type="url"
                        value={settingsLinkedin}
                        onChange={(e) => setSettingsLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/company/sr4ipr"
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-450">Twitter URL</label>
                      <input
                        type="url"
                        value={settingsTwitter}
                        onChange={(e) => setSettingsTwitter(e.target.value)}
                        placeholder="https://twitter.com/sr4ipr"
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-450">Facebook URL</label>
                      <input
                        type="url"
                        value={settingsFacebook}
                        onChange={(e) => setSettingsFacebook(e.target.value)}
                        placeholder="https://facebook.com/sr4ipr"
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-navy border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded shadow hover:opacity-90 transition-all font-serif"
                >
                  Save Global Site Settings
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
