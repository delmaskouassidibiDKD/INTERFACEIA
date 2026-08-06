import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '5000', 10);

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini client lazily/safely
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API endpoint for AI Chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, webSearch, imageMode, systemInstruction } = req.body;

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: 'Messages array is required' });
        return;
      }

      const ai = getGeminiClient();

      // If no API key set or gemini fails, produce intelligent fallback response
      if (!ai) {
        const lastMessage = messages[messages.length - 1]?.content || '';
        const fallbackReply = `[Demo Assistant Mode] Merci pour votre message : "${lastMessage}". Je suis votre assistant Delmas. Pour débloquer les réponses en direct par Gemini, configurez votre clé GEMINI_API_KEY dans le panneau Secrets.`;
        res.json({ text: fallbackReply, sources: [] });
        return;
      }

      const historyFormatted = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const config: any = {
        systemInstruction:
          systemInstruction ||
          'Tu es Delmas, un assistant intelligent, chaleureux, polyvalent et concis. Réponds clairement dans la langue de l\'utilisateur (Français ou Anglais selon sa demande). Utilise du markdown élégant pour les réponses structurées.',
      };

      if (webSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      const modelsToTry = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
      let response: any = null;
      let lastErr: any = null;

      for (const modelName of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: historyFormatted,
            config,
          });
          if (response) break;
        } catch (mErr: any) {
          console.warn(`Model ${modelName} failed:`, mErr?.message);
          lastErr = mErr;
        }
      }

      if (!response) {
        const errMsg = lastErr?.message || '';
        if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
          res.json({
            text: "⚠️ Le quota temporaire de l'API est atteint (Rate Limit). Vos demandes reprendront automatiquement dans ~45 secondes. N'hésitez pas à réimporter votre message dans un instant.",
            sources: [],
          });
          return;
        }
        throw lastErr || new Error('All models failed to generate a response');
      }

      const replyText = response.text || "Désolé, je n'ai pas pu générer de réponse.";
      
      // Extract grounding sources if web search was enabled
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources = groundingChunks
        ? groundingChunks
            .map((chunk: any) => chunk.web)
            .filter((web: any) => web && web.uri)
        : [];

      res.json({ text: replyText, sources });
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
