import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  Globe, Plus, Trash2, Shield, Activity, RefreshCw,
  Key, Copy, CheckCircle, Code2, BookOpen, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════
//  Integration code snippets for each language
// ═══════════════════════════════════════════════════════════
const getSnippets = (apiKey = 'YOUR_API_KEY') => ({
  'cURL': `curl -X POST https://your-threatguard-server/api/protect/login-attempt \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{
    "email": "user@example.com",
    "ip": "203.0.113.42",
    "status": "failed"
  }'`,

  'Node.js': `const axios = require('axios');

// Call this inside your website's login route handler
async function reportLoginAttempt(email, ip, success) {
  await axios.post(
    'https://your-threatguard-server/api/protect/login-attempt',
    { email, ip, status: success ? 'success' : 'failed' },
    { headers: { 'x-api-key': '${apiKey}' } }
  );
}`,

  'Python': `import requests

def report_login_attempt(email: str, ip: str, success: bool):
    """Call this inside your website's login view."""
    requests.post(
        'https://your-threatguard-server/api/protect/login-attempt',
        json={
            'email': email,
            'ip': ip,
            'status': 'success' if success else 'failed'
        },
        headers={'x-api-key': '${apiKey}'}
    )`,

  'PHP': `<?php
function reportLoginAttempt(string $email, string $ip, bool $success): void {
    $ch = curl_init('https://your-threatguard-server/api/protect/login-attempt');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'x-api-key: ${apiKey}',
        ],
        CURLOPT_POSTFIELDS => json_encode([
            'email'  => $email,
            'ip'     => $ip,
            'status' => $success ? 'success' : 'failed',
        ]),
    ]);
    curl_exec($ch);
    curl_close($ch);
}`,

  'Java': `import java.net.URI;
import java.net.http.*;
import java.net.http.HttpRequest.BodyPublishers;

public class ThreatGuard {
    private static final String API_KEY = "${apiKey}";
    private static final HttpClient client = HttpClient.newHttpClient();

    public static void reportLoginAttempt(String email, String ip, boolean success)
            throws Exception {
        String body = String.format(
            "{\\"email\\":\\"%s\\",\\"ip\\":\\"%s\\",\\"status\\":\\"%s\\"}",
            email, ip, success ? "success" : "failed"
        );
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://your-threatguard-server/api/protect/login-attempt"))
            .header("Content-Type", "application/json")
            .header("x-api-key", API_KEY)
            .POST(BodyPublishers.ofString(body))
            .build();
        client.send(request, HttpResponse.BodyHandlers.discarding());
    }
}`,

  '.NET / C#': `using System.Net.Http;
using System.Text;
using System.Text.Json;

public class ThreatGuardClient
{
    private static readonly HttpClient _http = new();
    private const string ApiKey = "${apiKey}";

    public static async Task ReportLoginAttemptAsync(
        string email, string ip, bool success)
    {
        var payload = JsonSerializer.Serialize(new {
            email,
            ip,
            status = success ? "success" : "failed"
        });
        var request = new HttpRequestMessage(HttpMethod.Post,
            "https://your-threatguard-server/api/protect/login-attempt")
        {
            Content = new StringContent(payload, Encoding.UTF8, "application/json")
        };
        request.Headers.Add("x-api-key", ApiKey);
        await _http.SendAsync(request);
    }
}`,

  'Laravel (PHP)': `<?php
// In your AuthController or login logic:
use Illuminate\\Support\\Facades\\Http;

function reportLoginAttempt(string $email, string $ip, bool $success): void
{
    Http::withHeaders(['x-api-key' => '${apiKey}'])
        ->post('https://your-threatguard-server/api/protect/login-attempt', [
            'email'  => $email,
            'ip'     => $ip,
            'status' => $success ? 'success' : 'failed',
        ]);
}`,

  'Django (Python)': `# In your Django login view:
import requests
from django.contrib.auth import authenticate

def login_view(request):
    email    = request.POST['email']
    password = request.POST['password']
    user     = authenticate(request, username=email, password=password)
    success  = user is not None

    # Report to ThreatGuard (non-blocking best-practice: use a task queue)
    requests.post(
        'https://your-threatguard-server/api/protect/login-attempt',
        json={'email': email, 'ip': request.META.get('REMOTE_ADDR'), 'status': 'success' if success else 'failed'},
        headers={'x-api-key': '${apiKey}'},
        timeout=3
    )
    # ... rest of your login logic`,
});

