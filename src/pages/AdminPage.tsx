import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  Layers,
  Users,
  Settings,
  Shield,
  Download,
  RotateCcw,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { AppConfig, ServiceItem, ContactMessage } from '../types';
import { configService, SUGGESTED_SERVICE_TEMPLATES } from '../services/configService';

interface AdminPageProps {
  config: AppConfig;
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ config, onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('admin@predhanexa.in');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Active navigation tab inside admin panel
  const [activeTab, setActiveTab] = useState<
    'company' | 'founders' | 'services' | 'messages' | 'seo' | 'backup'
  >('company');

  // Form states initialized from centralized config
  const [companyForm, setCompanyForm] = useState(config.company);
  const [founderForm, setFounderForm] = useState(config.founder);
  const [coFounderForm, setCoFounderForm] = useState(config.coFounder);
  const [seoForm, setSeoForm] = useState(config.seo);
  const [servicesList, setServicesList] = useState<ServiceItem[]>(config.services);
  const [messagesList, setMessagesList] = useState<ContactMessage[]>([]);

  // Service Edit / Create Modal State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState<boolean>(false);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    category: 'Engineering',
    description: '',
    icon: 'Code2',
    image: '',
    enabled: true,
  });

  // Notification Banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  // Founder Skills temporary input
  const [founderSkillInput, setFounderSkillInput] = useState('');
  const [coFounderSkillInput, setCoFounderSkillInput] = useState('');

  // Password change state
  const [newAdminPass, setNewAdminPass] = useState('');
  const [passChangedNotice, setPassChangedNotice] = useState(false);

 useEffect(() => {
  configService.isAuthenticated().then(setIsAuthenticated);
  configService.getMessages().then(setMessagesList);
  

  const unsubscribe = configService.subscribe((updated) => {
      setCompanyForm(updated.company);
      setFounderForm(updated.founder);
      setCoFounderForm(updated.coFounder);
      setSeoForm(updated.seo);
      setServicesList(updated.services);
     configService.getMessages().then(setMessagesList);
    });
    return unsubscribe;
  }, []);

  const triggerNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const success = await configService.login(
    emailInput,
    passwordInput
  );

  if (success) {
    setIsAuthenticated(true);
    setLoginError('');
    triggerNotification('Welcome to Predhanexa Executive Administration.');
  } else {
    setLoginError('Invalid email or password.');
  }
};

  const handleLogout = async () => {
  await configService.logout();
  setIsAuthenticated(false);
};

  // Image Upload Handler (resizes/optimizes to base64 Data URL)
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerNotification('Please select a valid image file (JPEG, PNG, WebP).', 'error');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      triggerNotification('File size exceeds 5MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const optimizedUrl = canvas.toDataURL('image/webp', 0.85);
        onComplete(optimizedUrl);
        triggerNotification('Image uploaded and optimized successfully.');
      };
    };
    reader.readAsDataURL(file);
  };

  // Save Handlers
  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    configService.updateCompany(companyForm);
    triggerNotification('Company settings saved successfully.');
  };

  const handleSaveFounders = (e: React.FormEvent) => {
    e.preventDefault();
    configService.updateFounder(founderForm);
    configService.updateCoFounder(coFounderForm);
    triggerNotification('Leadership profiles updated successfully.');
  };

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    configService.updateSeo(seoForm);
    triggerNotification('SEO and Analytics settings updated.');
  };

  // Service Management
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      title: '',
      category: 'Engineering',
      description: '',
      icon: 'Code2',
      image: '',
      enabled: true,
    });
    setIsAddingService(true);
  };

  const handleOpenEditService = (srv: ServiceItem) => {
    setEditingService(srv);
    setServiceForm({
      title: srv.title,
      category: srv.category,
      description: srv.description,
      icon: srv.icon,
      image: srv.image || '',
      enabled: srv.enabled,
    });
    setIsAddingService(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title.trim()) {
      triggerNotification('Service title is required.', 'error');
      return;
    }

    if (editingService) {
      configService.updateService(editingService.id, serviceForm);
      triggerNotification(`Updated "${serviceForm.title}".`);
    } else {
      configService.addService(serviceForm);
      triggerNotification(`Created "${serviceForm.title}".`);
    }
    setIsAddingService(false);
  };

  const handleAddTemplateService = (tmpl: typeof SUGGESTED_SERVICE_TEMPLATES[0]) => {
    configService.addService({
      title: tmpl.title,
      category: tmpl.category,
      description: tmpl.description,
      icon: tmpl.icon,
      enabled: true,
    });
    triggerNotification(`Added suggested service: ${tmpl.title}`);
  };

  const handleMoveService = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= servicesList.length) return;

    const copy = [...servicesList];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    configService.reorderServices(copy.map((s) => s.id));
  };

  // Messages
  const handleMarkMessageRead = async (id: string, read: boolean) => {
  await configService.markMessageRead(id, read);
  const messages = await configService.getMessages();
  setMessagesList(messages);
};

 const handleDeleteMessage = async (id: string) => {
  await configService.deleteMessage(id);
  const messages = await configService.getMessages();
  setMessagesList(messages);
};

  // Backup / Restore
  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(configService.exportJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `predhanexa-config-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (configService.importJson(content)) {
        triggerNotification('Configuration successfully imported.');
      } else {
        triggerNotification('Failed to parse backup JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Reset configuration to default company information? Any uploaded photos or newly created services will be cleared.'
      )
    ) {
      configService.resetToDefaults();
      triggerNotification('Reset to defaults.');
    }
  };

  // If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center mx-auto text-cyan-400">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white font-display">
              Predhanexa Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Authorized access for executive leadership and directors.
            </p>
          </div>

        <form onSubmit={handleLogin} className="space-y-4">

  <div className="space-y-1.5">
    <label className="text-xs font-medium text-slate-300">
      Admin Email
    </label>

    <input
      type="email"
      required
      value={emailInput}
      onChange={(e) => setEmailInput(e.target.value)}
      placeholder="Enter admin email"
      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
    />
  </div>

  <div className="space-y-1.5">
    <label className="text-xs font-medium text-slate-300">
      Password
    </label>

    <input
      type="password"
      required
      value={passwordInput}
      onChange={(e) => setPasswordInput(e.target.value)}
      placeholder="Enter admin password"
      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
    />
  </div>

  {loginError && (
    <div className="p-3 rounded-lg bg-red-950/40 border border-red-700/50 text-xs text-red-300 flex items-center gap-2">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{loginError}</span>
    </div>
  )}

  <button
    type="submit"
    className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
  >
    <Lock className="w-4 h-4" />
    <span>Sign In</span>
  </button>

</form>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            
            <button
              onClick={() => onNavigate('/')}
              className="text-cyan-400 hover:underline"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#030712]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-sm">
              Predhanexa Management Console
            </span>
            <span className="hidden sm:inline text-xs text-slate-500 ml-2">
              · {config.company.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            View Public Site
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Floating Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom-3 ${
            notification.type === 'error'
              ? 'bg-red-950/90 border-red-700 text-red-200'
              : 'bg-cyan-950/90 border-cyan-700 text-cyan-200'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto mb-8">
          {[
            { id: 'company', label: 'Company Profile', icon: Globe },
            { id: 'founders', label: 'Founders & Leadership', icon: Users },
            { id: 'services', label: `Services (${servicesList.length})`, icon: Layers },
            {
              id: 'messages',
              label: `Inquiries (${messagesList.filter((m) => !m.read).length} Unread)`,
              icon: Mail,
            },
            { id: 'seo', label: 'SEO & Search Console', icon: FileText },
            { id: 'backup', label: 'Deployment & Backup', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Company Profile */}
        {activeTab === 'company' && (
          <form onSubmit={handleSaveCompany} className="max-w-3xl space-y-6">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white font-display border-b border-slate-800 pb-2">
                Company Legal Identity & Branding
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Company Structure</label>
                  <input
                    type="text"
                    value={companyForm.legalType}
                    onChange={(e) => setCompanyForm({ ...companyForm, legalType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-medium text-slate-300">Company Logo</label>
                <div className="flex items-center gap-4">
                  {companyForm.logo ? (
                    <div className="relative w-20 h-10 bg-slate-950 border border-slate-700 rounded-lg p-1 flex items-center justify-center">
                      <img
                        src={companyForm.logo}
                        alt="Logo Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setCompanyForm({ ...companyForm, logo: '' })}
                        className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-600 text-white"
                        title="Remove logo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-10 bg-slate-950 border border-dashed border-slate-700 rounded-lg flex items-center justify-center text-slate-500 text-[10px]">
                      No Logo
                    </div>
                  )}

                  <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 cursor-pointer inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, (url) => setCompanyForm({ ...companyForm, logo: url }))
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Tagline</label>
                <input
                  type="text"
                  value={companyForm.tagline}
                  onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Company Purpose / Description</label>
                <textarea
                  rows={3}
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white resize-y"
                />
              </div>
            </div>

            {/* Centralized Contact Information */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white font-display border-b border-slate-800 pb-2">
                Centralized Contact Configuration
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Company Email</label>
                  <input
                    type="email"
                    required
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Company Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={companyForm.phone}
                    onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Official Physical Address (Optional)</label>
                <input
                  type="text"
                  placeholder="Leave empty if not publicly configured"
                  value={companyForm.address || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Copyright Line</label>
                <input
                  type="text"
                  value={companyForm.copyright}
                  onChange={(e) => setCompanyForm({ ...companyForm, copyright: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Company Profile</span>
            </button>
          </form>
        )}

        {/* TAB 2: Founders & Leadership */}
        {activeTab === 'founders' && (
          <form onSubmit={handleSaveFounders} className="space-y-8 max-w-4xl">
            {/* Founder Card: N. Dhanush Kumar */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-base font-bold text-white font-display">
                  Founder Profile: {founderForm.name}
                </h2>
                <span className="text-xs text-cyan-400 font-mono">Primary Director</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={founderForm.name}
                    onChange={(e) => setFounderForm({ ...founderForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Designation</label>
                  <input
                    type="text"
                    value={founderForm.designation}
                    onChange={(e) => setFounderForm({ ...founderForm, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              {/* Founder Photo Upload (Zero stock photo rule) */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-medium text-slate-300">
                  Founder Photo (Must be uploaded through Admin)
                </label>
                <div className="flex items-center gap-4">
                  {founderForm.photo ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                      <img
                        src={founderForm.photo}
                        alt={founderForm.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFounderForm({ ...founderForm, photo: '' })}
                        className="absolute top-1 right-1 p-0.5 rounded bg-red-600 text-white"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-dashed border-slate-700 bg-slate-950 flex flex-col items-center justify-center text-[10px] text-slate-500">
                      <span>No Photo</span>
                    </div>
                  )}

                  <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 cursor-pointer inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Founder Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, (url) => setFounderForm({ ...founderForm, photo: url }))
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Founder DIN (Director Identification Number) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Director Identification Number (DIN)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave empty or enter valid DIN (e.g. 01234567)"
                    value={founderForm.din || ''}
                    onChange={(e) => setFounderForm({ ...founderForm, din: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    Will remain hidden from the public website until a valid number is entered here.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Founder WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={founderForm.whatsapp}
                    onChange={(e) => setFounderForm({ ...founderForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Founder Executive Email</label>
                <input
                  type="email"
                  required
                  value={founderForm.email}
                  onChange={(e) => setFounderForm({ ...founderForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              {/* Biography (Initially empty) */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Biography</label>
                <textarea
                  rows={3}
                  placeholder="Enter founder biography when available..."
                  value={founderForm.biography || ''}
                  onChange={(e) => setFounderForm({ ...founderForm, biography: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white resize-y"
                />
              </div>

              {/* Skills Tag Management */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Founder Skills / Focus Areas</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Distributed Systems, Architecture"
                    value={founderSkillInput}
                    onChange={(e) => setFounderSkillInput(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (founderSkillInput.trim()) {
                        setFounderForm({
                          ...founderForm,
                          skills: [...(founderForm.skills || []), founderSkillInput.trim()],
                        });
                        setFounderSkillInput('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                  >
                    Add Skill
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {founderForm.skills?.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5"
                    >
                      <span>{sk}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFounderForm({
                            ...founderForm,
                            skills: founderForm.skills.filter((_, i) => i !== idx),
                          })
                        }
                        className="text-slate-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Co-Founder Card: N. Prudhvi Vilas */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-base font-bold text-white font-display">
                  Co-Founder Profile: {coFounderForm.name}
                </h2>
                <span className="text-xs text-slate-400 font-mono">Executive Leadership</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={coFounderForm.name}
                    onChange={(e) => setCoFounderForm({ ...coFounderForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Designation</label>
                  <input
                    type="text"
                    value={coFounderForm.designation}
                    onChange={(e) =>
                      setCoFounderForm({ ...coFounderForm, designation: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              {/* Co-Founder Photo Upload */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-medium text-slate-300">Co-Founder Photo</label>
                <div className="flex items-center gap-4">
                  {coFounderForm.photo ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                      <img
                        src={coFounderForm.photo}
                        alt={coFounderForm.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setCoFounderForm({ ...coFounderForm, photo: '' })}
                        className="absolute top-1 right-1 p-0.5 rounded bg-red-600 text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-dashed border-slate-700 bg-slate-950 flex flex-col items-center justify-center text-[10px] text-slate-500">
                      <span>No Photo</span>
                    </div>
                  )}

                  <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 cursor-pointer inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Co-Founder Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, (url) => setCoFounderForm({ ...coFounderForm, photo: url }))
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Co-Founder Email</label>
                  <input
                    type="email"
                    placeholder="Enter email when configured"
                    value={coFounderForm.email || ''}
                    onChange={(e) => setCoFounderForm({ ...coFounderForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Co-Founder Phone</label>
                  <input
                    type="tel"
                    placeholder="Enter phone when configured"
                    value={coFounderForm.phone || ''}
                    onChange={(e) => setCoFounderForm({ ...coFounderForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Biography</label>
                <textarea
                  rows={3}
                  placeholder="Enter co-founder biography when available..."
                  value={coFounderForm.biography || ''}
                  onChange={(e) => setCoFounderForm({ ...coFounderForm, biography: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white resize-y"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Leadership Changes</span>
            </button>
          </form>
        )}

        {/* TAB 3: Dynamic Services Management */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-display">
                  Dynamic Service Catalog ({servicesList.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Manage services displayed on the public website. Add, edit, reorder, or toggle visibility.
                </p>
              </div>

              <button
                onClick={handleOpenAddService}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Service</span>
              </button>
            </div>

            {/* Suggested Templates (1-Click additions for official scope) */}
            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                1-Click Suggested Service Templates
              </span>
              <p className="text-xs text-slate-400">
                Click any category below to quickly instantiate an official service with pre-verified specifications:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTED_SERVICE_TEMPLATES.map((tmpl) => {
                  const alreadyExists = servicesList.some((s) => s.title === tmpl.title);
                  return (
                    <button
                      key={tmpl.title}
                      disabled={alreadyExists}
                      onClick={() => handleAddTemplateService(tmpl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        alreadyExists
                          ? 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200'
                      }`}
                    >
                      <Plus className="w-3 h-3 text-cyan-400" />
                      <span>{tmpl.title}</span>
                      {alreadyExists && <span className="text-[10px] text-slate-500">(Added)</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Services List Table */}
            {servicesList.length === 0 ? (
              <div className="p-12 rounded-xl bg-slate-900/30 border border-slate-800 text-center space-y-3">
                <p className="text-sm text-slate-400">
                  No services configured yet. Click "Add Custom Service" or choose from the suggested templates above.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {servicesList.map((service, index) => (
                  <div
                    key={service.id}
                    className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
                        <h3 className="text-sm font-bold text-white font-display">
                          {service.title}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {service.category}
                        </span>
                        {!service.enabled && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-950 text-yellow-400 border border-yellow-800">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Reorder Buttons */}
                      <button
                        disabled={index === 0}
                        onClick={() => handleMoveService(index, 'up')}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={index === servicesList.length - 1}
                        onClick={() => handleMoveService(index, 'down')}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Active */}
                      <button
                        onClick={() => configService.toggleService(service.id)}
                        className={`p-1.5 rounded transition-colors ${
                          service.enabled
                            ? 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
                            : 'bg-slate-950 text-slate-600 hover:text-slate-400'
                        }`}
                        title={service.enabled ? 'Disable Service' : 'Enable Service'}
                      >
                        {service.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEditService(service)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${service.title}"?`)) {
                            configService.deleteService(service.id);
                            triggerNotification('Service deleted.');
                          }
                        }}
                        className="p-1.5 rounded bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Service Edit / Create Modal */}
            {isAddingService && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
                  <h3 className="text-base font-bold text-white font-display">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h3>

                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">Service Title</label>
                      <input
                        type="text"
                        required
                        value={serviceForm.title}
                        onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        placeholder="e.g. Custom Software Development"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300">Category</label>
                        <input
                          type="text"
                          value={serviceForm.category}
                          onChange={(e) =>
                            setServiceForm({ ...serviceForm, category: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                          placeholder="e.g. Engineering"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300">Icon</label>
                        <select
                          value={serviceForm.icon}
                          onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        >
                          <option value="Code2">Code (Code2)</option>
                          <option value="Globe">Web (Globe)</option>
                          <option value="Smartphone">Mobile (Smartphone)</option>
                          <option value="Server">Backend (Server)</option>
                          <option value="Database">Database</option>
                          <option value="Cpu">Automation (Cpu)</option>
                          <option value="Wrench">Maintenance (Wrench)</option>
                          <option value="Cloud">Cloud / DevOps</option>
                          <option value="ShieldCheck">Security</option>
                          <option value="RefreshCw">Modernization</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={serviceForm.description}
                        onChange={(e) =>
                          setServiceForm({ ...serviceForm, description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white resize-y"
                        placeholder="Detailed technical deliverable description..."
                      />
                    </div>

                    {/* Service Image Upload */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-300">
                        Service Showcase Image (Optional)
                      </label>
                      <div className="flex items-center gap-3">
                        {serviceForm.image ? (
                          <div className="relative w-16 h-12 rounded overflow-hidden border border-slate-700 bg-slate-950">
                            <img
                              src={serviceForm.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setServiceForm({ ...serviceForm, image: '' })}
                              className="absolute top-0 right-0 p-0.5 bg-red-600 text-white"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ) : null}

                        <label className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer inline-flex items-center gap-1.5">
                          <Upload className="w-3 h-3" />
                          <span>Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e, (url) =>
                                setServiceForm({ ...serviceForm, image: url })
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="srv_enabled"
                        checked={serviceForm.enabled}
                        onChange={(e) =>
                          setServiceForm({ ...serviceForm, enabled: e.target.checked })
                        }
                        className="rounded border-slate-700 text-cyan-400 focus:ring-cyan-400"
                      />
                      <label htmlFor="srv_enabled" className="text-xs text-slate-300 cursor-pointer">
                        Enable this service on the public website
                      </label>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsAddingService(false)}
                        className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-900 rounded-lg"
                      >
                        {editingService ? 'Update Service' : 'Create Service'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Inquiries Inbox */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-display">
                  Client Project Inquiries ({messagesList.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Transmitted through the website contact form and direct channels.
                </p>
              </div>
            </div>

            {messagesList.length === 0 ? (
              <div className="p-12 rounded-xl bg-slate-900/30 border border-slate-800 text-center text-sm text-slate-500">
                No inquiries received yet. Inbound client inquiries will be cataloged here in real-time.
              </div>
            ) : (
              <div className="space-y-4">
                {messagesList.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-6 rounded-xl border transition-all ${
                      msg.read
                        ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                        : 'bg-slate-900/90 border-cyan-500/40 text-slate-200 shadow-md'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{msg.name}</h3>
                          {msg.company && (
                            <span className="text-xs text-slate-400">({msg.company})</span>
                          )}
                          {!msg.read && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {new Date(msg.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <a
                          href={`mailto:${msg.email}?subject=Re:%20${encodeURIComponent(msg.subject)}`}
                          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center gap-1.5"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Reply to {msg.email}</span>
                        </a>

                        {msg.phone && (
                          <a
                            href={`tel:${msg.phone}`}
                            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                        )}

                        <button
                          onClick={() => handleMarkMessage(msg.id, !msg.read)}
                          className="p-1 text-slate-400 hover:text-white"
                          title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                        >
                          {msg.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1 text-slate-500 hover:text-red-400"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 space-y-2">
                      <div className="text-xs font-semibold text-cyan-300">
                        Subject: {msg.subject}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SEO, Search Console, & Analytics */}
        {activeTab === 'seo' && (
          <form onSubmit={handleSaveSeo} className="max-w-3xl space-y-6">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white font-display border-b border-slate-800 pb-2">
                On-Page SEO & Metadata Configuration
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Default Page Title</label>
                <input
                  type="text"
                  required
                  value={seoForm.pageTitle}
                  onChange={(e) => setSeoForm({ ...seoForm, pageTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Meta Description</label>
                <textarea
                  rows={3}
                  required
                  value={seoForm.metaDescription}
                  onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white resize-y"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Meta Keywords</label>
                <input
                  type="text"
                  value={seoForm.keywords}
                  onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Canonical Website URL</label>
                <input
                  type="url"
                  value={seoForm.canonicalUrl}
                  onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Google Search Console & Google Analytics */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white font-display border-b border-slate-800 pb-2">
                Google Search Console & Analytics Integration
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Google Search Console Verification Token (GOOGLE_SITE_VERIFICATION)
                </label>
                <input
                  type="text"
                  placeholder="Paste the verification token or meta content provided by Google Search Console"
                  value={seoForm.googleSiteVerification || ''}
                  onChange={(e) =>
                    setSeoForm({ ...seoForm, googleSiteVerification: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
                <p className="text-[11px] text-slate-500">
                  When entered, the required &lt;meta name="google-site-verification" content="..."&gt; tag will automatically be rendered in the HTML head.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Google Analytics 4 Measurement ID (GOOGLE_ANALYTICS_ID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. G-ABC123XYZ"
                  value={seoForm.googleAnalyticsId || ''}
                  onChange={(e) => setSeoForm({ ...seoForm, googleAnalyticsId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
                <p className="text-[11px] text-slate-500">
                  Leave empty if not used. If provided, Google Analytics gtag.js will initialize automatically.
                </p>
              </div>
            </div>

            {/* Robots.txt and Sitemap.xml status */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h2 className="text-base font-bold text-white font-display border-b border-slate-800 pb-2">
                Search Engine Crawlers & Indexing Files
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-cyan-400 hover:underline flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect /robots.txt</span>
                </a>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-cyan-400 hover:underline flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect /sitemap.xml</span>
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save SEO & Analytics Settings</span>
            </button>
          </form>
        )}

        {/* TAB 6: Backup, Security & Netlify Deployment */}
        {activeTab === 'backup' && (
          <div className="max-w-3xl space-y-8">
            {/* Admin Security & Password Change */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white font-display border-b border-slate-800 pb-2">
                Administrative Passkey Update
              </h2>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Set New Admin Passkey</label>
                  <input
                    type="password"
                    placeholder="Enter new master password"
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
                <button
                  type="button"
                 onClick={async () => {
                    if (newAdminPass.length >= 6) {
                      const success = await configService.setAdminPassword(newAdminPass);

if (success) {
  setNewAdminPass('');
  setPassChangedNotice(true);
  setTimeout(() => setPassChangedNotice(false), 3000);
  triggerNotification('Admin password updated successfully.');
} else {
  triggerNotification('Failed to update admin password.', 'error');
}
                      setTimeout(() => setPassChangedNotice(false), 3000);
                      triggerNotification('Admin passkey updated securely.');
                    } else {
                      triggerNotification('Passkey must be at least 6 characters.', 'error');
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                >
                  Update Passkey
                </button>
                {passChangedNotice && (
                  <p className="text-xs text-emerald-400">Passkey successfully modified.</p>
                )}
              </div>
            </div>

            {/* Export & Import Backup */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white font-display border-b border-slate-800 pb-2">
                Configuration Backup & Restore
              </h2>
              <p className="text-xs text-slate-400">
                Export all company configuration, services, photos, and SEO settings into a single portable JSON file.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold text-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Configuration Backup</span>
                </button>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restore from JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleUploadBackup}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-300 text-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Verified Defaults</span>
                </button>
              </div>
            </div>

            {/* Netlify Deployment Reference */}
            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
              <h2 className="text-base font-bold text-white font-display">
                Netlify Deployment Verification
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                This project includes production-ready <span className="font-mono text-cyan-400">netlify.toml</span> with automated build directives (<span className="font-mono">npm run build</span>), publish directory (<span className="font-mono">dist</span>), SPA redirects (<span className="font-mono">/* -&gt; /index.html 200</span>), and serverless functions (<span className="font-mono">netlify/functions/contact.ts</span>).
              </p>
              <div className="p-3.5 rounded-lg bg-slate-950 font-mono text-xs text-slate-400 space-y-1">
                <div>Build Command: npm run build</div>
                <div>Publish Directory: dist</div>
                <div>Functions Directory: netlify/functions</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
