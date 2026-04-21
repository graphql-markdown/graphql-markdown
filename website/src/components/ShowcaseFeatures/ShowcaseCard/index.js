import Link from "@docusaurus/Link";
import Card from "@site/src/components/ShowcaseFeatures/Card";
import CardHeader from "@site/src/components/ShowcaseFeatures/CardHeader";
import CardImage from "@site/src/components/ShowcaseFeatures/CardImage";

const ShowcaseCard = ({ name, href, image, featured }) => {
  const cardImageUrl = `/img/showcase/${image}.png`;
  const cardClass = featured
    ? "showcase__card showcase__card--featured"
    : "showcase__card";
  return (
    <Card shadow="tl" className={cardClass}>
      <Link to={href}>
        <CardHeader style={{ backgroundColor: "white" }}>
          <div className="avatar">
            <div className="avatar__name">{name}</div>
          </div>
        </CardHeader>
        <CardImage
          cardImageUrl={cardImageUrl}
          alt={`${name} showcase screenshot`}
          width={featured ? 360 : 240}
          height={featured ? 240 : 160}
        />
      </Link>
    </Card>
  );
};

export default ShowcaseCard;
