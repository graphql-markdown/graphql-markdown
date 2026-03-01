import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

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

CardFooter.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  textAlign: PropTypes.oneOf(["left", "center", "right", "justify"]),
  variant: PropTypes.string,
  italic: PropTypes.bool,
  noDecoration: PropTypes.bool,
  transform: PropTypes.oneOf(["uppercase", "lowercase", "capitalize"]),
  breakWord: PropTypes.bool,
  truncate: PropTypes.bool,
  weight: PropTypes.oneOf(["bold", "semibold", "normal"]),
};

export default CardFooter;
