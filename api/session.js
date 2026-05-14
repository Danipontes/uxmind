/**
 * /api/session
 *
 * GET  ?id=SESSION_ID        → retorna dados da sessão
 * POST {site, name}          → cria nova sessão, retorna { id, site, name, createdAt }
 *
 * Store in-memory via global (dura enquanto a função estiver quente na Vercel).
 * Suficiente para uso em aula — sem necessidade de banco de dados.
 */

if (!global._uxSessions) global._uxSessions = {};
const sessions = global._uxSessions;

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id obrigatório' });
    const session = sessions[id];
    if (!session) return res.status(404).json({ error: 'Sessão não encontrada' });
    return res.status(200).json(session);
  }

  if (req.method === 'POST') {
    const { site, name } = req.body || {};
    if (!site) return res.status(400).json({ error: 'site obrigatório' });

    const id = 'sess_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const session = { id, site, name: name || '', createdAt: new Date().toISOString() };
    sessions[id] = session;

    return res.status(201).json(session);
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
