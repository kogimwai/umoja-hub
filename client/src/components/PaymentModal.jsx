import { useState } from 'react';
import axios from 'axios';

const METHODS = [
  { id: 'mpesa', label: 'M-Pesa', icon: '📲', desc: 'Instant · Safaricom', color: 'mpesa-bg' },
  { id: 'airtel', label: 'Airtel Money', icon: '📱', desc: 'Instant · Airtel', color: 'border-red-600/30 bg-red-600/5' },
  { id: 'card', label: 'Visa / Mastercard', icon: '💳', desc: 'Visa, Mastercard', color: 'border-blue-600/30 bg-blue-600/5' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️', desc: 'Pay with PayPal', color: 'border-blue-400/30 bg-blue-400/5' },
];

export default function PaymentModal({ item, onClose }) {
  const [method, setMethod] = useState('mpesa');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('method');
  const [error, setError] = useState('');

  const price = item?.currentBid || item?.price || 0;

  const handlePay = async () => {
    setLoading(true);
    setError('');
    try {
      if (method === 'mpesa') {
        await axios.post('/api/payments/mpesa/stk-push', {
          phone: phone.replace(/\s/g, ''),
          amount: price,
          itemId: item._id,
          itemType: item.type || 'artwork',
          description: `Payment for ${item.title}`,
        });
        setStep('success');
      } else if (method === 'paypal') {
        const res = await axios.post('/api/payments/paypal/create-order', { itemId: item._id, amount: price });
        window.location.href = res.data.approvalUrl;
      } else {
        const res = await axios.post('/api/payments/stripe/create-session', { itemId: item._id, amount: price });
        window.location.href = res.data.url;
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Payment failed. Please try again.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md glass rounded-t-3xl sm:rounded-2xl p-6 anim-up">
        <div className="w-10 h-1 rounded-full bg-umoja-gold/30 mx-auto mb-5 sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display font-700 text-xl">Complete Payment</h2>
            <p className="text-umoja-muted text-sm mt-0.5 truncate max-w-xs">{item?.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-umoja-gold/20 flex items-center justify-center text-umoja-muted hover:text-umoja-cream transition-colors text-sm">✕</button>
        </div>

        {/* Amount */}
        <div className="glass rounded-xl p-4 mb-5 flex items-center justify-between">
          <span className="text-sm text-umoja-muted">Total amount</span>
          <span className="font-display font-700 text-2xl text-umoja-gold">KES {price.toLocaleString()}</span>
        </div>

        {step === 'success' ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-display font-700 text-xl mb-2">Payment Sent!</h3>
            <p className="text-umoja-muted text-sm mb-2">Check your phone for the M-Pesa prompt.</p>
            <p className="text-xs text-umoja-muted">Enter your M-Pesa PIN to complete the transaction.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-xl bg-umoja-gold text-umoja-dark font-semibold text-sm">Done</button>
          </div>
        ) : step === 'error' ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="font-display font-700 text-lg mb-2">Payment Failed</h3>
            <p className="text-umoja-muted text-sm mb-4">{error}</p>
            <button onClick={() => setStep('method')} className="px-5 py-2 rounded-lg border border-umoja-gold/30 text-umoja-cream text-sm hover:border-umoja-gold transition-colors">Try again</button>
          </div>
        ) : (
          <>
            {/* Payment Methods */}
            <div className="space-y-2 mb-5">
              {METHODS.map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${method === m.id ? 'border-umoja-gold/50 bg-umoja-gold/5' : `border-umoja-gold/10 hover:border-umoja-gold/25`}`}>
                  <span className="text-2xl flex-shrink-0">{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-umoja-cream">{m.label}</div>
                    <div className="text-xs text-umoja-muted">{m.desc}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${method === m.id ? 'border-umoja-gold bg-umoja-gold' : 'border-umoja-muted'}`} />
                </button>
              ))}
            </div>

            {/* Phone input for M-Pesa */}
            {method === 'mpesa' && (
              <div className="mb-5">
                <label className="block text-xs text-umoja-muted mb-2">M-Pesa phone number</label>
                <div className="flex gap-2">
                  <div className="flex-shrink-0 px-3 py-2.5 glass rounded-xl text-sm text-umoja-muted border border-umoja-gold/15">+254</div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="712 345 678"
                    className="flex-1 bg-umoja-dark/50 border border-umoja-gold/15 rounded-xl px-4 py-2.5 text-sm text-umoja-cream placeholder-umoja-muted focus:outline-none focus:border-umoja-gold/40 transition-colors"
                  />
                </div>
                <p className="text-xs text-umoja-muted mt-2">📲 You will receive an STK push on your phone</p>
              </div>
            )}

            {method === 'airtel' && (
