import { useState } from "react";

import {
  User,
  Bell,
  Palette,
  BrainCircuit,
  Database,
  ShieldCheck,
  Save,
} from "lucide-react";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "Rohit Singh",
    email: "rohitsingh@example.com",
    role: "Administrator",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    match: true,
    resume: true,
  });

  const [theme, setTheme] = useState("light");

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
    },
    {
      id: "ai",
      label: "AI Settings",
      icon: BrainCircuit,
    },
    {
      id: "system",
      label: "System",
      icon: Database,
    },
  ];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your account and system preferences.
        </p>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <ShieldCheck
                size={20}
                className="text-green-600"
              />

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  System Secure
                </p>

                <p className="text-[11px] text-slate-400">
                  Your data is protected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile */}
          {activeTab === "profile" && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <h2 className="font-semibold text-slate-800">
                  Profile Settings
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Update your personal information.
                </p>
              </div>

              <div className="space-y-6 p-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                    RS
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      {profile.name}
                    </p>

                    <p className="text-sm text-slate-400">
                      {profile.role}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Role
                    </label>

                    <input
                      type="text"
                      name="role"
                      value={profile.role}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <h2 className="font-semibold text-slate-800">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Control which notifications you receive.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="flex items-center justify-between p-6">
                  <div>
                    <p className="font-medium text-slate-700">
                      Email Notifications
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Receive important updates by email.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        email: e.target.checked,
                      })
                    }
                    className="h-5 w-5 accent-indigo-600"
                  />
                </div>

                <div className="flex items-center justify-between p-6">
                  <div>
                    <p className="font-medium text-slate-700">
                      Match Notifications
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Get notified when a resume matches a job.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={notifications.match}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        match: e.target.checked,
                      })
                    }
                    className="h-5 w-5 accent-indigo-600"
                  />
                </div>

                <div className="flex items-center justify-between p-6">
                  <div>
                    <p className="font-medium text-slate-700">
                      Resume Processing
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Notify when AI resume analysis is completed.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={notifications.resume}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        resume: e.target.checked,
                      })
                    }
                    className="h-5 w-5 accent-indigo-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <h2 className="font-semibold text-slate-800">
                  Appearance
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Customize how the dashboard looks.
                </p>
              </div>

              <div className="p-6">
                <p className="mb-4 text-sm font-medium text-slate-700">
                  Theme
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={`rounded-2xl border-2 p-5 text-left transition ${
                      theme === "light"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="mb-3 h-20 rounded-xl border border-slate-200 bg-white" />

                    <p className="font-semibold text-slate-800">
                      Light
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Clean and bright interface
                    </p>
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`rounded-2xl border-2 p-5 text-left transition ${
                      theme === "dark"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="mb-3 h-20 rounded-xl bg-slate-800" />

                    <p className="font-semibold text-slate-800">
                      Dark
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Dark interface for low-light environments
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Settings */}
          {activeTab === "ai" && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <h2 className="font-semibold text-slate-800">
                  AI Settings
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Configure AI-powered resume intelligence features.
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div className="rounded-xl bg-indigo-50 p-5">
                  <div className="flex items-start gap-3">
                    <BrainCircuit
                      size={22}
                      className="mt-0.5 text-indigo-600"
                    />

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        AI Resume Analysis
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Automatically analyze resumes using AI.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    AI Model
                  </label>

                  <select
                    defaultValue="gemini"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  >
                    <option value="gemini">
                      Google Gemini
                    </option>

                    <option value="openai">
                      OpenAI
                    </option>

                    <option value="local">
                      Local Model
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Matching Threshold
                  </label>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="70"
                    className="w-full accent-indigo-600"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Candidates above this score will be considered
                    strong matches.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* System */}
          {activeTab === "system" && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <h2 className="font-semibold text-slate-800">
                  System Information
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Information about your application.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs text-slate-400">
                    Application
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    AI Resume Intelligence System
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs text-slate-400">
                    Frontend
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    React + Vite + Tailwind
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs text-slate-400">
                    Backend
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    FastAPI
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs text-slate-400">
                    Database
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    SQLite + SQLAlchemy
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs text-slate-400">
                    AI
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    Gemini AI
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-green-600">
                    System Operational
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;