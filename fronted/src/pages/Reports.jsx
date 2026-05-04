import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { BarChart3, PieChart as PieIcon, Activity, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get('/reports/attack-summary');
        setReportData(res.data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const handleDownload = async (type) => {
    try {
      const res = await api.get(`/reports/${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attack_report.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !reportData) {
    return (
      <div className="flex h-full items-center justify-center">
        <Activity className="animate-spin text-cyber-primary w-12 h-12" />
      </div>
    );
  }

  const barChartData = {
    labels: reportData?.attackTypes?.map(a => a.type) || [],
    datasets: [
      {
        label: 'Attempted Breaches',
        data: reportData?.attackTypes?.map(a => a.count) || [],
        backgroundColor: 'rgba(0, 240, 255, 0.6)',
        borderColor: '#00F0FF',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(0, 240, 255, 0.9)',
        borderRadius: 4,
      }
    ]
  };

  const pieChartData = {
    labels: reportData?.locations?.map(l => l.country) || [],
    datasets: [
      {
        data: reportData?.locations?.map(l => l.count) || [],
        backgroundColor: [
          '#FF003C', '#7000FF', '#00F0FF', '#00FF66', '#FFD700'
        ],
        borderColor: '#060B14',
        borderWidth: 2,
        hoverOffset: 10,
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e5e7eb', font: { family: 'Fira Code' } } },
      tooltip: {
        backgroundColor: 'rgba(13, 21, 36, 0.9)',
        titleColor: '#00F0FF',
        bodyColor: '#e5e7eb',
        borderColor: '#1B2943',
        borderWidth: 1,
        titleFont: { family: 'Fira Code' },
        bodyFont: { family: 'Fira Code' }
      }
    }
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      y: { grid: { color: '#1B2943', drawBorder: false }, ticks: { color: '#9ca3af', font: { family: 'Fira Code' } } },
      x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { family: 'Fira Code' } } }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center bg-cyber-800/50 p-6 rounded-lg border border-cyber-600 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-wider text-white">ANALYTICS<span className="text-cyber-primary">_REPORT</span></h1>
          <p className="text-gray-400 mt-1 font-mono text-sm">Comprehensive visual breakdown of threat data</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex gap-2">
            <button onClick={() => handleDownload('pdf')} className="flex items-center gap-2 bg-cyber-primary/10 border border-cyber-primary text-cyber-primary px-4 py-2 rounded font-mono text-xs uppercase tracking-wider font-bold hover:bg-cyber-primary hover:text-black transition-colors">
              <Download className="w-4 h-4" /> PDF Report
            </button>
            <button onClick={() => handleDownload('csv')} className="flex items-center gap-2 bg-cyber-secondary/10 border border-cyber-secondary text-cyber-secondary px-4 py-2 rounded font-mono text-xs uppercase tracking-wider font-bold hover:bg-cyber-secondary hover:text-black transition-colors">
              <Download className="w-4 h-4" /> CSV Report
            </button>
          </div>
          <div className="flex items-center space-x-3 bg-cyber-900 border border-cyber-secondary p-3 rounded-md shadow-[0_0_15px_rgba(112,0,255,0.2)] hidden md:flex">
            <BarChart3 className="text-cyber-secondary w-6 h-6 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs text-cyber-secondary font-mono uppercase tracking-widest">DATA GENERATED</span>
              <span className="text-white text-sm font-bold">REAL-TIME</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="cyber-card p-6 h-[450px] flex flex-col"
        >
          <div className="flex items-center gap-2 border-b border-cyber-600 pb-4 mb-6">
            <Activity className="text-cyber-primary w-5 h-5" />
            <h2 className="text-xl font-mono text-white tracking-widest font-bold">ATTACK_VECTORS</h2>
          </div>
          <div className="flex-1 w-full h-full relative">
            {reportData?.attackTypes?.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono">No attack data available</div>
            ) : (
              <Bar data={barChartData} options={barOptions} />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="cyber-card p-6 h-[450px] flex flex-col items-center"
        >
          <div className="flex items-center gap-2 border-b border-cyber-600 pb-4 mb-6 w-full">
            <PieIcon className="text-cyber-secondary w-5 h-5" />
            <h2 className="text-xl font-mono text-white tracking-widest font-bold">ORIGIN_GEOMETRY</h2>
          </div>
          <div className="flex-1 w-full max-w-sm h-full relative">
            {reportData?.locations?.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono">No origin data available</div>
            ) : (
              <Doughnut data={pieChartData} options={commonOptions} />
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="cyber-card p-6 border-t-4 border-cyber-primary bg-cyber-800/80"
      >
        <h3 className="text-lg font-bold font-mono text-cyber-primary mb-2">INTELLIGENCE SUMMARY</h3>
        <p className="text-gray-400 font-mono text-sm leading-relaxed">
          Analysis indicates a 42% increase in Brute Force vectors attempting to bypass authentication barriers.
          The origin map shows concentrated activity from targeted regions matching known botnet topologies.
          System defenses successfully mitigated 100% of unauthorized entry attempts.
          Recommendation: Maintain current zero-trust posture and monitor newly established domains.
        </p>
      </motion.div>
    </div>
  );
};

export default Reports;
