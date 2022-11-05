/**
 * String functions
 */

export const stringCaseBuilder = (
  str: string,
  transformation: Function,
  separator: string
): string => {
  const stringCase = replaceDiacritics(str)
    .replace(/([a-z]+|\d+)([A-Z])/g, "$1 $2")
    .replace(/([a-z]+)(\d)/g, "$1 $2")
    .replace(/(\d+)([a-z])/g, "$1 $2")
    .split(/[^0-9A-Za-z]+/g)
    .map((word: string) => transformation(word))
    .join(separator);
  return prune(stringCase, separator);
};

export const prune = (str: string, char: string): string => {
  let res = str;

  if (res[0] === char) {
    // Remove first character
    res = res.slice(1);
  }

  if (res[res.length - 1] === char) {
    // Remove last character
    res = res.slice(0, -1);
  }

  return res;
};

export const toSlug = (str: string): string => {
  return kebabCase(str);
};

export const toHTMLUnicode = (char: string): string => {
  const unicodeChar = char.charCodeAt(0).toString(16).padStart(4, "0");
  return `&#x${unicodeChar.toUpperCase()};`;
};

export const escapeMDX = <T extends unknown>(input: T): T | string => {
  if (typeof input !== "string") {
    return input;
  }
  return input.replace(/[<>{}]/g, toHTMLUnicode);
};

export const firstUppercase = (word: string): string => {
  const sliceUppercase = word.slice(0, 1).toUpperCase();
  const sliceDefaultCase = word.slice(1);
  return `${sliceUppercase}${sliceDefaultCase}`;
};

export const capitalize = (word: string): string => {
  return firstUppercase(word.toLowerCase());
};

// from https://stackoverflow.com/a/37511463
export const replaceDiacritics = (str: string): string => {
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const startCase = (str: string): string => {
  return stringCaseBuilder(str, firstUppercase, " ");
};

export const kebabCase = (str: string): string => {
  return stringCaseBuilder(str, (word: string) => word.toLowerCase(), "-");
};
