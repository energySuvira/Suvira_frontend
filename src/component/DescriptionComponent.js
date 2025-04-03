import React from "react";
export const DescriptionComponent = ({ description }) => {
  // Split by double newlines for paragraphs first
  const paragraphs = description && description.split("\n\n");

  return (
    <div>
      {paragraphs && paragraphs.map((paragraph, index) => (
        <p key={index}>
          {paragraph.split("\n").map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  );
};
