import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AuctionRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [myBid, setMyBid] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [flashNew, setFlashNew] = useState(false);
  const bidsEndRef = useRef(null);

  // Load auction data
  useEffect(() => {
    axios.get(`/api/marketplace/${id}`)
      .then(r => {
        setAuction(r.data);
        setBids(r.data.bids || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!auction?.auctionEnd) return;
    const tick = () => {
      const diff = new Date(auction.auctionEnd) - Date.now();
      if (diff <= 0) { setTimeLeft('ENDED'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [auction?.auctionEnd]);

  useEffect(() => {
    bidsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bids]);

  const placeBid = async () => {
    if (!user) { navigate('/login'); return; }
    const amount = parseFloat(myBid);
    if (!amount || amount <= (auction?.currentBid || 0)) return;
    setBidding(true);
    try {
      await axios.post(`/api/marketplace/${id}/bid`, { amount });
      setMyBid('');
      setFlashNew(true);
      setTimeout(() => setFlashNew(false), 800);
      // Refresh bids
      const r = await axios.get(`/api/marketplace/${id}`);
      setAuction(r.data);
      setBids(r.data.bids || []);
    } catch (e) {
      alert(e.response?.data?.message || 'Bid failed. Please try again.');
    } finally {
      setBidding(false);
    }
  };

  const minBid = auction
    ? Math.ceil((auction.currentBid || auction.startingBid) * 1.05)
    : 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="loader" />
    </div>
  );

  if (!auction) return (
    <div className="text-center py-20 text-umoja-muted">Auction not found</div>
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">

      {/* Live badge */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2.5 h-2.5 rounded-full bg-umoja-terra pulse-live" />
        <span className="text-sm font-semibold text-umoja-terra uppercase tracking-wide">
          Live Auction
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Left — Artwork */}
        <div>
          <div className="aspect-square bg-umoja-mid rounded-2xl overflow-hidden mb-5 relative">
            {auction.image ? (
              <img src={auction.image} alt={auction.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🎨</div>
            )}
            {flashNew && (
              <div className="absolute inset-0 bid-flash rounded-2xl pointer-events-none" />
            )}
          </div>

          <h1 className="font-display font-700 text-2xl sm:text-3xl mb-2">{auction.title}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-umoja-gold/20 flex items-center justify-center text-umoja-gold font-bold text-sm">
              {auction.artist?.name?.[0] || 'A'}
            </div>
            <span className="text-umoja-muted text-sm">{auction.artist?.name || 'Unknown Artist'}</span>
          </div>

          <p className="text-umoja-muted text-sm leading-relaxed">{auction.description}</p>
        </div>

        {/* Right — Bidding Panel */}
        <div className="space-y-4">

          {/* Current bid and countdown */}
          <div className="glass rounded-2xl p-5 glow-gold">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs text-umoja-muted mb-1">Current Bid</div>
                <div className={`font-display font-800 text-4xl text-umoja-gold transition-all ${flashNew ? 'scale-110' : 'scale-100'}`}>
                  KES {(auction.currentBid || auction.startingBid)?.toLocaleString()}
                </div>
                <div className="text-xs text-umoja-muted mt-1">{bids.length} bids placed</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-umoja-muted mb-1">Time left</div>
                <div className="font-display font-800 text-2xl text-umoja-terra">{timeLeft}</div>
              </div>
            </div>

            {/* Bid input */}
            {timeLeft !== 'ENDED' && (
              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-umoja-muted text-sm">KES</span>
                  <input
                    type="number"
                    value={myBid}
                    onChange={e => setMyBid(e.target.value)}
                    placeholder={minBid.toLocaleString()}
                    min={minBid}
                    className="w-full bg-umoja-dark/50 border border-umoja-gold/20 rounded-xl pl-12 pr-4 py-3 text-umoja-cream text-lg font-semibold placeholder-umoja-muted/40 focus:outline-none focus:border-umoja-gold/50 transition-colors"
                  />
                </div>

                {/* Quick bid buttons */}
                <div className="flex gap-2">
                  {[minBid, Math.ceil(minBid * 1.1), Math.ceil(minBid * 1.25)].map(amt => (
                    <button key={amt} onClick={() => setMyBid(String(amt))}
                      className="flex-1 py-1.5 rounded-lg border border-umoja-gold/20 text-xs text-umoja-muted hover:text-umoja-gold hover:border-umoja-gold/40 transition-colors">
                      {amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <button
                  onClick={placeBid}
                  disabled={bidding || !myBid || parseFloat(myBid) <= (auction.currentBid || 0)}
                  className="w-full py-3.5 rounded-xl bg-umoja-terra text-white font-semibold hover:bg-umoja-terra/80 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {bidding ? (
                    <><div className="loader w-4 h-4 border-2" /><span>Placing bid...</span></>
                  ) : (
                    '🔨 Place Bid'
                  )}
                </button>

                <p className="text-xs text-umoja-muted text-center">
                  Minimum bid: KES {minBid.toLocaleString()} (5% above current)
                </p>
              </div>
            )}

            {timeLeft === 'ENDED' && (
              <div className="text-center py-4">
                <div className="text-2xl mb-2">🏆</div>
                <p className="font-semibold text-umoja-cream">Auction Ended</p>
                <p className="text-sm text-umoja-muted mt-1">
                  Winner: {bids[0]?.bidder?.name || 'Unknown'}
                </p>
              </div>
            )}
          </div>

          {/* Bid History */}
          <div className="glass rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-3 text-umoja-cream">Bid History</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {bids.length === 0 ? (
                <p className="text-center text-umoja-muted text-sm py-4">
                  No bids yet — be the first!
                </p>
              ) : bids.map((bid, i) => (
                <div key={i}
                  className={`flex items-center justify-between p-2.5 rounded-lg ${i === 0 ? 'bg-umoja-gold/10 border border-umoja-gold/20' : 'bg-umoja-mid/40'}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-umoja-gold/20 flex items-center justify-center text-xs text-umoja-gold font-bold">
                      {bid.bidder?.name?.[0] || '?'}
                    </div>
                    <span className="text-xs text-umoja-muted">{bid.bidder?.name || 'Anonymous'}</span>
                    {i === 0 && <span className="text-xs text-umoja-gold">👑</span>}
                  </div>
                  <span className={`text-sm font-semibold ${i === 0 ? 'text-umoja-gold' : 'text-umoja-cream/70'}`}>
                    KES {bid.amount?.toLocaleString()}
                  </span>
                </div>
              ))}
              <div ref={bidsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
