/**
 * When the current route is already the API base route, the router sees no
 * route change on a link back to it, so scroll the page to the top instead.
 * Returns whether a scroll happened.
 */
export const scrollToIntro = (
  currentPath: string,
  baseURLPath: string,
  scroll: (options: ScrollToOptions) => void = (options) => {
    window.scrollTo(options);
  },
): boolean => {
  if (currentPath.replace(/\/$/, "") !== baseURLPath) {
    return false;
  }
  scroll({ top: 0, behavior: "smooth" });
  return true;
};
