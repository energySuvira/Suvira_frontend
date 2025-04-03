import React, { useState, useEffect } from "react";
import Loading from "./Loading";

export const ImageWithLoader = ({
  src,
  alt = "",
  id = "",
  className = "",
  style = {},
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    // When image is loaded, update the loading state
    img.onload = () => {
      setLoading(false);
    };

    // In case of image loading error
    img.onerror = () => {
      setLoading(false); // You might want to handle errors differently
    };
  }, [src]);

  return loading ? (
    <Loading />
  ) : (
    <img
      className={`${className} ${loading ? "hidden" : "block"}`}
      id={id}
      loading="lazy"
      src={src}
      alt={alt}
      style={style}
    />
  );
};
