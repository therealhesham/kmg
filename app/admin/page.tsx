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
                {/* Create Company Form */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4 text-[#e8d5a3]">
                    Add New Company
                  </h2>
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
                        <div className="grid grid-cols-8 gap-2">
                          {[
                            "#ffffff", "#f5f5f5", "#e5e5e5", "#d4d4d4",
                            "#030303", "#1a1a1a", "#404040", "#737373",
                            "#ef4444", "#f97316", "#f59e0b", "#eab308",
                            "#84cc16", "#22c55e", "#10b981", "#14b8a6",
                            "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
                            "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
                            "#c4a052", "#e8d5a3", "#8b7235", "#d4af37",
                            "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24",
                          ].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setCompanyForm({ ...companyForm, backgroundColor: color })}
                              className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                                companyForm.backgroundColor === color
                                  ? "border-[#c4a052] ring-2 ring-[#c4a052]/50"
                                  : "border-white/20"
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
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
                          <div className="grid grid-cols-8 gap-2">
                            {[
                              "#ffffff", "#f5f5f5", "#e5e5e5", "#d4d4d4",
                              "#030303", "#1a1a1a", "#404040", "#737373",
                              "#ef4444", "#f97316", "#f59e0b", "#eab308",
                              "#84cc16", "#22c55e", "#10b981", "#14b8a6",
                              "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
                              "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
                              "#c4a052", "#e8d5a3", "#8b7235", "#d4af37",
                              "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24",
                            ].map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setEditForm({ ...editForm, backgroundColor: color })}
                                className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                                  editForm.backgroundColor === color
                                    ? "border-[#c4a052] ring-2 ring-[#c4a052]/50"
                                    : "border-white/20"
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
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

