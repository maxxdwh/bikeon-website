export type FuzzyRecord = { kind: 'school' | 'news'; title: string; place: string; url: string };

type Entry = FuzzyRecord & { tokens: string[]; compact: string };

const ALIASES: Record<string, string> = {
  saint: 'st',
  sainte: 'st',
  sts: 'st',
  mount: 'mt',
  mountain: 'mt',
  and: '',
  the: '',
  of: '',
};

export const tokenize = (input: string): string[] =>
  input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’‘`.]/g, '')
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((t) => (t in ALIASES ? ALIASES[t] : t))
    .filter(Boolean);

const distance = (a: string, b: string, max: number): number => {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const rows: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    rows[i] = [i];
    for (let j = 1; j <= b.length; j++) rows[i][j] = i === 0 ? j : 0;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, rows[i - 2][j - 2] + 1);
      rows[i][j] = v;
    }
  }
  return rows[a.length][b.length];
};

const allowed = (len: number) => (len <= 3 ? 0 : len === 4 ? 1 : 2);

const tokenCost = (q: string, t: string): number => {
  if (q === t) return 0;
  if (t.startsWith(q)) return 0.25;
  const max = allowed(q.length);
  if (!max) return Infinity;
  if (q[0] !== t[0]) return Infinity;
  const whole = distance(q, t, max);
  if (whole <= max) return 1 + whole;
  const head = distance(q, t.slice(0, q.length), 1);
  return head <= 1 ? 1.5 + head : Infinity;
};

export type FuzzyIndex = Entry[];

export const buildIndex = (rows: [FuzzyRecord['kind'], string, string, string][]): Entry[] =>
  rows.map(([kind, title, place, url]) => {
    const tokens = tokenize(title);
    return { kind, title, place, url, tokens, compact: tokens.join('') };
  });

export const search = (index: Entry[], query: string): FuzzyRecord[] => {
  const q = tokenize(query);
  if (!q.length) return [];
  const joined = q.join('');
  const scored: { entry: Entry; score: number }[] = [];
  for (const entry of index) {
    let score = 0;
    for (const token of q) {
      let best = Infinity;
      for (const t of entry.tokens) {
        const c = tokenCost(token, t);
        if (c < best) best = c;
      }
      if (best === Infinity && token.length > 2 && entry.compact.includes(token)) best = 2;
      score += best;
      if (score === Infinity) break;
    }
    if (score === Infinity && joined.length > 3 && entry.compact.includes(joined)) score = 0.5;
    if (score !== Infinity) scored.push({ entry, score: score + entry.tokens.length * 0.01 });
  }
  return scored.sort((a, b) => a.score - b.score).map((s) => s.entry);
};
