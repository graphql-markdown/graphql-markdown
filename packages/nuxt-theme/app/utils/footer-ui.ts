export interface FooterUiOptions {
  containerClass?: string;
  sticky?: boolean;
}

const joinClasses = (classes: (string | false | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Nuxt UI `ui` slots for the site footer. The reference layout pins the footer
 * to the bottom of the viewport at a fixed height; the landing page keeps the
 * default in-flow footer.
 */
export const buildFooterUi = ({
  containerClass,
  sticky = false,
}: FooterUiOptions = {}): { root: string; container: string } => {
  return {
    root: joinClasses([
      "border-t border-default bg-muted",
      sticky && "sticky bottom-0 z-40",
    ]),
    container: joinClasses([
      sticky ? "h-(--gqlmd-footer-height) py-0" : "py-6",
      containerClass,
    ]),
  };
};
