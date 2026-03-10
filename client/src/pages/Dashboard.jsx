import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const StatCard = ({ label, value, sub, icon }) => (
  <div className="glass rounded-2xl p-5">
    <div className="flex items-start justify-between mb-4">
      <span className="text-umoja-muted text-sm">{label}</span>
      <span className="text-2xl">{icon}</span>
    </div>
    <div className="font-display font-700 text-3xl text-umoja-cream">{value}</div>
    {sub && <div className="text-xs text-umoja-muted mt-1">{sub}</div>}
  </div>
);

const QuickAction = ({ to, icon, label, desc, color }) => (
  <Link to={to} className="glass rounded-2xl p-5 hover:border-umoja-gold/30 transition-all hover:-translate-y-0.5 group">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform`}>{icon}</div>
    <div className="font-semibold text-sm text-umoja-cream">{label}</div>
    <div className="text-xs text-umoja-muted mt-1">{desc}</div>
  </Link>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [recentJobs, setRecentJobs] = useState([]);
  const [stats, setStats] = useState({ earnings: 0, activeJobs: 0, portfolio: 0, bids: 0 });

  useEffect(() => {
    axios.get('/api/dashboard/stats').then(r => setStats(r.data)).catch(() => {});
    axios.get('/api/jobs?limit=3').then(r => setRecentJobs(r.data.jobs || [])).catch(() => {});
  }, []);

  const isClient = user?.role === 'client';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">

      {/* Header */}
      <div className="mb-8 opacity-0 anim-up" style={{ animationFillMode: 'forwards' }}>
        <p className="text-umoja-muted text-sm mb-1">Welcome back,</p>
        <h1 className="font-display font-700 text-3xl sm:text-4xl">
          {user?.name || 'Creative'} <span className="text-umoja-gold">👋</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Earnings" value={`KES ${(stats.earnings || 0).toLocaleString()}`} sub="This month" icon="💰" />
        <StatCard label="Active Jobs" value={stats.activeJobs || 0} sub="In progress" icon="⚡" />
        <StatCard label="Portfolio Items" value={stats.portfolio || 0} sub="Published" icon="🖼️" />
        <StatCard label="Bids Placed" value={stats.bids || 0} sub="On auctions" icon="🔨" />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-display font-600 text-xl mb-4">Quick actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {isClient ? (
            <>
              <QuickAction to="/jobs/post" icon="📝" label="Post a Job" desc="Find talent fast" color="bg-umoja-gold/15" />
              <QuickAction to="/marketplace" icon="🛒" label="Browse Art" desc="Buy or bid" color="bg-umoja-terra/15" />
              <QuickAction to="/ai-assistant" icon="🤖" label="AI Brief" desc="Write your brief with AI" color="bg-purple-600/15" />
              <QuickAction to="/jobs" icon="👀" label="View Jobs" desc="See your listings" color="bg-blue-600/15" />
            </>
          ) : (
            <>
              <QuickAction to="/portfolio" icon="🖼️" label="Upload Work" desc="Build your portfolio" color="bg-umoja-gold/15" />
              <QuickAction to="/marketplace" icon="🏷️" label="List Art" desc="Sell or auction" color="bg-umoja-terra/15" />
              <QuickAction to="/jobs" icon="💼" label="Find Jobs" desc="Browse opportunities" color="bg-green-600/15" />
              <QuickAction to="/ai-assistant" icon="🤖" label="AI Helper" desc="Build your pitch with AI" color="bg-purple-600/15" />
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent Jobs */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-600 text-xl">Recent Jobs</h2>
            <Link to="/jobs" className="text-sm text-umoja-gold hover:text-umoja-gold-light transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentJobs.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center text-umoja-muted">
                <div className="text-3xl mb-3">📋</div>
                <p className="text-sm">No jobs yet. {isClient ? 'Post your first job!' : 'Browse available opportunities.'}</p>
                <Link to={isClient ? '/jobs/post' : '/jobs'} className="inline-block mt-4 px-5 py-2 rounded-lg bg-umoja-gold text-umoja-dark text-sm font-semibold">
                  {isClient ? 'Post a Job' : 'Browse Jobs'}
                </Link>
              </div>
            ) : recentJobs.map(job => (
              <div key={job._id} className="glass rounded-xl p-4 hover:border-umoja-gold/20 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-umoja-cream truncate">{job.title}</h3>
                    <p className="text-xs text-umoja-muted mt-1 line-clamp-1">{job.description}</p>
                    <div className="flex items-center ga
