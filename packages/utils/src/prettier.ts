/* istanbul ignore file */

const prettify = async (content: string, parser: string): Promise<string> => {
  try {
    const { format } = await import("prettier");
    return format(content, { parser });
  } catch (error) {
    console.debug("Prettier is not found");
  }
    return content;
}

export const prettifyMarkdown = async (content: string): Promise<string> => {
  return await prettify(content, "markdown");
}

export const prettifyJavascript = async (content: string): Promise<string> => {
  return await prettify(content, "babel");
}

