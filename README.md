# Umoja Hub 🌍
> East Africa's Creative Economy Platform — Property of Taita Arts

## What's been built

| Feature | Status |
|---|---|
| Landing page | ✅ |
| Auth (Login / Register) | ✅ |
| Dashboard (client & freelancer) | ✅ |
| Job Board (browse, filter, apply) | ✅ |
| Post a Job | ✅ |
| Marketplace (buy art) | ✅ |
| Live Auction Room | ✅ |
| AI Assistant (Claude-powered) | ✅ |
| M-Pesa STK Push payments | ✅ |
| PayPal payments | ✅ |
| Visa/Stripe payments | ✅ |
| Image uploads (Cloudinary) | ✅ |
| Real-time bids (Socket.io) | ✅ |
| Mobile-responsive (bottom nav) | ✅ |

---

## Tech Stack

**Frontend**: React + Vite + Tailwind CSS  
**Backend**: Node.js + Express + MongoDB  
**Auth**: JWT  
**Real-time**: Socket.io  
**Payments**: M-Pesa Daraja API + Stripe + PayPal  
**AI**: Anthropic Claude API  
**Images**: Cloudinary  

---

## Getting Started

### 1. Clone & Install

```bash
# Client
cd client
npm install

# Server
cd server
npm install
```

### 2. Environment Setup

```bash
cp server/.env.example server/.env
# Fill in your keys (see section below)
```

### 3. Run development servers

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Visit: http://localhost:5173

---

## API Keys You Need

### M-Pesa (Required for Kenya payments)
1. Go to https://developer.safaricom.co.ke
2. Create an app → Get Consumer Key & Secret
3. Use sandbox for testing, live for production

### Anthropic (AI Assistant)
1. Go to https://console.anthropic.com
2. Create API key
3. Add to `.env` as `ANTHROPIC_API_KEY`

### Cloudinary (Image uploads)
1. Go to https://cloudinary.com (free tier works)
2. Get Cloud Name, API Key, Secret

### Stripe (Card payments)
1. Go to https://dashboard.stripe.com
2. Use test keys for development

### PayPal
1. Go to https://developer.paypal.com
2. Create sandbox app

---

## Server Dependencies to install

```bash
cd server
npm install express mongoose cors dotenv jsonwebtoken bcryptjs
npm install axios multer cloudinary
npm install socket.io
npm install stripe @paypal/checkout-server-sdk
npm install @anthropic-ai/sdk
npm install nodemon --save-dev
```

## Client Dependencies to install

```bash
cd client
npm install react-router-dom axios socket.io-client
```

---

## Deployment

**Frontend**: Deploy to Vercel (connect GitHub repo)  
**Backend**: Deploy to Railway or Render  
**Database**: MongoDB Atlas (free tier)  

---

*Built for Taita Arts · East Africa's Creative Economy*
