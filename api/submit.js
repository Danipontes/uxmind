/**
 * /api/submit
 *
 * GET  ?session=SESSION_ID                    → lista submissões da sessão (professor)
 * POST { sessionId, email, ratings, timestamp } → salva/atualiza submissão do aluno
 *
 * Store in-memory via global (dura enquanto a função estiver quente na Vercel).
 * Suficiente para uso em aula — sem necessidade de banco de dados.
 */

if (!global._uxSubmissions) global._uxSubmissions = {};
const store = global._uxSubmissions;

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { session } = req.query;
    if (!session) return res.status(400).json({ error: 'session obrigatório' });
    return res.status(200).json(store[session] || []);
  }

  if (req.method === 'POST') {
    const { sessionId, email, ratings, timestamp } = req.body || {};
    if (!sessionId || !email || !ratings) {
      return res.status(400).json({ error: 'sessionId, email e ratings são obrigatórios' });
    }

    if (!store[sessionId]) store[sessionId] = [];
    const subs = store[sessionId];

    const submission = { email, sessionId, ratings, timestamp: timestamp || new Date().toISOString() };

    // Upsert por email — re-envio substitui avaliação anterior
    const idx = subs.findIndex(s => s.email === email);
    if (idx >= 0) subs[idx] = submission;
    else subs.push(submission);

    return res.status(200).json({ ok: true, total: subs.length });
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
