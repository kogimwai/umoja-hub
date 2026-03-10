import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import axios from 'axios';

const TYPES = ['All', 'For Sale', 'Auction', 'Digital', 'Physical'];
const ARTS = ['All', 'Painting', 'Photography', 'Illustration', 'Sculpture', 'Digital Art', 'Textile'];

function ArtCard({ item, onBuy }) {
  const isAuction = item.type === 'auction';
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!isAuction || !item.auctionEnd) return;
    const tick = () => {
      const diff = new Date(item.auctionEnd) - Date.now();
      if (diff <= 0) { setTimeLeft('Ended'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [isAuction, item.auctionEnd]);

  return (
    <div className="glass rounded-2xl overflow-hidden group hover:border-umoja-gold/25 transition-all hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-umoja-mid to-umoja-dark overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🎨</div>
        )}
        {isAuction && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-umoja-terra/90 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white pulse-live" />
            <span className="text-xs font-semibold text-white">LIVE</span>
          </div>
        )}
        {item.sold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="font-display font-700 text-white text-xl rotate-[-20deg]">SOLD</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-600 text-sm text-umoja-cream leading-tight line-clamp-2 mb-2">{item.title}</h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-umoja-gold/20 flex items-center justify-center text-xs text-umoja-gold font-bold">
            {item.artist?.name?.[0] || 'A'}
          </div>
          <span className="text-xs text-umoja-muted">{item.artist?.name || 'Unknown Artist'}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-umoja-gold font-display font-700 text-lg">
              KES {(item.currentBid || item.price)?.toLocaleString()}
            </div>
            {isAuction && (
              <div className="text-xs text-umoja-muted">
                Ends in: <span className="text-umoja-gold font-medium">{timeLeft}</span>
              </div>
            )}
          </div>

          {!item.sold && (
            isAuction ? (
              <Link to={`/auction/${item._id}`} className="px-3 py-1.5 rounded-lg bg-umoja-terra text-white text-xs font-semibold hover:bg-umoja-terra/80 transition-colors">
                Bid now
              </Link>
            ) : (
              <button onClick={() => onBuy(item)} className="px-3 py-1.5 rounded-lg bg-umoja-gold text-umoja-dark text-xs font-semibold hover:bg-umoja-gold-light transition-colors">
                Buy now
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('All');
  const [artType, setArtType] = useState('All');
  const [search, setSearch] = useState('');
  const [payItem, setPayItem] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (type !== 'All') params.type = type.toLowerCase().replace(' ', '_');
    if (artType !== 'All') params.artType = artType;
    if (search) params.q = search;

    axios.get('/api/marketplace', { params })
      .then(r => { setItems(r.data.items || []); setTotal(r.data.total || 0); })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [type, artType, search]);

  const handleBuy = (item) => {
    if (!user) { navigate('/login'); return; }
    setPayItem(item);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-700 text-3xl sm:text-4xl">Marketplace</h1>
          <p className="text-umoja-muted text-sm mt-1">{total} artworks — buy, bid, collect</p>
        </div>
        {user && (
          <Link to="/marketplace/list" className="px-5 py-2.5 rounded-xl bg-umoja-gold text-umoja-dark font-semibold text-sm hover:bg-umoja-gold-light
