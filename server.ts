import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '5000', 10);

  app.use(express.json({ limit: '10mb' }));

  // API endpoint for AI Chat — powered by OpenRouter
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, webSearch, imageMode, systemInstruction } = req.body;

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: 'Messages array is required' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;

      // Fallback demo mode when no key is set
      if (!apiKey) {
        const lastMessage = messages[messages.length - 1]?.content || '';
        res.json({
          text: `[Demo Assistant Mode] Merci pour votre message : "${lastMessage}". Je suis votre assistant Delmas. Pour débloquer les réponses en direct, configurez votre clé GEMINI_API_KEY (OpenRouter) dans le panneau Secrets.`,
          sources: [],
        });
        return;
      }

      const systemMsg = systemInstruction ||
        "Tu es Delmas, un assistant intelligent, chaleureux, polyvalent et concis. Réponds clairement dans la langue de l'utilisateur (Français ou Anglais selon sa demande). Utilise du markdown élégant pour les réponses structurées.";

      const openRouterMessages = [
        { role: 'system', content: systemMsg },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
      ];

      // Model priority list — free tier on OpenRouter (suffix :free)
      const modelsToTry = [
        'google/gemini-2.5-flash:free',
        'deepseek/deepseek-chat:free',
        'meta-llama/llama-3.3-70b-instruct:free',
      ];

      let replyText = '';
      let lastErr: any = null;

      for (const model of modelsToTry) {
        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': process.env.APP_URL || 'https://replit.com',
              'X-Title': 'Delmas AI',
            },
            body: JSON.stringify({
              model,
              messages: openRouterMessages,
            }),
          });

          if (!response.ok) {
            const errBody = await response.text();
            console.warn(`Model ${model} failed (${response.status}):`, errBody);
            lastErr = new Error(`HTTP ${response.status}: ${errBody}`);
            // Don't retry on auth errors
            if (response.status === 401 || response.status === 403) break;
            continue;
          }

          const data = await response.json();
          replyText = data.choices?.[0]?.message?.content || '';
          if (replyText) break;
        } catch (mErr: any) {
          console.warn(`Model ${model} error:`, mErr?.message);
          lastErr = mErr;
        }
      }

      if (!replyText) {
        const errMsg = lastErr?.message || '';
        if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
          res.json({
            text: "⚠️ Le quota temporaire de l'API est atteint. Réessayez dans ~45 secondes.",
            sources: [],
          });
          return;
        }
        throw lastErr || new Error('All models failed');
      }

      res.json({ text: replyText, sources: [] });
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      res.status(500).json({
        error: 'Error generating response',
        details: err?.message || 'Unknown error',
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
