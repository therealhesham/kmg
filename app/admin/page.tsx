"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Company {
  id: string;
  name: string;
  logo: string;
  description: string | null;
  website: string | null;
  order: number;
  isActive: boolean;
  comingSoon: boolean;
  backgroundColor: string | null;
}

interface Settings {
  id: string;
  siteName: string;
  siteTagline: string;
  siteSubtagline: string;
  aboutTitle: string;
  aboutDescription: string;
  emailPlaceholder: string;
  emailButtonText: string;
  emailSuccessMsg: string;
  emailPromptMsg: string;
  portfolioTitle: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  footerText: string;
}

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  name: string | null;
  role: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"companies" | "settings" | "subscribers">("companies");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Company form state
  const [companyForm, setCompanyForm] = useState({
    name: "",
    logo: "",
    description: "",
    website: "",
    order: 0,
    comingSoon: true,
    backgroundColor: "transparent",
  });

  // Edit company state
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    logo: "",
    description: "",
    website: "",
    order: 0,
    isActive: true,
    comingSoon: true,
    backgroundColor: "transparent",
  });

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const isLoggedIn = localStorage.getItem("isLoggedIn");

      if (!isLoggedIn || !token) {
        router.push("/admin/login");
        return;
      }

      // Verify token with backend
      try {
        const res = await fetch("/api/auth/me");
        
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          // Token invalid or expired
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          router.push("/admin/login");
          return;
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/admin/login");
        return;
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  // Fetch data when tab changes
  useEffect(() => {
    if (!isCheckingAuth) {
      fetchData();
    }
  }, [activeTab, isCheckingAuth]);

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCompanyForm({ ...companyForm, logo: data.url });
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "companies") {
        // Fetch all companies for admin (including inactive ones)
        const res = await fetch("/api/companies?all=true");
        const data = await res.json();
        setCompanies(data);
      } else if (activeTab === "settings") {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setSettings(data);
      } else if (activeTab === "subscribers") {
        const res = await fetch("/api/subscribers");
        const data = await res.json();
        setSubscribers(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });

      if (res.ok) {
        alert("Company created successfully!");
        setCompanyForm({
          name: "",
          logo: "",
          description: "",
          website: "",
          order: 0,
          comingSoon: true,
          backgroundColor: "transparent",
        });
        setShowAddForm(false);
        fetchData();
      } else {
        alert("Failed to create company");
      }
    } catch (error) {
      console.error("Error creating company:", error);
      alert("Failed to create company");
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Company deleted successfully!");
        fetchData();
      } else {
        alert("Failed to delete company");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      alert("Failed to delete company");
    }
  };

  const handleEditCompany = (company: Company) => {
    setShowAddForm(false); // Close add form if open
    setEditingCompany(company);
    setEditForm({
      name: company.name,
      logo: company.logo,
      description: company.description || "",
      website: company.website || "",
      order: company.order,
      isActive: company.isActive,
      comingSoon: company.comingSoon,
      backgroundColor: company.backgroundColor || "transparent",
    });
    // Scroll to top after form opens
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;

    try {
      const res = await fetch(`/api/companies/${editingCompany.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        alert("Company updated successfully!");
        setEditingCompany(null);
        fetchData();
      } else {
        alert("Failed to update company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Failed to update company");
    }
  };

  const handleCancelEdit = () => {
    setEditingCompany(null);
    setEditForm({
      name: "",
      logo: "",
      description: "",
      website: "",
      order: 0,
      isActive: true,
      comingSoon: true,
      backgroundColor: "transparent",
    });
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setEditForm({ ...editForm, logo: data.url });
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        alert("Settings updated successfully!");
      } else {
        alert("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Header */}
      <header className="bg-[#0a0a0a] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#e8d5a3]">
            Admin Panel
          </h1>
          <div className="flex items-center gap-6">
            {user && (
              <span className="text-sm text-white/50">
                Welcome, <span className="text-[#c4a052]">{user.name || user.username}</span>
              </span>
            )}
            <a
              href="/"
              className="text-sm text-[#c4a052] hover:text-[#e8d5a3] transition-colors"
            >
              ← Back to Site
            </a>
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {["companies", "settings", "subscribers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-2 border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? "border-[#c4a052] text-[#e8d5a3]"
                    : "border-transparent text-white/50 hover:text-white/80"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-white/50">Loading...</p>
          </div>
        ) : (
          <>
            {/* Companies Tab */}
            {activeTab === "companies" && (
              <div className="space-y-8">
                {/* Add Company Button */}
                {!showAddForm && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => {
                        setEditingCompany(null); // Close edit form if open
                        setShowAddForm(true);
                        // Scroll to top after form opens
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#c4a052] to-[#8b7235] text-[#030303] font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Company
                    </button>
                  </div>
                )}

                {/* Create Company Form */}
                {showAddForm && (
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-[#e8d5a3]">
                        Add New Company
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setCompanyForm({
                            name: "",
                            logo: "",
                            description: "",
                            website: "",
                            order: 0,
                            comingSoon: true,
                            backgroundColor: "transparent",
                          });
                        }}
                        className="text-white/50 hover:text-white transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <form onSubmit={handleCreateCompany} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={companyForm.name}
                          onChange={(e) =>
                            setCompanyForm({ ...companyForm, name: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Company Logo *
                        </label>
                        <div className="space-y-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#c4a052] file:text-[#030303] file:font-medium file:cursor-pointer disabled:opacity-50"
                          />
                          {isUploading && (
                            <p className="text-sm text-[#c4a052]">Uploading...</p>
                          )}
                          {companyForm.logo && (
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 relative bg-white/[0.05] rounded-lg overflow-hidden">
                                <Image
                                  src={companyForm.logo}
                                  alt="Preview"
                                  fill
                                  className="object-contain p-2"
                                />
                              </div>
                              <span className="text-xs text-white/50 truncate flex-1">
                                {companyForm.logo}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={companyForm.website}
                          onChange={(e) =>
                            setCompanyForm({ ...companyForm, website: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Order
                        </label>
                        <input
                          type="number"
                          value={companyForm.order}
                          onChange={(e) =>
                            setCompanyForm({
                              ...companyForm,
                              order: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">
                        Description
                      </label>
                      <textarea
                        value={companyForm.description}
                        onChange={(e) =>
                          setCompanyForm({
                            ...companyForm,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-3">
                        Logo Background Color
                      </label>
                      <div className="space-y-3">
                        {/* No Color Option */}
                        <button
                          type="button"
                          onClick={() => setCompanyForm({ ...companyForm, backgroundColor: "transparent" })}
                          className={`w-full px-4 py-2 rounded-lg border-2 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
                            companyForm.backgroundColor === "transparent"
                              ? "border-[#c4a052] ring-2 ring-[#c4a052]/50 bg-[#c4a052]/10"
                              : "border-white/20 bg-white/[0.02]"
                          }`}
                        >
                          <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          <span className="text-sm text-white/70">No Background Color (Transparent)</span>
                        </button>
                        
                        {/* Color Palette */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/50">Color Palette (250+ colors)</span>
                            <span className="text-xs text-white/30">Scroll for more ↓</span>
                          </div>
                          <div className="grid grid-cols-10 gap-2 max-h-[400px] overflow-y-auto pr-2 border border-white/5 rounded-lg p-3 bg-white/[0.02]">
                          {[
                            // Whites & Grays (30 colors)
                            "#ffffff", "#fafafa", "#f5f5f5", "#f0f0f0", "#e5e5e5", "#d9d9d9", "#d4d4d4", "#cccccc", "#c0c0c0", "#b3b3b3",
                            "#a6a6a6", "#999999", "#8c8c8c", "#808080", "#737373", "#666666", "#595959", "#4d4d4d", "#404040", "#333333",
                            "#262626", "#1a1a1a", "#0d0d0d", "#030303", "#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd", "#6c757d",
                            
                            // Reds (30 colors)
                            "#fee", "#fcc", "#faa", "#f88", "#f66", "#f44", "#ef4444", "#dc2626", "#b91c1c", "#991b1b",
                            "#7f1d1d", "#450a0a", "#fca5a5", "#f87171", "#e11d48", "#be123c", "#9f1239", "#881337", "#4c0519", "#2d0a0f",
                            "#ff0000", "#cc0000", "#990000", "#660000", "#ff3333", "#ff6666", "#ff9999", "#ffcccc", "#ffe6e6", "#fff0f0",
                            
                            // Oranges (30 colors)
                            "#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12",
                            "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f", "#451a03",
                            "#ff6600", "#ff8533", "#ffa366", "#ffc299", "#ffe0cc", "#ff9500", "#ffaa33", "#ffbf66", "#ffd499", "#ffeacc",
                            
                            // Yellows & Golds (30 colors)
                            "#fefce8", "#fef9c3", "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207", "#854d0e", "#713f12",
                            "#c4a052", "#e8d5a3", "#d4af37", "#ffd700", "#ffed4e", "#fbbf25", "#f59e0c", "#8b7235", "#6b5a2d", "#4a3f1f",
                            "#ffff00", "#ffff33", "#ffff66", "#ffff99", "#ffffcc", "#ffcc00", "#ffd633", "#ffe066", "#ffeb99", "#fff5cc",
                            
                            // Greens (30 colors)
                            "#f0fdf4", "#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d",
                            "#84cc16", "#65a30d", "#4d7c0f", "#3f6212", "#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#022c22",
                            "#00ff00", "#33ff33", "#66ff66", "#99ff99", "#ccffcd", "#00cc00", "#33cc33", "#66cc66", "#99cc99", "#ccffdd",
                            
                            // Teals & Cyans (30 colors)
                            "#f0fdfa", "#ccfbf1", "#99f6e4", "#5eead4", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a",
                            "#ecfeff", "#cffafe", "#a5f3fc", "#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63",
                            "#00ffff", "#33ffff", "#66ffff", "#99ffff", "#ccffff", "#00cccc", "#33cccc", "#66cccc", "#99cccc", "#cceeff",
                            
                            // Blues (30 colors)
                            "#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a",
                            "#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e", "#082f49", "#38bdf8", "#7dd3fc", "#0891b2", "#164e63",
                            "#0000ff", "#3333ff", "#6666ff", "#9999ff", "#ccccff", "#0000cc", "#3333cc", "#6666cc", "#9999cc", "#ccddff",
                            
                            // Indigos & Purples (30 colors)
                            "#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81",
                            "#f5f3ff", "#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95",
                            "#8000ff", "#9933ff", "#b366ff", "#cc99ff", "#e6ccff", "#6600cc", "#7f33cc", "#9966cc", "#b399cc", "#cccce6",
                            
                            // Magentas & Pinks (30 colors)
                            "#fdf4ff", "#fae8ff", "#f5d0fe", "#f0abfc", "#e879f9", "#d946ef", "#c026d3", "#a21caf", "#86198f", "#701a75",
                            "#fdf2f8", "#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d", "#831843",
                            "#ff00ff", "#ff33ff", "#ff66ff", "#ff99ff", "#ffccff", "#cc00cc", "#cc33cc", "#cc66cc", "#cc99cc", "#ccbbff",
                            
                            // Browns & Earthy (30 colors)
                            "#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#b91c1c", "#7f1d1d", "#78350f", "#92400e", "#b45309", "#d97706",
                            "#a16207", "#854d0e", "#713f12", "#451a03", "#292524", "#1c1917", "#57534e", "#78716c", "#a8a29e", "#d6d3d1",
                            "#8b4513", "#a0522d", "#cd853f", "#deb887", "#f4a460", "#654321", "#704214", "#7b3f00", "#8b4514", "#9c661f",
                          ].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setCompanyForm({ ...companyForm, backgroundColor: color })}
                              className={`w-9 h-9 rounded-lg border-2 transition-all hover:scale-110 hover:z-10 relative ${
                                companyForm.backgroundColor === color
                                  ? "border-[#c4a052] ring-2 ring-[#c4a052]/50 scale-110 z-10"
                                  : "border-white/20"
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                          </div>
                        </div>
                        {/* Custom Color Input */}
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={companyForm.backgroundColor}
                            onChange={(e) =>
                              setCompanyForm({ ...companyForm, backgroundColor: e.target.value })
                            }
                            className="w-16 h-10 rounded-lg cursor-pointer border border-white/10"
                          />
                          <input
                            type="text"
                            value={companyForm.backgroundColor}
                            onChange={(e) =>
                              setCompanyForm({ ...companyForm, backgroundColor: e.target.value })
                            }
                            placeholder="#ffffff"
                            className="flex-1 px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50 font-mono text-sm"
                          />
                        </div>
                        {/* Preview */}
                        {companyForm.logo && (
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-white/50">Preview:</span>
                            <div 
                              className="w-20 h-20 relative rounded-lg overflow-hidden border border-white/10"
                              style={{ 
                                backgroundColor: companyForm.backgroundColor === "transparent" ? "transparent" : companyForm.backgroundColor,
                                backgroundImage: companyForm.backgroundColor === "transparent" 
                                  ? "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px"
                                  : "none"
                              }}
                            >
                              <Image
                                src={companyForm.logo}
                                alt="Preview"
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="comingSoon"
                        checked={companyForm.comingSoon}
                        onChange={(e) =>
                          setCompanyForm({
                            ...companyForm,
                            comingSoon: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <label htmlFor="comingSoon" className="text-sm text-white/70">
                        Show "Coming Soon" overlay
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-[#c4a052] to-[#8b7235] text-[#030303] font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Add Company
                    </button>
                  </form>
                </div>
                )}

                {/* Edit Company Form */}
                {editingCompany && (
                  <div className="bg-white/[0.03] border border-[#c4a052]/30 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-[#e8d5a3]">
                      Edit Company: {editingCompany.name}
                    </h2>
                    <form onSubmit={handleUpdateCompany} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white/70 mb-2">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/70 mb-2">
                            Company Logo *
                          </label>
                          <div className="space-y-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleEditImageUpload}
                              disabled={isUploading}
                              className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#c4a052] file:text-[#030303] file:font-medium file:cursor-pointer disabled:opacity-50"
                            />
                            {isUploading && (
                              <p className="text-sm text-[#c4a052]">Uploading...</p>
                            )}
                            {editForm.logo && (
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 relative bg-white/[0.05] rounded-lg overflow-hidden">
                                  <Image
                                    src={editForm.logo}
                                    alt="Preview"
                                    fill
                                    className="object-contain p-2"
                                  />
                                </div>
                                <span className="text-xs text-white/50 truncate flex-1">
                                  {editForm.logo}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-white/70 mb-2">
                            Website
                          </label>
                          <input
                            type="url"
                            value={editForm.website}
                            onChange={(e) =>
                              setEditForm({ ...editForm, website: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/70 mb-2">
                            Order
                          </label>
                          <input
                            type="number"
                            value={editForm.order}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                order: parseInt(e.target.value),
                              })
                            }
                            className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Description
                        </label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-3">
                          Logo Background Color
                        </label>
                        <div className="space-y-3">
                          {/* No Color Option */}
                          <button
                            type="button"
                            onClick={() => setEditForm({ ...editForm, backgroundColor: "transparent" })}
                            className={`w-full px-4 py-2 rounded-lg border-2 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
                              editForm.backgroundColor === "transparent"
                                ? "border-[#c4a052] ring-2 ring-[#c4a052]/50 bg-[#c4a052]/10"
                                : "border-white/20 bg-white/[0.02]"
                            }`}
                          >
                            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            <span className="text-sm text-white/70">No Background Color (Transparent)</span>
                          </button>
                          
                          {/* Color Palette */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/50">Color Palette (250+ colors)</span>
                              <span className="text-xs text-white/30">Scroll for more ↓</span>
                            </div>
                            <div className="grid grid-cols-10 gap-2 max-h-[400px] overflow-y-auto pr-2 border border-white/5 rounded-lg p-3 bg-white/[0.02]">
                            {[
                              // Whites & Grays (30 colors)
                              "#ffffff", "#fafafa", "#f5f5f5", "#f0f0f0", "#e5e5e5", "#d9d9d9", "#d4d4d4", "#cccccc", "#c0c0c0", "#b3b3b3",
                              "#a6a6a6", "#999999", "#8c8c8c", "#808080", "#737373", "#666666", "#595959", "#4d4d4d", "#404040", "#333333",
                              "#262626", "#1a1a1a", "#0d0d0d", "#030303", "#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd", "#6c757d",
                              
                              // Reds (30 colors)
                              "#fee", "#fcc", "#faa", "#f88", "#f66", "#f44", "#ef4444", "#dc2626", "#b91c1c", "#991b1b",
                              "#7f1d1d", "#450a0a", "#fca5a5", "#f87171", "#e11d48", "#be123c", "#9f1239", "#881337", "#4c0519", "#2d0a0f",
                              "#ff0000", "#cc0000", "#990000", "#660000", "#ff3333", "#ff6666", "#ff9999", "#ffcccc", "#ffe6e6", "#fff0f0",
                              
                              // Oranges (30 colors)
                              "#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12",
                              "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f", "#451a03",
                              "#ff6600", "#ff8533", "#ffa366", "#ffc299", "#ffe0cc", "#ff9500", "#ffaa33", "#ffbf66", "#ffd499", "#ffeacc",
                              
                              // Yellows & Golds (30 colors)
                              "#fefce8", "#fef9c3", "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207", "#854d0e", "#713f12",
                              "#c4a052", "#e8d5a3", "#d4af37", "#ffd700", "#ffed4e", "#fbbf25", "#f59e0c", "#8b7235", "#6b5a2d", "#4a3f1f",
                              "#ffff00", "#ffff33", "#ffff66", "#ffff99", "#ffffcc", "#ffcc00", "#ffd633", "#ffe066", "#ffeb99", "#fff5cc",
                              
                              // Greens (30 colors)
                              "#f0fdf4", "#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d",
                              "#84cc16", "#65a30d", "#4d7c0f", "#3f6212", "#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#022c22",
                              "#00ff00", "#33ff33", "#66ff66", "#99ff99", "#ccffcd", "#00cc00", "#33cc33", "#66cc66", "#99cc99", "#ccffdd",
                              
                              // Teals & Cyans (30 colors)
                              "#f0fdfa", "#ccfbf1", "#99f6e4", "#5eead4", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a",
                              "#ecfeff", "#cffafe", "#a5f3fc", "#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63",
                              "#00ffff", "#33ffff", "#66ffff", "#99ffff", "#ccffff", "#00cccc", "#33cccc", "#66cccc", "#99cccc", "#cceeff",
                              
                              // Blues (30 colors)
                              "#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a",
                              "#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e", "#082f49", "#38bdf8", "#7dd3fc", "#0891b2", "#164e63",
                              "#0000ff", "#3333ff", "#6666ff", "#9999ff", "#ccccff", "#0000cc", "#3333cc", "#6666cc", "#9999cc", "#ccddff",
                              
                              // Indigos & Purples (30 colors)
                              "#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81",
                              "#f5f3ff", "#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95",
                              "#8000ff", "#9933ff", "#b366ff", "#cc99ff", "#e6ccff", "#6600cc", "#7f33cc", "#9966cc", "#b399cc", "#cccce6",
                              
                              // Magentas & Pinks (30 colors)
                              "#fdf4ff", "#fae8ff", "#f5d0fe", "#f0abfc", "#e879f9", "#d946ef", "#c026d3", "#a21caf", "#86198f", "#701a75",
                              "#fdf2f8", "#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d", "#831843",
                              "#ff00ff", "#ff33ff", "#ff66ff", "#ff99ff", "#ffccff", "#cc00cc", "#cc33cc", "#cc66cc", "#cc99cc", "#ccbbff",
                              
                              // Browns & Earthy (30 colors)
                              "#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#b91c1c", "#7f1d1d", "#78350f", "#92400e", "#b45309", "#d97706",
                              "#a16207", "#854d0e", "#713f12", "#451a03", "#292524", "#1c1917", "#57534e", "#78716c", "#a8a29e", "#d6d3d1",
                              "#8b4513", "#a0522d", "#cd853f", "#deb887", "#f4a460", "#654321", "#704214", "#7b3f00", "#8b4514", "#9c661f",
                            ].map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setEditForm({ ...editForm, backgroundColor: color })}
                                className={`w-9 h-9 rounded-lg border-2 transition-all hover:scale-110 hover:z-10 relative ${
                                  editForm.backgroundColor === color
                                    ? "border-[#c4a052] ring-2 ring-[#c4a052]/50 scale-110 z-10"
                                    : "border-white/20"
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                            </div>
                          </div>
                          {/* Custom Color Input */}
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={editForm.backgroundColor}
                              onChange={(e) =>
                                setEditForm({ ...editForm, backgroundColor: e.target.value })
                              }
                              className="w-16 h-10 rounded-lg cursor-pointer border border-white/10"
                            />
                            <input
                              type="text"
                              value={editForm.backgroundColor}
                              onChange={(e) =>
                                setEditForm({ ...editForm, backgroundColor: e.target.value })
                              }
                              placeholder="#ffffff"
                              className="flex-1 px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50 font-mono text-sm"
                            />
                          </div>
                          {/* Preview */}
                          {editForm.logo && (
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-white/50">Preview:</span>
                              <div 
                                className="w-20 h-20 relative rounded-lg overflow-hidden border border-white/10"
                                style={{ 
                                  backgroundColor: editForm.backgroundColor === "transparent" ? "transparent" : editForm.backgroundColor,
                                  backgroundImage: editForm.backgroundColor === "transparent" 
                                    ? "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px"
                                    : "none"
                                }}
                              >
                                <Image
                                  src={editForm.logo}
                                  alt="Preview"
                                  fill
                                  className="object-contain p-2"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="editComingSoon"
                            checked={editForm.comingSoon}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                comingSoon: e.target.checked,
                              })
                            }
                            className="w-4 h-4"
                          />
                          <label htmlFor="editComingSoon" className="text-sm text-white/70">
                            Show "Coming Soon" overlay
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="editIsActive"
                            checked={editForm.isActive}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                isActive: e.target.checked,
                              })
                            }
                            className="w-4 h-4"
                          />
                          <label htmlFor="editIsActive" className="text-sm text-white/70">
                            Active
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-gradient-to-r from-[#c4a052] to-[#8b7235] text-[#030303] font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Update Company
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-6 py-2 bg-white/[0.05] text-white border border-white/10 font-semibold rounded-lg hover:bg-white/[0.08] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Companies List */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4 text-[#e8d5a3]">
                    Existing Companies ({companies.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companies.map((company) => (
                      <div
                        key={company.id}
                        className="bg-white/[0.02] border border-white/10 rounded-lg p-4"
                      >
                        <div 
                          className="aspect-square relative mb-3 rounded-lg overflow-hidden"
                          style={{ 
                            backgroundColor: company.backgroundColor === "transparent" ? "transparent" : (company.backgroundColor || "#ffffff"),
                            backgroundImage: company.backgroundColor === "transparent" 
                              ? "repeating-conic-gradient(#404040 0% 25%, #1a1a1a 0% 50%) 50% / 20px 20px"
                              : "none"
                          }}
                        >
                          <Image
                            src={company.logo}
                            alt={company.name}
                            fill
                            className="object-contain p-4"
                          />
                        </div>
                        <h3 className="font-semibold text-white mb-1">
                          {company.name}
                        </h3>
                        <p className="text-xs text-white/50 mb-2">
                          Order: {company.order}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {company.comingSoon && (
                            <span className="inline-block px-2 py-1 text-xs bg-[#c4a052]/20 text-[#e8d5a3] rounded">
                              Coming Soon
                            </span>
                          )}
                          {!company.isActive && (
                            <span className="inline-block px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCompany(company)}
                            className="flex-1 px-4 py-2 bg-[#c4a052]/20 text-[#e8d5a3] rounded hover:bg-[#c4a052]/30 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCompany(company.id)}
                            className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && settings && (
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#e8d5a3]">
                  Site Settings
                </h2>
                <form onSubmit={handleUpdateSettings} className="space-y-6">
                  {/* Hero Section Settings */}
                  <div className="border-b border-white/10 pb-6">
                    <h3 className="text-lg font-semibold text-[#c4a052] mb-4">Hero Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Site Name
                        </label>
                        <input
                          type="text"
                          value={settings.siteName}
                          onChange={(e) =>
                            setSettings({ ...settings, siteName: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Site Tagline
                        </label>
                        <input
                          type="text"
                          value={settings.siteTagline}
                          onChange={(e) =>
                            setSettings({ ...settings, siteTagline: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-white/70 mb-2">
                          Site Subtagline
                        </label>
                        <input
                          type="text"
                          value={settings.siteSubtagline}
                          onChange={(e) =>
                            setSettings({ ...settings, siteSubtagline: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* About Section Settings */}
                  <div className="border-b border-white/10 pb-6">
                    <h3 className="text-lg font-semibold text-[#c4a052] mb-4">About Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          About Title
                        </label>
                        <input
                          type="text"
                          value={settings.aboutTitle}
                          onChange={(e) =>
                            setSettings({ ...settings, aboutTitle: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          About Description
                        </label>
                        <textarea
                          value={settings.aboutDescription}
                          onChange={(e) =>
                            setSettings({ ...settings, aboutDescription: e.target.value })
                          }
                          rows={4}
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Section Settings */}
                  <div className="border-b border-white/10 pb-6">
                    <h3 className="text-lg font-semibold text-[#c4a052] mb-4">Email Subscription</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Email Placeholder
                        </label>
                        <input
                          type="text"
                          value={settings.emailPlaceholder}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              emailPlaceholder: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Email Button Text
                        </label>
                        <input
                          type="text"
                          value={settings.emailButtonText}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              emailButtonText: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Email Success Message
                        </label>
                        <input
                          type="text"
                          value={settings.emailSuccessMsg}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              emailSuccessMsg: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Email Prompt Message
                        </label>
                        <input
                          type="text"
                          value={settings.emailPromptMsg}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              emailPromptMsg: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Section Settings */}
                  <div className="border-b border-white/10 pb-6">
                    <h3 className="text-lg font-semibold text-[#c4a052] mb-4">Portfolio Section</h3>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">
                        Portfolio Title
                      </label>
                      <input
                        type="text"
                        value={settings.portfolioTitle}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            portfolioTitle: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                      />
                    </div>
                  </div>

                  {/* Contact Section Settings */}
                  <div className="border-b border-white/10 pb-6">
                    <h3 className="text-lg font-semibold text-[#c4a052] mb-4">Contact Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm text-white/70 mb-2">
                          Contact Title
                        </label>
                        <input
                          type="text"
                          value={settings.contactTitle}
                          onChange={(e) =>
                            setSettings({ ...settings, contactTitle: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) =>
                            setSettings({ ...settings, contactEmail: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={settings.contactPhone}
                          onChange={(e) =>
                            setSettings({ ...settings, contactPhone: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-white/70 mb-2">
                          Contact Address
                        </label>
                        <input
                          type="text"
                          value={settings.contactAddress}
                          onChange={(e) =>
                            setSettings({ ...settings, contactAddress: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Settings */}
                  <div className="pb-6">
                    <h3 className="text-lg font-semibold text-[#c4a052] mb-4">Footer</h3>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">
                        Footer Text
                      </label>
                      <input
                        type="text"
                        value={settings.footerText}
                        onChange={(e) =>
                          setSettings({ ...settings, footerText: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c4a052]/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-[#c4a052] to-[#8b7235] text-[#030303] font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Update Settings
                  </button>
                </form>
              </div>
            )}

            {/* Subscribers Tab */}
            {activeTab === "subscribers" && (
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#e8d5a3]">
                  Email Subscribers ({subscribers.length})
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white/70 font-medium">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 text-white/70 font-medium">
                          Subscribed At
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber) => (
                        <tr
                          key={subscriber.id}
                          className="border-b border-white/5 hover:bg-white/[0.02]"
                        >
                          <td className="py-3 px-4 text-white">
                            {subscriber.email}
                          </td>
                          <td className="py-3 px-4 text-white/70">
                            {new Date(subscriber.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {subscribers.length === 0 && (
                    <p className="text-center py-8 text-white/50">
                      No subscribers yet
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

