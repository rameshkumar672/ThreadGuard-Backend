import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Users, Globe, Activity, MapPin, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const WebsiteUsers = () => {
  const [websites, setWebsites] = useState([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingWebsites, setLoadingWebsites] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);

  const fetchWebsites = async () => {
    try {
      setLoadingWebsites(true);
      const res = await api.get("/websites");
      const list = res.data.websites || res.data || [];
      setWebsites(list);
      if (list.length > 0 && !selectedWebsiteId) {
        setSelectedWebsiteId(list[0]._id);
      }
    } catch (error) {
      toast.error("Failed to load websites.");
    } finally {
      setLoadingWebsites(false);
    }
  };

  const fetchUsers = async (websiteId) => {
    if (!websiteId) return;
    try {
      setLoadingUsers(true);
      const res = await api.get(`/security/website-users/${websiteId}`);
      setUsers(res.data || []);
      setExpandedUserId(null); // Reset expansion on change
    } catch (error) {
      toast.error("Failed to load website users.");
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  useEffect(() => {
    if (selectedWebsiteId) {
      fetchUsers(selectedWebsiteId);
    }
  }, [selectedWebsiteId]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center bg-cyber-800/50 p-6 rounded-lg border border-cyber-600 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-wider text-white">
            WEBSITE<span className="text-cyber-primary">_USERS</span>
          </h1>
          <p className="text-gray-400 mt-1 font-mono text-sm">
            Isolated user telemetry per protected website.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-cyber-900 border border-cyber-secondary p-3 rounded-md shadow-[0_0_12px_rgba(112,0,255,0.2)]">
          <Users className="text-cyber-secondary w-5 h-5" />
          <div>
            <span className="text-xs text-cyber-secondary font-mono uppercase block">Total Tracked</span>
            <span className="text-white text-sm font-bold">{users.length} Users</span>
          </div>
        </div>
      </div>

      {/* Website Tabs */}
      <div className="cyber-card p-4">
        <h2 className="text-sm font-mono text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyber-primary" /> Select Website Domain
        </h2>
        
        {loadingWebsites ? (
          <div className="flex items-center gap-2 text-cyber-primary font-mono text-sm">
            <RefreshCw className="animate-spin w-4 h-4" /> Loading sites...
          </div>
        ) : websites.length === 0 ? (
          <div className="text-gray-500 font-mono text-sm">No protected websites found. Add one in Protected Sites.</div>
        ) : (
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin">
            {websites.map((site) => (
              <button
                key={site._id}
                onClick={() => setSelectedWebsiteId(site._id)}
                className={`flex-shrink-0 px-5 py-3 rounded-md border font-mono text-sm transition-all flex items-center gap-2 ${
                  selectedWebsiteId === site._id
                    ? "bg-cyber-primary/10 border-cyber-primary text-cyber-primary shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                    : "bg-cyber-900 border-cyber-600 text-gray-400 hover:border-cyber-primary/50 hover:text-gray-200"
                }`}
              >
                {site.siteName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User List Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="cyber-card overflow-hidden">
        <div className="p-5 border-b border-cyber-600 flex justify-between items-center bg-cyber-800/80">
          <h2 className="text-lg font-mono text-white tracking-widest font-bold">USER_TELEMETRY</h2>
          <button onClick={() => fetchUsers(selectedWebsiteId)} disabled={!selectedWebsiteId || loadingUsers} className="text-cyber-primary hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loadingUsers ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm border-collapse">
            <thead>
              <tr className="text-gray-400 bg-cyber-900 border-b border-cyber-600 uppercase tracking-wider font-normal text-xs">
                <th className="py-4 px-5">User</th>
                <th className="py-4 px-5 text-center">Logins (Total/Success/Fail)</th>
                <th className="py-4 px-5 text-center">Attacks</th>
                <th className="py-4 px-5">Latest Location</th>
                <th className="py-4 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-600/50">
              {loadingUsers ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <RefreshCw className="animate-spin w-6 h-6 mx-auto mb-3 text-cyber-primary" />
                    Loading user telemetry...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 font-mono">
                    <Users className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    No users tracked for this website yet.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <React.Fragment key={user._id}>
                    <tr className="hover:bg-cyber-700/30 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-white mb-1">{user.name}</div>
                        <div className="text-xs text-cyber-primary/70">{user.email}</div>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className="text-gray-300 font-bold">{user.totalLogins}</span>
                        <span className="text-gray-500 mx-1">/</span>
                        <span className="text-cyber-success">{user.successfulLogins}</span>
                        <span className="text-gray-500 mx-1">/</span>
                        <span className="text-cyber-danger">{user.failedLogins}</span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        {user.attackCount > 0 ? (
                          <span className="bg-cyber-danger/10 text-cyber-danger border border-cyber-danger/30 px-2 py-1 rounded text-xs font-bold">
                            {user.attackCount} Detected
                          </span>
                        ) : (
                          <span className="text-cyber-success text-xs">0 (Safe)</span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="w-3.5 h-3.5 text-cyber-warning" />
                          {user.lastAttackLocation !== "None" ? user.lastAttackLocation : "N/A"}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setExpandedUserId(expandedUserId === user._id ? null : user._id)}
                          className="text-cyber-primary hover:text-white p-1"
                        >
                          {expandedUserId === user._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Detail Panel */}
                    <AnimatePresence>
                      {expandedUserId === user._id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-cyber-900/50"
                        >
                          <td colSpan={5} className="p-0 border-b-0">
                            <div className="p-6 border-l-2 border-cyber-primary bg-black/20 m-4 rounded">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {/* Info Block */}
                                <div className="space-y-3">
                                  <h4 className="text-xs text-cyber-primary font-bold uppercase tracking-wider mb-2">Profile Overview</h4>
                                  <div className="flex justify-between border-b border-cyber-600/30 pb-1">
                                    <span className="text-gray-500">Last Login:</span>
                                    <span className="text-gray-300 text-xs">{new Date(user.lastLogin).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-cyber-600/30 pb-1">
                                    <span className="text-gray-500">Total Attacks:</span>
                                    <span className="text-cyber-danger font-bold">{user.attackCount}</span>
                                  </div>
                                  <div className="flex justify-between pb-1">
                                    <span className="text-gray-500">Account Standing:</span>
                                    <span className={user.attackCount > 0 ? "text-cyber-warning" : "text-cyber-success"}>
                                      {user.attackCount > 0 ? "Compromised" : "Secure"}
                                    </span>
                                  </div>
                                </div>

                                {/* Attack Types */}
                                <div>
                                  <h4 className="text-xs text-cyber-primary font-bold uppercase tracking-wider mb-3">Attack Vectors Used</h4>
                                  {user.attackTypes.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                      {user.attackTypes.map((type, i) => (
                                        <span key={i} className="bg-cyber-danger/10 border border-cyber-danger/30 text-cyber-danger px-2.5 py-1 rounded text-xs">
                                          {type}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500 text-xs italic">No attacks detected for this user.</span>
                                  )}
                                </div>

                                {/* Locations */}
                                <div>
                                  <h4 className="text-xs text-cyber-primary font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5" /> All Attack Origins
                                  </h4>
                                  {user.attackLocations.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                      {user.attackLocations.map((loc, i) => (
                                        <span key={i} className="bg-cyber-warning/10 border border-cyber-warning/30 text-cyber-warning px-2.5 py-1 rounded text-xs flex items-center gap-1">
                                          {loc === "Unknown" ? "Unknown (VPN/Proxy)" : loc}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500 text-xs italic">No location data available.</span>
                                  )}
                                </div>

                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

export default WebsiteUsers;
