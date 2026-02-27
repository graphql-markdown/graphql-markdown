import React from "react";
import clsx from "clsx";

const CardFooter = ({
  className,
  style,
  children,
  textAlign,
  variant,
  italic = false,
  noDecoration = false,
  transform,
  breakWord = false,
  truncate = false,
  weight,
}) => {
  return (
    <div
      className={clsx(
        "card__footer",
        className,
        textAlign && `text--${textAlign}`,
        transform && `text--${transform}`,
        variant && `text--${variant}`,
        weight && `text--${weight}`,
        {
          "text--italic": italic,
          "text-no-decoration": noDecoration,
          "text--break": breakWord,
          "text--truncate": truncate,
        },
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default CardFooter;