const LANG_TABS = ['cURL', 'Node.js', 'Python', 'PHP', 'Java', '.NET / C#', 'Laravel (PHP)', 'Django (Python)'];

const LANG_COLORS = {
  'cURL':           'text-cyber-warning',
  'Node.js':        'text-cyber-success',
  'Python':         'text-blue-400',
  'PHP':            'text-purple-400',
  'Java':           'text-orange-400',
  '.NET / C#':      'text-cyan-400',
  'Laravel (PHP)':  'text-red-400',
  'Django (Python)':'text-green-400',
};

// ═══════════════════════════════════════════════════════════
//  Tabbed code block component
// ═══════════════════════════════════════════════════════════
const IntegrationDocs = ({ apiKey }) => {
  const [activeTab, setActiveTab] = useState('cURL');
  const snippets = getSnippets(apiKey);

  const copyCode = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    toast.success(`${activeTab} snippet copied!`);
  };

  return (
    <div className="cyber-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-cyber-600 bg-cyber-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="text-cyber-primary w-5 h-5" />
          <h3 className="text-base font-bold font-mono text-white tracking-wider">INTEGRATION_EXAMPLES</h3>
        </div>
        <span className="text-xs font-mono text-gray-500">Works with any backend language</span>
      </div>

      {/* API reference strip */}
      <div className="px-6 py-4 bg-cyber-900/60 border-b border-cyber-600 font-mono text-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-500 uppercase tracking-wider mb-1">Endpoint</p>
          <p className="text-cyber-primary font-bold">POST /api/protect/login-attempt</p>
        </div>
        <div>
          <p className="text-gray-500 uppercase tracking-wider mb-1">Required Header</p>
          <p className="text-cyber-success">x-api-key: <span className="text-white">&lt;website-api-key&gt;</span></p>
        </div>
        <div>
          <p className="text-gray-500 uppercase tracking-wider mb-1">Body Parameters</p>
          <p className="text-white">
            <span className="text-cyber-warning">email</span>,{' '}
            <span className="text-cyber-warning">ip</span>,{' '}
            <span className="text-cyber-warning">status</span>{' '}
            <span className="text-gray-500">(success | failed)</span>
          </p>
        </div>
      </div>

      {/* Language tabs */}
      <div className="flex overflow-x-auto border-b border-cyber-600 bg-cyber-900/40 scrollbar-thin">
        {LANG_TABS.map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveTab(lang)}
            className={`px-4 py-3 text-xs font-mono font-bold whitespace-nowrap border-b-2 transition-all duration-200 flex-shrink-0
              ${activeTab === lang
                ? `border-cyber-primary ${LANG_COLORS[lang]} bg-cyber-800/60`
                : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-cyber-600'
              }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Code block */}
      <div className="relative">
        <button
          onClick={copyCode}
          className="absolute top-3 right-4 z-10 flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-cyber-primary bg-cyber-800 border border-cyber-600 hover:border-cyber-primary px-3 py-1.5 rounded transition-all"
        >
          <Copy className="w-3.5 h-3.5" /> Copy
        </button>
        <pre className="p-6 pt-10 overflow-x-auto text-sm font-mono leading-relaxed bg-cyber-900 text-gray-300 max-h-72">
          <code className={LANG_COLORS[activeTab]}>
            {snippets[activeTab]}
          </code>
        </pre>
      </div>

      {/* Footer note */}
      <div className="px-6 py-3 bg-cyber-800/40 border-t border-cyber-600 flex items-start gap-2">
        <BookOpen className="text-gray-500 w-4 h-4 mt-0.5 flex-shrink-0" />
        <p className="text-xs font-mono text-gray-500 leading-relaxed">
          ThreatGuard is a <span className="text-white">language-agnostic REST API</span>. Any backend that can make an HTTP POST request can integrate protection — regardless of your tech stack.
          Replace <span className="text-cyber-warning">your-threatguard-server</span> with your actual server URL or ngrok base URL.
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  Main Websites page
// ═══════════════════════════════════════════════════════════
const Websites = () => {
  const [websites, setWebsites]       = useState([]);
  const [newDomain, setNewDomain]     = useState('');
  const [newSiteName, setNewSiteName] = useState('');
  const [loading, setLoading]         = useState(true);
  const [adding, setAdding]           = useState(false);
  const [newlyAddedSite, setNewlyAddedSite] = useState(null);
  const [docsApiKey, setDocsApiKey]   = useState('YOUR_API_KEY');
  const [verifying, setVerifying]     = useState(false);
  const [verified, setVerified]       = useState(false);
  const [settingsSite, setSettingsSite] = useState(null);
  const [settingsLockdown, setSettingsLockdown] = useState(false);
  const [settingsRateLimit, setSettingsRateLimit] = useState(5);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchWebsites = async () => {
    setLoading(true);
    try {
      const res = await api.get('/websites');
      const list = res.data.websites || res.data || [];
      setWebsites(list);
      // Pre-fill docs with the first site's API key if available
      if (list.length > 0 && docsApiKey === 'YOUR_API_KEY') {
        setDocsApiKey(list[0].apiKey);
      }
    } catch (error) {
      toast.error('Could not load websites. Are you logged in?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWebsites(); }, []);

  const handleAddWebsite = async (e) => {
    e.preventDefault();
    if (!newSiteName || !newDomain) { toast.error('Site name and domain are required.'); return; }
    setAdding(true);
    try {
      // const res = await api.post('/websites', { siteName: newSiteName, domain: newDomain });
      const res = await api.post('/websites', {
          siteName: newSiteName,
          websiteUrl: newDomain
      });
      const site = res.data.website || res.data;
      toast.success('Website added! Your API key is ready.');
      setNewlyAddedSite(site);
      setDocsApiKey(site.apiKey); // update docs preview with real key
      setNewDomain('');
      setNewSiteName('');
      fetchWebsites();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add website.');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveWebsite = async (id) => {
    if (!window.confirm('Remove this website? Attack monitoring will stop for it.')) return;
    try {
      await api.delete(`/websites/${id}`);
      toast.success('Website removed from protection.');
      if (newlyAddedSite?._id === id) setNewlyAddedSite(null);
      fetchWebsites();
    } catch { toast.error('Failed to remove website.'); }
  };

  const copyToClipboard = (val, label = 'API key') => {
    navigator.clipboard.writeText(val);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">

      {/* ── Page Header ── */}
      <div className="flex flex-wrap justify-between items-center bg-cyber-800/50 p-6 rounded-lg border border-cyber-600 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-wider text-white">
            PROTECTED<span className="text-cyber-primary">_WEBSITES</span>
          </h1>
          <p className="text-gray-400 mt-1 font-mono text-sm">
            Add your websites. ThreatGuard monitors their users' login activity — not yours.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-cyber-900 border border-cyber-secondary p-3 rounded-md shadow-[0_0_12px_rgba(112,0,255,0.2)]">
          <Globe className="text-cyber-secondary w-5 h-5" />
          <div>
            <span className="text-xs text-cyber-secondary font-mono uppercase block">Active Zones</span>
            <span className="text-white text-sm font-bold">{websites.length} Protected</span>
          </div>
        </div>
      </div>

      {/* ── Newly Added — Step-by-step API Key Guide ── */}
      <AnimatePresence>
        {newlyAddedSite && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="cyber-card border-2 border-cyber-success overflow-hidden"
          >
            {/* Banner top bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-cyber-success/10 border-b border-cyber-success/30">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-cyber-success w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold font-mono text-cyber-success tracking-wider">
                    ✅ Website Added Successfully
                  </h3>
                  <p className="text-cyber-success/70 text-xs font-mono mt-0.5">
                    Your API key is ready. Follow the steps below to activate ThreatGuard protection.
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setNewlyAddedSite(null); setVerified(false); }}
                className="text-gray-400 hover:text-white font-mono text-xl leading-none px-2"
                title="Dismiss"
              >×</button>
            </div>

            <div className="p-6 space-y-6">
              {/* API Key display */}
              <div className="bg-cyber-900 border border-cyber-success/40 rounded-lg p-4">
                <p className="text-xs font-mono text-cyber-warning uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-cyber-success" />
                  YOUR WEBSITE API KEY — KEEP THIS SECRET
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-cyber-success font-mono text-sm break-all flex-1 select-all bg-black/30 px-3 py-2 rounded border border-cyber-success/30">
                    {newlyAddedSite.apiKey}
                  </span>
                  <button
                    onClick={() => copyToClipboard(newlyAddedSite.apiKey)}
                    className="flex items-center gap-2 text-xs font-mono font-bold text-cyber-success border border-cyber-success/50 hover:bg-cyber-success/10 px-4 py-2 rounded transition-all whitespace-nowrap"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Key
                  </button>
                </div>
                <p className="text-xs font-mono text-gray-500 leading-relaxed">
                  This key allows your website backend to communicate with ThreatGuard. Do not expose it publicly.
                </p>
              </div>

              {/* 4 numbered steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Step 1 — Download Verification File */}
                <div className="bg-cyber-900 border border-cyber-600 rounded-lg p-5">
                  <div className="w-8 h-8 rounded-full bg-cyber-primary/20 border border-cyber-primary text-cyber-primary font-bold font-mono flex items-center justify-center text-sm mb-3">1</div>
                  <h4 className="text-white font-bold font-mono text-sm mb-2">Step 1 — Download Verification File</h4>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">
                    Click the button below to download your verification file.
                  </p>
                  <div className="bg-black/40 border border-cyber-primary/20 rounded p-3 font-mono text-xs mb-3 space-y-1">
                    <p className="text-gray-500">File name:</p>
                    {/* <p className="text-cyber-warning">threatguard-verification-<span className="text-cyber-success">{newlyAddedSite.apiKey.slice(0, 6)}</span>.txt</p> */}
                    <p className="text-cyber-warning">
                      threatguard-verification-<span className="text-cyber-success">{newlyAddedSite.verificationToken}</span>.txt
                    </p>

                    <p className="text-gray-500 mt-2">File content:</p>
                    {/* <p className="text-cyber-success">{newlyAddedSite.apiKey.slice(0, 6)}</p> */}
                    <p className="text-cyber-success">{newlyAddedSite.verificationToken}</p>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed mb-2">
                    Upload this file to the <span className="text-white font-bold">ROOT folder</span> of your website. Example URL after uploading:
                  </p>
                  <p className="text-cyber-primary font-mono text-xs mb-3 break-all">
                    {/* https://yourdomain.com/threatguard-verification-{newlyAddedSite.apiKey.slice(0, 6)}.txt */}
                    https://yourdomain.com/threatguard-verification-{newlyAddedSite.verificationToken}.txt

                  </p>
                  <button
                    onClick={() => {
                      // const token = newlyAddedSite.apiKey.slice(0, 6);
                      const token = newlyAddedSite.verificationToken;
                      const blob = new Blob([token], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `threatguard-verification-${token}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success('Verification file downloaded!');
                    }}
                    className="w-full flex items-center justify-center gap-2 text-xs font-mono font-bold text-cyber-primary border border-cyber-primary/50 hover:bg-cyber-primary/10 px-4 py-2.5 rounded transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Verification File
                  </button>
                </div>

                {/* Step 2 — Verify Your Website */}
                <div className="bg-cyber-900 border border-cyber-600 rounded-lg p-5">
                  <div className="w-8 h-8 rounded-full bg-cyber-primary/20 border border-cyber-primary text-cyber-primary font-bold font-mono flex items-center justify-center text-sm mb-3">2</div>
                  <h4 className="text-white font-bold font-mono text-sm mb-2">Step 2 — Verify Your Website</h4>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">
                    After uploading the verification file, click the button below. ThreatGuard will check if the file exists on your domain.
                  </p>
                  {verified ? (
                    <div className="flex items-center gap-2 bg-cyber-success/10 border border-cyber-success/40 rounded px-4 py-3 font-mono text-xs text-cyber-success font-bold">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      Website Verified Successfully
                    </div>
                  ) : (
                    <button
                      onClick={async () => {
                        setVerifying(true);
                        try {
                          const res = await api.get(`/websites/verify/${newlyAddedSite._id}`);
                          if (res.data.success || res.data.verified || res.data.message?.includes('success')) {
                            setVerified(true);
                            toast.success('Website verified successfully!');
                            fetchWebsites();
                          }
                        } catch (err) {
                          toast.error(err.response?.data?.message || 'Verification failed');
                        } finally {
                          setVerifying(false);
                        }
                      }}
                      disabled={verifying}
                      className={`w-full flex items-center justify-center gap-2 text-xs font-mono font-bold border px-4 py-2.5 rounded transition-all
                        ${ verifying
                          ? 'opacity-50 cursor-not-allowed border-cyber-600 text-gray-500'
                          : 'text-cyber-success border-cyber-success/50 hover:bg-cyber-success/10'
                        }`}
                    >
                      {verifying ? <RefreshCw className="animate-spin w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                      {verifying ? 'Verifying...' : 'Verify Website'}
                    </button>
                  )}
                </div>

                {/* Step 3 — Connect Your Login System */}
                <div className="bg-cyber-900 border border-cyber-600 rounded-lg p-5 md:col-span-2">
                  <div className="w-8 h-8 rounded-full bg-cyber-primary/20 border border-cyber-primary text-cyber-primary font-bold font-mono flex items-center justify-center text-sm mb-3">3</div>
                  <h4 className="text-white font-bold font-mono text-sm mb-2">Step 3 — Connect Your Login System</h4>

                  {/* Intro */}
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">
                    To allow ThreatGuard to detect attacks, your website must notify ThreatGuard whenever someone tries to log in.
                    This requires adding a small code snippet to your login backend.
                    ThreatGuard uses the API key shown above to identify which website is sending login data.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Left column — where + when */}
                    <div className="space-y-4">

                      {/* Where to add */}
                      <div className="bg-black/30 border border-cyber-600/50 rounded-lg p-4">
                        <p className="text-cyber-primary font-mono text-xs font-bold uppercase tracking-wider mb-3">📂 Where to add this code</p>
                        <p className="text-gray-400 text-xs leading-relaxed mb-3">
                          Open your website backend project and find the file where your <span className="text-white font-bold">login API</span> is written.
                        </p>
                        <div className="space-y-1.5 font-mono text-xs">
                          <div className="flex justify-between items-center py-1.5 border-b border-cyber-600/30">
                            <span className="text-cyber-success font-bold">Node.js / Express</span>
                            <span className="text-gray-400 text-right text-right">
                              <span className="text-white">routes/auth.js</span><br />
                              <span className="text-gray-500">routes/authRoutes.js</span><br />
                              <span className="text-gray-500">controllers/authController.js</span>
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-cyber-600/30">
                            <span className="text-blue-400 font-bold">Python Flask</span>
                            <span className="text-white">routes/auth.py</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-cyber-600/30">
                            <span className="text-green-400 font-bold">Django</span>
                            <span className="text-white">accounts/views.py</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5">
                            <span className="text-purple-400 font-bold">PHP</span>
                            <span className="text-white">api/login.php</span>
                          </div>
                        </div>
                      </div>

                      {/* Where exactly inside the code */}
                      <div className="bg-black/30 border border-cyber-warning/20 rounded-lg p-4">
                        <p className="text-cyber-warning font-mono text-xs font-bold uppercase tracking-wider mb-3">⚡ Where exactly inside the login code</p>
                        <p className="text-gray-400 text-xs leading-relaxed mb-3">
                          Add the ThreatGuard request <span className="text-white font-bold">AFTER</span> checking the user's password.
                        </p>
                        <div className="space-y-2 font-mono text-xs">
                          {[
                            { n: '1', label: 'User enters email and password', color: 'border-cyber-600/40 text-gray-400' },
                            { n: '2', label: "Your backend checks if the password is correct", color: 'border-cyber-600/40 text-gray-400' },
                            { n: '3', label: 'Send login attempt data to ThreatGuard ← here', color: 'border-cyber-primary/40 text-cyber-primary bg-cyber-primary/5' },
                          ].map(s => (
                            <div key={s.n} className={`flex items-center gap-3 border rounded px-3 py-2 ${s.color}`}>
                              <span className="w-5 h-5 rounded-full bg-cyber-800 border border-cyber-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{s.n}</span>
                              <span>{s.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* What the API key does */}
                      <div className="bg-black/30 border border-cyber-success/20 rounded-lg p-4">
                        <p className="text-cyber-success font-mono text-xs font-bold uppercase tracking-wider mb-3">🔑 What the API key does</p>
                        <p className="text-gray-400 text-xs leading-relaxed mb-3">
                          The API key <span className="text-white font-bold">identifies your website</span>. ThreatGuard uses it to:
                        </p>
                        <ul className="space-y-1.5 font-mono text-xs text-gray-400">
                          {[
                            'Recognize which website sent the login attempt',
                            'Detect brute force attacks',
                            'Block malicious IP addresses',
                            'Record attack logs in your dashboard',
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-cyber-success mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    {/* Right column — code examples */}
                    <div className="space-y-4">

                      {/* Primary snippet */}
                      <div className="bg-black/30 border border-cyber-primary/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-cyber-primary font-mono text-xs font-bold uppercase tracking-wider">Example Node.js code</p>
                          <button
                            onClick={() => {
                              const code = `axios.post("https://your-threatguard-domain.com/api/protection/login-attempt",{\n  email: user.email,\n  status: "failed",\n  ip: req.ip\n},{\n  headers: {\n    "x-api-key": "${newlyAddedSite.apiKey}"\n  }\n})`;
                              navigator.clipboard.writeText(code);
                              toast.success('Code snippet copied!');
                            }}
                            className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-cyber-primary bg-cyber-800 border border-cyber-600 hover:border-cyber-primary px-3 py-1.5 rounded transition-all"
                          >
                            <Copy className="w-3 h-3" /> Copy Code
                          </button>
                        </div>
                        <pre className="text-cyber-success font-mono text-xs leading-relaxed whitespace-pre-wrap bg-black/40 rounded p-3 border border-cyber-primary/10">{`axios.post(
  "https://your-threatguard-domain.com/api/protection/login-attempt",
  {
    email: user.email,
    status: "failed",
    ip: req.ip
  },
  {
    headers: {
      "x-api-key": "${newlyAddedSite.apiKey}"
    }
  }
)`}</pre>
                        <p className="text-gray-500 text-xs font-mono mt-2 leading-relaxed">
                          💡 Replace <span className="text-cyber-warning">your-threatguard-domain.com</span> with your actual server URL or ngrok URL.
                        </p>
                      </div>

                      {/* Failed login example */}
                      <div className="bg-black/30 border border-cyber-danger/20 rounded-lg p-4">
                        <p className="text-cyber-danger font-mono text-xs font-bold uppercase tracking-wider mb-2">
                          ✗ Failed login — status: "failed"
                        </p>
                        <pre className="text-gray-300 font-mono text-xs leading-relaxed whitespace-pre-wrap bg-black/40 rounded p-3 border border-cyber-danger/10">{`axios.post("...api/protection/login-attempt", {
  email: email,
  status: "failed",
  ip: req.ip
}, { headers: { "x-api-key": "${newlyAddedSite.apiKey}" } })`}</pre>
                      </div>

                      {/* Successful login example */}
                      <div className="bg-black/30 border border-cyber-success/20 rounded-lg p-4">
                        <p className="text-cyber-success font-mono text-xs font-bold uppercase tracking-wider mb-2">
                          ✓ Successful login — status: "success"
                        </p>
                        <pre className="text-gray-300 font-mono text-xs leading-relaxed whitespace-pre-wrap bg-black/40 rounded p-3 border border-cyber-success/10">{`axios.post("...api/protection/login-attempt", {
  email: email,
  status: "success",
  ip: req.ip
}, { headers: { "x-api-key": "${newlyAddedSite.apiKey}" } })`}</pre>
                      </div>

                      {/* Footer note */}
                      <div className="flex items-start gap-2 bg-cyber-primary/5 border border-cyber-primary/30 rounded-lg px-4 py-3">
                        <span className="text-cyber-primary text-sm mt-0.5 flex-shrink-0">ℹ</span>
                        <p className="text-xs font-mono text-gray-300 leading-relaxed">
                          You only need to add this code inside your <span className="text-white font-bold">login API</span>. No other changes are required.
                          Once added, ThreatGuard will automatically monitor login attempts and protect your website.
                        </p>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Step 4 — ThreatGuard Protects Automatically */}
                <div className="bg-cyber-900 border border-cyber-600 rounded-lg p-5">
                  <div className="w-8 h-8 rounded-full bg-cyber-primary/20 border border-cyber-primary text-cyber-primary font-bold font-mono flex items-center justify-center text-sm mb-3">4</div>
                  <h4 className="text-white font-bold font-mono text-sm mb-2">Step 4 — ThreatGuard Protects Automatically</h4>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">
                    Once connected, ThreatGuard will automatically:
                  </p>
                  <ul className="space-y-2 text-xs font-mono">
                    <li className="flex items-start gap-2 text-gray-300 bg-cyber-danger/5 border border-cyber-danger/20 rounded px-3 py-2">
                      <span className="text-cyber-danger mt-0.5">•</span>
                      <span>Detect <strong>brute force attacks</strong></span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 bg-cyber-warning/5 border border-cyber-warning/20 rounded px-3 py-2">
                      <span className="text-cyber-warning mt-0.5">•</span>
                      <span>Block <strong>attacker IP addresses</strong> for 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 bg-cyber-success/5 border border-cyber-success/20 rounded px-3 py-2">
                      <span className="text-cyber-success mt-0.5">•</span>
                      <span>Send <strong>security alerts</strong> to affected users</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 bg-cyber-primary/5 border border-cyber-primary/20 rounded px-3 py-2">
                      <span className="text-cyber-primary mt-0.5">•</span>
                      <span>Log attacks in your <strong>ThreatGuard dashboard</strong></span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* ── Add Form + Website List ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Add Website Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="cyber-card p-6 h-fit">
          <div className="flex items-center gap-2 mb-6 border-b border-cyber-600 pb-4">
            <Shield className="text-cyber-primary w-5 h-5" />
            <h2 className="text-lg font-mono text-white tracking-widest font-bold">ADD_WEBSITE</h2>
          </div>

          <form onSubmit={handleAddWebsite} className="space-y-4">
            <div>
              <label className="text-cyber-primary font-mono text-xs uppercase tracking-wider block mb-2">Site Name / Label</label>
              <input
                type="text"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                placeholder="e.g., My Online Shop"
                className="w-full bg-cyber-900 border border-cyber-600 rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary transition-all font-mono text-sm"
                required
              />
            </div>
            <div>
              <label className="text-cyber-primary font-mono text-xs uppercase tracking-wider block mb-2">Domain</label>
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="e.g., example.com"
                className="w-full bg-cyber-900 border border-cyber-600 rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary transition-all font-mono text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={adding}
              className={`w-full bg-cyber-primary/10 border border-cyber-primary text-cyber-primary py-3 rounded font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2
                ${adding ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyber-primary hover:text-cyber-900 hover:shadow-[0_0_20px_#00F0FF]'}`}
            >
              {adding ? <RefreshCw className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {adding ? 'Adding...' : 'Add Website'}
            </button>
          </form>

          <div className="mt-5 p-4 bg-cyber-900 border border-cyber-600 rounded">
            <p className="text-xs text-gray-400 font-mono leading-relaxed">
              <span className="text-cyber-primary block mb-1">How it works</span>
              An auto-generated API key is given per website. Install it in your site's login route — ThreatGuard handles threats from there.
            </p>
          </div>
        </motion.div>

        {/* Website List */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2 cyber-card overflow-hidden flex flex-col">
          <div className="p-5 border-b border-cyber-600 flex justify-between items-center bg-cyber-800/80">
            <div className="flex items-center gap-2">
              <Activity className="text-white w-4 h-4" />
              <h2 className="text-lg font-mono text-white tracking-widest font-bold">PROTECTED_SITES</h2>
            </div>
            <button onClick={fetchWebsites} className="text-cyber-primary hover:text-white transition-colors p-1">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left font-mono text-sm border-collapse">
              <thead>
                <tr className="text-gray-400 bg-cyber-900 border-b border-cyber-600 uppercase tracking-wider font-normal text-xs">
                  <th className="py-4 px-5">Site</th>
                  <th className="py-4 px-5">Domain</th>
                  <th className="py-4 px-5">API Key</th>
                  <th className="py-4 px-5">Added</th>
                  <th className="py-4 px-5 text-right">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-600/50">
                {loading && (
                  <tr><td colSpan={5} className="py-10 text-center text-gray-500">
                    <RefreshCw className="animate-spin w-5 h-5 mx-auto mb-2 text-cyber-primary" />
                  </td></tr>
                )}
                {!loading && websites.length === 0 && (
                  <tr><td colSpan={5} className="py-12 text-center text-gray-500 font-mono">
                    <Globe className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No websites added yet
                  </td></tr>
                )}
                {websites.map((site) => (
                  <tr key={site._id} className="hover:bg-cyber-700/30 transition-colors">
                    <td className="py-4 px-5 font-bold text-white">{site.siteName}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyber-success shadow-[0_0_5px_#00FF66] animate-pulse flex-shrink-0"></div>
                        <span className="text-gray-300">{site.websiteUrl}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs truncate max-w-[100px]">{site.apiKey.slice(0, 12)}…</span>
                        <button
                          onClick={() => copyToClipboard(site.apiKey, `API key for ${site.siteName}`)}
                          className="text-cyber-primary/50 hover:text-cyber-primary transition-colors flex-shrink-0"
                          title="Copy API Key"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDocsApiKey(site.apiKey)}
                          className="text-cyber-secondary/50 hover:text-cyber-secondary transition-colors text-xs flex-shrink-0"
                          title="Preview this key in integration docs"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-gray-400 text-xs">{new Date(site.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-5 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSettingsSite(site);
                          setSettingsLockdown(site.settings?.lockdownMode || false);
                          setSettingsRateLimit(site.settings?.rateLimitThreshold || 5);
                        }}
                        className="text-cyber-primary/60 hover:text-cyber-primary p-1.5 rounded hover:bg-cyber-primary/10 border border-transparent hover:border-cyber-primary/30 transition-all"
                        title="Website Settings"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
  onClick={async () => {
    try {
      const res = await api.get(`/websites/verify/${site._id}`);
      toast.success(res.data.message || "Website verified!");
      fetchWebsites();
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  }}
  className="text-cyber-success hover:text-green-400 p-1.5 rounded"
  title="Verify Website"
>
  <CheckCircle className="w-4 h-4" />
</button>
                      <button
                        onClick={() => handleRemoveWebsite(site._id)}
                        className="text-cyber-danger/60 hover:text-cyber-danger p-1.5 rounded hover:bg-cyber-danger/10 border border-transparent hover:border-cyber-danger/30 transition-all"
                        title="Remove Website"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>


      {/* ── Settings Modal ── */}
      <AnimatePresence>
        {settingsSite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="cyber-card max-w-md w-full p-6 space-y-5"
            >
              <div className="flex justify-between items-center border-b border-cyber-600 pb-3">
                <h3 className="text-xl font-mono font-bold text-white flex items-center gap-2">
                  <Shield className="text-cyber-primary w-5 h-5" />
                  SITE_SETTINGS
                </h3>
                <button onClick={() => setSettingsSite(null)} className="text-gray-400 hover:text-white">✕</button>
              </div>

              <div className="font-mono text-xs text-cyber-primary/70">
                Configuring: <span className="text-white">{settingsSite.siteName}</span>
              </div>

              {/* Lockdown Mode */}
              <div className="flex justify-between items-center bg-cyber-900 p-4 rounded border border-cyber-600/50">
                <div>
                  <p className="text-sm font-bold text-white">Defensive Lockdown</p>
                  <p className="text-xs text-gray-400 mt-1">Block all authentications immediately.</p>
                </div>
                <button
                  onClick={() => setSettingsLockdown(!settingsLockdown)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${settingsLockdown ? 'bg-cyber-danger' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${settingsLockdown ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Rate Limit */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400">BURST THRESHOLD (Attempts/5min)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="3"
                    max="20"
                    value={settingsRateLimit}
                    onChange={(e) => setSettingsRateLimit(Number(e.target.value))}
                    className="w-full accent-cyber-primary"
                  />
                  <span className="text-cyber-primary font-bold font-mono w-10 text-right">{settingsRateLimit}</span>
                </div>
                <p className="text-gray-500 text-[10px]">Maximum allowed failures before quarantine triggers.</p>
              </div>

              <button
                onClick={async () => {
                  setSavingSettings(true);
                  try {
                    await api.put(`/websites/settings/${settingsSite._id}`, {
                      settings: {
                        lockdownMode: settingsLockdown,
                        rateLimitThreshold: settingsRateLimit
                      }
                    });
                    toast.success('Settings updated successfully!');
                    setSettingsSite(null);
                    fetchWebsites();
                  } catch (err) {
                    toast.error('Failed to update settings');
                  } finally {
                    setSavingSettings(false);
                  }
                }}
                disabled={savingSettings}
                className="w-full bg-cyber-primary/10 border border-cyber-primary text-cyber-primary py-3 rounded font-mono font-bold uppercase hover:bg-cyber-primary hover:text-cyber-900 transition-all flex items-center justify-center gap-2"
              >
                {savingSettings ? <RefreshCw className="animate-spin w-4 h-4" /> : 'Apply Settings'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Websites;
