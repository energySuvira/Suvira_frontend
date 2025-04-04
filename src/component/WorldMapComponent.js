import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const CustomPin = ({ name }) => (
  <g transform="scale(0.5)">
    <path
      d="M0-20c-3 0-6 2.5-6 6 0 5.5 6 12.5 6 12.5s6-7 6-12.5c0-3.5-3-6-6-6z"
      fill="#FF0000"
    />
  </g>
);

function WorldMapComponent() {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipName, setTooltipName] = useState("");

  const markers = [
    { name: "Mumbai", coordinates: [72.978088, 19.51833] },
    { name: "Bommasandra", coordinates: [77.713615, 12.800494] },
    { name: "Andheri East", coordinates: [72.870087, 19.120512] },
  ];

  const blackRegions = [
    "Nepal",
    "United States",
    "United Arab Emirates",
    "Kuwait",
    "Kazakhstan",
    "India",
  ];

  return (
    <div className="w-full md:h-[1100px] h-[400px] ">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 95,
         
        }}
      >
      <Geographies geography="/features.json">
          {({ geographies }) =>
            geographies.map((geo) => {
              const isHighlighted = blackRegions.includes(geo.properties.name);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isHighlighted ? "#3d3e41" : "#81bc06"}
                  stroke="#FFFFFF"
                  strokeWidth={0.2}
                  style={{
                    default: { outline: "none" },
                    //hover: { outline: "none", fill: "#3d3e41" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>

        {markers.map(({ name, coordinates }) => (
          <Marker
            key={name}
            coordinates={coordinates}
            onMouseEnter={() => {
              setTooltipVisible(true);
              setTooltipName(name);
            }}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <CustomPin name={name} />
            {tooltipVisible && tooltipName === name && (
              <g>
                <rect
                  x={-150}
                  y={-40}
                  width={300}
                  height={40}
                  fill="white"
                  stroke="black"
                  strokeWidth={0.5}
                  rx={2}
                  ry={2}
                />
                <text
                  x={-145}
                  y={-25}
                  fontSize={8}
                  textAnchor="start"
                  fill="black"
                  style={{ 
                    maxWidth: "280px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    lineHeight: "1.2em"
                  }}
                >
                  {name === "Mumbai"
                    ? "B-201, Suvira Energy, Satellite Gazebo, B. D. Sawant Marg, Andheri East, Mumbai, Maharashtra 400099"
                    : name === "Andheri East"
                    ? <>
                        <tspan x="-145" dy="-1em">lab: B 1 2 3 GROUND FLOOR</tspan>
                        <tspan x="-145" dy="1.2em">HANUMANTA APPARTMENT SRA CHS LTD</tspan>
                        <tspan x="-145" dy="1.2em">M C CHHAGLA MARG CHAKALA ANDHERI</tspan>
                        <tspan x="-145" dy="1.2em">Maharashtra</tspan>
                      </>
                    : name === "Bommasandra"
                    ? "Bommasandra Industrial Area, Bommasandra, Bengaluru, Karnataka"
                    : ""}
                </text>
              </g>
            )}
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}

export default WorldMapComponent;