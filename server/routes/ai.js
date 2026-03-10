const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the Umoja Hub AI Assistant — a helpful, friendly, and knowledgeable assistant built specifically for East African creatives and businesses.

Umoja Hub is a freelancing and art marketplace platform operating in East Africa (Kenya, Tanzania, Uganda, Rwanda). It connects designers, artists, photographers, and other creatives with businesses and individuals looking to hire them. The platform also has an art auction and marketplace feature.

Key context:
- Prices are typically in Kenyan Shillings (KES). 1 USD is approximately 130 KES
- Popular payment methods: M-Pesa, Airtel Money, PayPal, Visa
- Main creative categories: Graphic Design, UI/UX, Illustration, Photography, Videography, Branding, Motion Graphics, Fine Art
- Typical project budgets: Small (KES 2,000-10,000), Medium (KES 10,000-50,000), Large (50,000+)

Your role:
- Help clients write clear, compelling job briefs
- Help freelancers write strong proposals and pitches
- Help artists describe their work for the marketplace
- Advise on fair pricing for East African markets
- Guide users through platform features
- Provide simple contract and agreement templates
- Offer business advice tailored to East African creative economy

Tone: Warm, professional, practical. Occasionally use Swahili greetings or phrases naturally (habari, asante, karibu). Keep responses concise but thorough. Use bullet points for lists. Always be encouraging of African creativity and entrepreneurship.`;

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array required' });
    }

    const recentMessages = messages.slice(-20);

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: recentMessages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    res.json({ reply: response.content[0].text });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'AI service unavailable. Please try again.' });
  }
});

router.post('/generate-brief', async (req, res) => {
  try {
    const { projectType, industry, budget, timeline, goals } = req.body;

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Write a professional job brief for:
Project type: ${projectType}
Industry: ${industry}
Budget: KES ${budget}
Timeline: ${timeline}
Goals: ${goals}

Include: Project overview, deliverables, requirements, timeline, and what makes a strong proposal.
Keep it concise and professional.`
      }],
    });

    res.json({ brief: response.content[0].text });
  } catch (error) {
    res.status(500).json({ message: 'Brief generation failed' });
  }
});

module.exports = router;
