export default function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function sleepIfTooManyRequest(statusCode) {
  let ms = 0;
  if (parseInt(statusCode, 10) === 429) {
    ms = 60 * 1000;
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function sleepEach50Requests() {
  const rand = Math.floor(Math.random() * 51);

  let ms = 0;
  if (rand === 1) {
    ms = 5 * 1000;
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}
