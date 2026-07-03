// Proxy di pubblicazione per pannello.html.
// La chiave GitHub resta qui sul server (variabile d'ambiente GITHUB_TOKEN);
// il pannello si autentica con la password condivisa (PANEL_PASSWORD).
const REPO = 'vmaretto/thesalt';
const BRANCH = 'main';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });

  const { password, op, path, content, message } = req.body || {};

  if (!process.env.PANEL_PASSWORD || !process.env.GITHUB_TOKEN)
    return res.status(500).json({ error: 'Pannello non configurato: aggiungere PANEL_PASSWORD e GITHUB_TOKEN nelle Environment Variables di Vercel' });
  if (password !== process.env.PANEL_PASSWORD)
    return res.status(401).json({ error: 'Password errata' });
  if (typeof path !== 'string' || !/^[\w./ -]+$/.test(path) || path.includes('..'))
    return res.status(400).json({ error: 'Percorso non valido' });

  const url = 'https://api.github.com/repos/' + REPO + '/contents/' + encodeURI(path);
  const headers = {
    Authorization: 'Bearer ' + process.env.GITHUB_TOKEN,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'thesalt-pannello'
  };

  try {
    if (op === 'get') {
      const r = await fetch(url + '?ref=' + BRANCH, { headers });
      if (!r.ok) return res.status(r.status).json({ error: 'GitHub GET ' + r.status });
      const j = await r.json();
      return res.status(200).json({ content: j.content, sha: j.sha });
    }
    if (op === 'put') {
      let sha;
      const cur = await fetch(url + '?ref=' + BRANCH, { headers });
      if (cur.ok) sha = (await cur.json()).sha;
      const body = { message: message || 'Aggiornamento dal pannello', content, branch: BRANCH };
      if (sha) body.sha = sha;
      const r = await fetch(url, { method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) {
        const t = await r.text();
        return res.status(r.status).json({ error: 'GitHub PUT ' + r.status + ' ' + t.slice(0, 140) });
      }
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: 'Operazione non valida' });
  } catch (e) {
    return res.status(502).json({ error: 'Errore di rete verso GitHub: ' + e.message });
  }
};
