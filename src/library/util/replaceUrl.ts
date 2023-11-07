
/**
 * replace url starts from second path segment.
 * @param url 
 */
export function replaceUrl(url: string, starts = "/") {
  return starts + url.match(/\w+:\/\/(?:[\w-]+\.?)+\/(?:[\w-]+)\/(.*)/,)?.pop()
}