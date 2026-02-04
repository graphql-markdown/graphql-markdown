import React from "react";
import Link from "@docusaurus/Link";
import Card from "@site/src/components/ShowcaseFeatures/Card";
import CardHeader from "@site/src/components/ShowcaseFeatures/CardHeader";
import CardImage from "@site/src/components/ShowcaseFeatures/CardImage";

const ShowcaseCard = ({ name, href, image }) => {
  const cardImageUrl = `/img/showcase/${image}.png`;
  return (
    <Card shadow="tl" className="showcase__card">
      <Link to={href}>
        <CardHeader style={{ backgroundColor: "white" }}>
          <div className="avatar">
            <div className="avatar__name">{name}</div>
          </div>
        </CardHeader>
        <CardImage 
          cardImageUrl={cardImageUrl} 
          alt={`${name} showcase screenshot`}
          width={240}
          height={160}
        />
      </Link>
    </Card>
  );
};

export default ShowcaseCard;
