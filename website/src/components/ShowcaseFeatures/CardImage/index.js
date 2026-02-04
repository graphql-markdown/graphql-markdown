import React from "react";
import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl"; // Import the useBaseUrl function from Docusaurus

const CardImage = ({
  className,
  style,
  cardImageUrl,
  alt,
  title,
  width,
  height,
}) => {
  const generatedCardImageUrl = useBaseUrl(cardImageUrl);

  return (
    <img
      className={clsx("card__image", className)}
      style={style}
      src={generatedCardImageUrl}
      alt={alt}
      title={title}
      width={width}
      height={height}
      loading="lazy"
    />
  );
};

export default CardImage;
