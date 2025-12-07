import { useState } from "react";
import { Users, Wallet, Settings, Activity } from "lucide-react";
import Activities from "./Activities";
import SettingsTab from "./SettingsTab";
import Wallets from "./Wallets";
import Sponsors from "./Sponsors";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import Overview from "./Overview";
import AllLockedWallets from "./AllLockedWallets";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = [
    { key: "sponsors", label: "Sponsors", icon: Users },
    { key: "wallets", label: "Wallets", icon: Wallet },
    { key: "all_locked_wallets", label: "All Locked Wallets", icon: Wallet },
    { key: "settings", label: "Settings", icon: Settings },
    { key: "activities", label: "Activities", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} setActiveTab={setActiveTab} />

      {/* Shell */}
      <div className="flex">
        
        <Sidebar sidebarOpen={sidebarOpen} nav={nav} activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />

        {/* Main content */}
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">
          { activeTab === 'overview' && <Overview /> }

          {/* Tab content */}
          {activeTab === "sponsors" && <Sponsors />}
          {activeTab === "wallets" && <Wallets />}
          {activeTab === "settings" && <SettingsTab />}
          {activeTab === "activities" && <Activities />}
          {activeTab === "all_locked_wallets" && <AllLockedWallets />}
        </main>
      </div>
    </div>
  );
}
