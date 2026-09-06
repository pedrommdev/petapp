import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#FBF4EA",
          color: "#1C1917",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 72,
            height: 72,
            borderRadius: 18,
            background: "#E85D4C",
            alignItems: "center",
            justifyContent: "center",
            color: "#FBF4EA",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          C&D
        </div>
        <div style={{ fontSize: 64, fontWeight: 600, marginTop: 32 }}>
          Find yours
        </div>
        <div style={{ fontSize: 28, color: "#57534E", marginTop: 12 }}>
          A playful encyclopedia of cat and dog breeds.
        </div>
      </div>
    ),
    { ...size },
  );
}
