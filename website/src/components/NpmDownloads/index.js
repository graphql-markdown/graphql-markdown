import useNpmDownloads from "@site/src/hooks/useNpmDownloads";

export default function NpmDownloads({ pkg, href }) {
  const label = useNpmDownloads(pkg);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="npm-downloads__link"
    >
      {label} weekly downloads
    </a>
  );
}
