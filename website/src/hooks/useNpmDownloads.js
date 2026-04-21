import { useState, useEffect } from "react";

function formatDownloads(count) {
  if (count >= 1000) {
    return `${Math.floor(count / 1000)}k+`;
  }
  return String(count);
}

export default function useNpmDownloads(pkg, fallback = "12k+") {
  const [label, setLabel] = useState(fallback);

  useEffect(() => {
    fetch(`https://api.npmjs.org/downloads/point/last-week/${pkg}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.downloads) {
          setLabel(formatDownloads(data.downloads));
        }
      })
      .catch(() => {});
  }, [pkg]);

  return label;
}
