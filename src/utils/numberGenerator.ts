export function generateNumber(
  prefix: string,
  currentCount: number
) {

  const year = new Date().getFullYear();

  const number = String(currentCount + 1)
    .padStart(4, "0");

  return `${prefix}-${year}-${number}`;

}