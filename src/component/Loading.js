import React from "react";
import { RotatingTriangles } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
      <div className="bg-transparent flex items-center justify-center rounded  w-full max-w-md">
        <RotatingTriangles
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="rotating-triangles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    </div>
  );
};

export default Loading;
