export function arraysEqualIgnoreOrder(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  a = [...a].sort((x, y) => x - y);
  b = [...b].sort((x, y) => x - y);
  return a.every((v, i) => v === b[i]);
}