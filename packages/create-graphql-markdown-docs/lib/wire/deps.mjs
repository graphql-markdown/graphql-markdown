/**
 * Package name behind a module specifier: "@scope/name/sub" gives "@scope/name",
 * "name/sub" gives "name". Local paths ("." or "/" prefixed) have no package and
 * give `undefined`.
 * @param {string} specifier
 * @returns {string | undefined}
 */
export function packageNameOf(specifier) {
  if (specifier.startsWith(".") || specifier.startsWith("/")) return undefined;
  const [first, second] = specifier.split("/");
  if (first.startsWith("@")) return second ? `${first}/${second}` : undefined;
  return first;
}

/**
 * Packages wire mode needs in the project: the CLI, the formatter (the
 * --formatter value, else the framework preset's) and the schema loader.
 * Duplicates and packages already listed in package.json are left out.
 * @param {{ descriptor: { formatter?: string }, loader: { package: string }, formatter?: string, packageJson?: object | null }} inputs
 * @returns {string[]}
 */
export function requiredPackages({
  descriptor,
  loader,
  formatter,
  packageJson,
}) {
  const present = new Set([
    ...Object.keys(packageJson?.dependencies ?? {}),
    ...Object.keys(packageJson?.devDependencies ?? {}),
  ]);
  const formatterSpecifier = formatter || descriptor.formatter;
  const names = ["@graphql-markdown/cli"];
  if (formatterSpecifier) names.push(packageNameOf(formatterSpecifier));
  names.push(loader.package);
  const unique = [...new Set(names.filter(Boolean))];
  return unique.filter((name) => !present.has(name));
}
