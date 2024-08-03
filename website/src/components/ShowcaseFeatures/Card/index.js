import React from "react"; // CSSProperties allows inline styling with better type checking.
import clsx from "clsx"; // clsx helps manage conditional className names in a clean and concise manner.

const Card = ({
  className, // classNames for the container card
  style, // Custom styles for the container card
  children, // for include others parts in
  shadow, // for add shadow under your card Shadow levels: low (lw), medium (md), top-level (tl)
}) => {
  const cardShadow = shadow ? `item shadow--${shadow}` : "";
  return (
    <div className="card-demo">
      <div className={clsx("card", className, cardShadow)} style={style}>
        {children}
      </div>
    </div>
  );
};

export default Card;
