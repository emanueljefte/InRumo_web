export function normalizeName(value: string): string {
  return value
    .normalize('NFD') // separa acentos das letras (aqui sim, String.prototype.normalize, com o argumento certo)
    .replace(/[\u0300-\u036f]/g, '') // remove os acentos
    .trim()
    .toLowerCase();
}