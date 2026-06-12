export function isPageBottomReached(threshold = 10): boolean {
  return window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold;
}
