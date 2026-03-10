import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CATEGORIES = ['All', 'Graphic Design', 'UI/UX', 'Illustration', 'Photography', 'Videography', 'Branding', 'Motion', 'Fine Art'];
const BUDGETS = ['All', 'Under 5K', '5K–20K', '20K–50K', '50K+'];

function JobCard({ job }) {
  const timeAgo = (date) => {
    const d = Math.floor((Date.now() - new Date(date)) / 86400000);
    return d === 0 ? 'Today' : `${d}d ago`;
  };
  return (
    <div className="glass rounded-2xl p-5 hover:border-umoja-gold/25 transition-all hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${job.status === 'open' ? 'bg-green-400' : 'bg-umoja-muted'}`} />
            <span className="text-xs text-umoja-muted capitalize">{job.status}</span>
            <span className="text-xs text-umoja-muted">· {timeAgo(job.createdAt)}</span>
          </div>
          <h3 className="font-display font-600 text-base text-umoja-cream group-hover:text-umoja-gold transition-colors leading-tight">{job.title}</h3>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-display font-700 text-umoja-gold">KES {job.budget?.toLocaleString()}</div>
          <div className="text-xs text-umoja-muted">{job.budgetType || 'Fixed'}</div>
        </div>
      </div>

      <p className="text-sm text-umoja-muted line-clamp-2 mb-4 leading-relaxed">{job.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {job.tags?.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-umoja-muted">{job.proposals || 0} proposals</span>
          <Link to={`/jobs/${job._id}`} className="px-3 py-1.5 rounded-lg bg-umoja-gold/10 border border-umoja-gold/20 text-umoja-gold text-xs font-semibold hover:bg-umoja-gold hover:text-umoja-dark transition-all">
            Apply →
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-umoja-gold/8">
        <div className="w-6 h-6 rounded-full bg-umoja-gold/20 flex items-center justify-center text-umoja-gold text-xs font-bold">
          {job.postedBy?.name?.[0] || 'U'}
        </div>
        <span className="text-xs text-umoja-muted">{job.postedBy?.name || 'Anonymous'}</span>
        {job.postedBy?.verified && <span className="text-xs text-umoja-gold">✓ Verified</span>}
        <span className="ml-auto text-xs text-umoja-muted">{job.location || 'Remote'}</span>
      </div>
    </div>
  );
}

export default function JobBoard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [budget, setBudget] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 9 };
    if (search) params.q = search;
    if (category !== 'All') params.category = category;
    if (budget !== 'All') params.budget = budget;

    axios.get('/api/jobs', { params })
      .then(r => { setJobs(r.data.jobs || []); setTotal(r.data.total || 0); })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [search, category, budget, page]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-700 text-3xl sm:text-4xl">Job Board</h1>
          <p className="text-umoja-muted text-sm mt-1">{total} opportunities across East Africa</p>
        </div>
        {user && (
          <Link to="/jobs/post" className="px-5 py-2.5 rounded-xl bg-umoja-gold text-umoja-dark font-semibold text-sm hover:bg-umoja-gold-light transition-all shrink-0">
            + Post a Job
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="glass rounded-2xl p-4 mb-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-umoja-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search jobs, skills, companies..."
              className="w-full bg-umoja-dark/50 border border-umoja-gold/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-umoja-cream placeholder-umoja-muted focus:outline-none focus:border-umoja-gold/40 transition-colors"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => { setCategory(c); setPage(1); }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${category === c ? 'bg-umoja-gold text-umoja-dark' : 'border border-umoja-gold/20 text-umoja-muted hover:text-umoja-cream'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Budget filter */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          <span className="text-xs text-umoja-muted flex-shrink-0 flex items-center">Budget:</span>
          {BUDGETS.map(b => (
            <button key={b} onClick={() => { setBudget(b); setPage(1); }}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs transition-all ${budget === b ? 'bg-umoja-terra/80 text-umoja-cream' : 'border border-umoja-gold/15 text-umoja-muted hover:text-umoja-cream'}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="loader" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="font-display font-600 text-xl mb-2">No jobs found</h3>
          <p className="text-umoja-muted text-sm">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job, i) => (
              <div key={job._id} className={`opacity-0 anim-up delay-${(i % 3) + 1}`} style={{ animationFillMode: 'forwards' }}>
                <JobCard job={job} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {total > 9 && (
            <div className="flex justify-center gap-2 mt-10">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-lg border border-umoja-gold/20 text-sm text-umoja-muted hover:text-umoja-cream disabled:opacity-40 transition-colors">
                ← Prev
              </button>
              <span className="px-4 py-2 text-sm text-umoja-muted">Page {page} of {Math.ceil(total / 9)}</span>
              <button disabled={page >= Math.ceil(total / 9)} onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-lg border border-umoja-gold/20 text-sm text-umoja-muted hover:text-umoja-cream disabled:opacity-40 transition-colors">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
