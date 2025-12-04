export function suggest(query, products, limit = 6) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return products
    .map(p => ({
      p,
      s:
        (p.name.toLowerCase().includes(q) ? 3 : 0) +
        (p.description?.toLowerCase().includes(q) ? 2 : 0) +
        (p.tags?.some(t => t.toLowerCase().includes(q)) ? 1 : 0)
    }))
    .filter(x => x.s > 0)
    .sort((a,b) => b.s - a.s)
    .slice(0, limit)
    .map(x => x.p);
}
