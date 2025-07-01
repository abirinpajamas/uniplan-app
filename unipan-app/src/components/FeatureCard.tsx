import React from "react";
import "../index.css";

interface FeatureCardProps {
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  imageUrl?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  linkText,
  linkUrl,
  imageUrl,
}) => {
  return (
    <div className="card" style={{ width: "18rem" }}>
      {imageUrl && <img src={imageUrl} className="card-img-top" alt={title} />}
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <a href={linkUrl} className="btn btn-dark" id="buttoncard">
          {linkText}
        </a>
      </div>
    </div>
  );
};

export default FeatureCard;
