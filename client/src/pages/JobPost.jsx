import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['Graphic Design', 'UI/UX', 'Illustration', 'Photography', 'Videography', 'Branding', 'Motion Graphics', 'Fine Art', 'Other'];

export default function JobPost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    budgetType: 'fixed',
    duration: '',
    location: 'Remote',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title || !form.description || !form.budget) {
      setError('Please fill in title, description and budget.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/jobs', {
        ...form,
        budget: Number(form.budget),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      navigate('/jobs');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-700 text-3xl sm:text-4xl mb-2">Post a Job</h1>
        <p className="text-umoja-muted text-sm">Find the right creative for your project</p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-5">

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs text-umoja-muted mb-1.5">Job Title *</label>
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="e.g. Logo design for my restaurant"
            className="w-full bg-umoja-dark/50 border border-umoja-gold/15 rounded-xl px-4 py-2.5 text-sm text-umoja-cream placeholder-umoja-muted focus:outline-none focus:border-umoja-gold/40 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-umoja-muted mb-1.5">Description *</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={5}
            placeholder="Describe the project in detail. What do you need? Any specific requirements? What does success look like?"
            className="w-full bg-umoja-dark/50 border border-umoja-gold/15 rounded-xl px-4 py-2.5 text-sm text-umoja-cream placeholder-umoja-muted focus:outline-none focus:border-umoja-gold/40 transition-colors resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs text-umoja-muted mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            className="w-full bg-umoja-dark/50 border border-umoja-gold/15 rounded-xl px-4 py-2.5 text-sm text-umoja-cream focus:outline-none focus:border-umoja-gold/40 transition-colors">
            <option value="">Select a category</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-umoja-muted mb-1.5">Budget (KES) *</label>
            <input
              type="number"
              value={form.budget}
              onChange={e => set('budget', e.target.value)}
              placeholder="15000"
              className="w-full bg-umoja-dark/50 border border-umoja-gold/15 rounded-xl px-4 py-2.5 text-sm text-umoja-cream placeholder-umoja-muted focus:outline-none focus:border-umoja-gold/40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-umoja-muted mb-1.5">Budget Type</label>
            <select
              value={form.budgetType}
              onChange={e => set('budgetType', e.target.value)}
              className="w-full bg-umoja-dark/50 border border-umoja-gold/15 rounded-xl px-4 py-2.5 text-sm text-umoja-cream focus:outline-none focus:border-umoja-gold/40 transition-colors">
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </div>
        </div>

        {/* Duration and Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-umoja-muted mb-1.5">Duration</label>
            <input
              value={form.duration}
              onChange={e => set('duration', e.target.value)}
              placeholder="e.g. 2 weeks"
              className="w-full bg-umoja-dark/50 border border-umoja-gold/15 rounded-xl px-4 py-2.5 text-sm text-umoja-cream placeholder-umoja-muted focus:outline-none focus:border-umoja-gold/40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-umoja-muted mb-1.5">Location</label>
            <input
              value={form.location}
              onChange={e => set('location', e.target.value)}
              placeholder="Remote / Nairobi / Kampala"
              className="w-full bg-umoja-dark/50 border border-umoja-gold/15 rounded-xl px-4 py-2.5 text-sm text-umoja-cream placeholder-umoja-muted focus:outline-none focus:border-umoja-gold/40 transition-colors"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs text-umoja-muted mb-1.5">
            Skills needed
            <span className="ml-1 text-umoja-muted/60">(separate with commas)</span>
          </label>
          <input
            value={form.tags}
            onChange={e => set('tags', e.target.value)}
            placeholder="Illustrator, Branding, Logo Design, Adobe XD"
            className="w-full bg-umoja-dark/50 border border-umoja-gold/15 rounded-xl px-4 py-2.5 text-sm text-umoja-cream placeholder-umoja-muted focus:outline-none focus:border-umoja-gold/40 transition-colors"
          />
          {/* Tag preview */}
          {form.tags && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* AI tip */}
        <div className="p-3 rounded-xl bg-umoja-gold/5 border border-umoja-gold/15">
          <p className="text-xs text-umoja-muted">
            💡 <span className="text-umoja-gold font-medium">Pro tip:</span> Jobs with a clear description and budget get 3x more proposals. Need help writing your brief? Use the{' '}
            <a href="/ai-assistant" className="text-umoja-gold underline">AI Assistant</a>.
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={loading || !form.title || !form.budget}
          className="w-full py-3.5 rounded-xl bg-umoja-gold text-umoja-dark font-semibold text-sm hover:bg-umoja-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? (
            <><div className="loader w-4 h-4 border-2" /><span>Posting...</span></>
          ) : (
            '📝 Post Job'
          )}
        </button>

        <p className="text-center text-xs text-umoja-muted">
          Your job will be visible to thousands of East African creatives
        </p>
      </div>
    </main>
  );
}
