
import React, { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import {
  Shield,
  ShieldOff,
  AlertOctagon,
  Activity,
  Clock,
  Lock,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { socket } from "../utils/socket";
import { AuthContext } from "../context/AuthContext";

const Security = () => {
  const { user } = useContext(AuthContext);

  const [blockedIps, setBlockedIps] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unblocking, setUnblocking] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [blockedRes, historyRes, statsRes] = await Promise.all([
        api.get("/security/blocked-ips"),
        api.get("/security/login-history?type=attacks"),
        api.get("/security/security-score")
      ]);

      setBlockedIps(blockedRes.data || []);
      setLoginHistory(historyRes.data || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error(error);
      toast.error("Failed to load security data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user?.id) {
      socket.emit("join_user_room", user.id);
    }

    socket.on("new_attack", (data) => {
      toast.error(`[AI Alert] ${data.attackType} from ${data.ip}`, {
        icon: "🚨",
        duration: 5000
      });

      setLoginHistory((prev) => {
        if (prev.some(p => p.ip === data.ip && p.createdAt === data.time)) return prev;
        return [
          {
            ip: data.ip,
            attackType: data.attackType,
            severity: data.severity,
            status: "failed",
            country: data.country || "Unknown",
            createdAt: data.time
          },
          ...prev
        ];
      });

      fetchData();
    });

    return () => {
      socket.off("new_attack");
    };
  }, [user]);

  const handleUnblock = async (ip) => {
    if (!window.confirm(`Unblock ${ip}?`)) return;

    try {
      setUnblocking(ip);

      await api.post("/security/unblock-ip", { ip });

      toast.success(`IP ${ip} unblocked`);
      fetchData();
    } catch (error) {
      toast.error("Failed to unblock IP");
    } finally {
      setUnblocking(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center bg-cyber-800/50 p-6 rounded-lg border border-cyber-600 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono text-white">
            ATTACK<span className="text-cyber-danger">_MONITOR</span>
          </h1>
        </div>

        <button onClick={fetchData}>
          <RefreshCw
            className={`w-6 h-6 text-cyber-primary ${loading ? "animate-spin" : ""
              }`}
          />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cyber-card p-6 border-t-4 border-cyber-danger">
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon className="text-cyber-danger w-7 h-7" />
            <h3 className="text-gray-400 font-mono text-sm uppercase tracking-wider">Blocked IPs</h3>
          </div>
          <p className="text-4xl font-bold text-cyber-danger">
            {blockedIps.length}
          </p>
        </div>

        <div className="cyber-card p-6 border-t-4 border-cyber-warning">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="text-cyber-warning w-7 h-7" />
            <h3 className="text-gray-400 font-mono text-sm uppercase tracking-wider">Threat Count</h3>
          </div>
          <p className="text-4xl font-bold text-cyber-warning">
            {stats?.threatCount || 0}
          </p>
        </div>

        <div className="cyber-card p-6 border-t-4 border-cyber-success">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="text-cyber-success w-7 h-7" />
            <h3 className="text-gray-400 font-mono text-sm uppercase tracking-wider">Security Score</h3>
          </div>
          <p className="text-4xl font-bold text-cyber-success">
            {stats?.securityScore || 100}/100
          </p>
        </div>
      </div>

      {/* Blocked IP Table */}
      <motion.div className="cyber-card overflow-hidden">
        <div className="p-5 border-b border-cyber-600">
          <h2 className="text-xl font-mono text-white">
            BLOCKED_IP_LIST
          </h2>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr>
              <th>IP</th>
              <th>Blocked Until</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {blockedIps.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500 font-mono">
                  No blocked IPs currently.
                </td>
              </tr>
            ) : (
              blockedIps.map((b) => (
              <tr key={b._id}>
                <td>{b.ip}</td>
                <td>
                  {b.blockedUntil
                    ? new Date(b.blockedUntil).toLocaleString()
                    : "Permanent"}
                </td>
                <td>
                  <button
                    onClick={() => handleUnblock(b.ip)}
                  >
                    {unblocking === b.ip ? "..." : "Unblock"}
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </motion.div>

      {/* Attack Logs */}
      <motion.div className="cyber-card overflow-hidden">
        <div className="p-5 border-b border-cyber-600">
          <h2 className="text-xl font-mono text-white">
            RECENT_ATTACK_LOGS
          </h2>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr>
              <th>IP</th>
              <th>Country</th>
              <th>Attack</th>
              <th>Severity</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {loginHistory.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500 font-mono">
                  No recent attacks detected.
                </td>
              </tr>
            ) : (
              loginHistory.map((log, index) => (
              <tr key={index}>
                <td>{log.ip}</td>
                <td>
                  {log.country || "Unknown"}
                </td>
                <td>{log.attackType}</td>
                <td>{log.severity}</td>
                <td>
                  {new Date(
                    log.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Security;