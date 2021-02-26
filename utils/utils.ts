export function customToFixed(entry: number, places = 2) {
  const num = Math.pow(10, places)
  return Math.floor(entry * num) / num
}
