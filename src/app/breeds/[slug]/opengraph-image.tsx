import { ImageResponse } from "next/og";
import { getBreedBySlug } from "@/lib/catalog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const breed = getBreedBySlug(slug);
  const name = breed?.name ?? "Cat & Dog Repo";
  const species = breed?.species === "dog" ? "DOG" : "CAT";
  const color = breed?.species === "dog" ? "#3F6F8A" : "#3D6B5A";

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
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 4,
            color,
          }}
        >
          {species}
        </div>
        <div style={{ fontSize: 64, fontWeight: 600, marginTop: 16 }}>
          {name}
        </div>
        <div style={{ fontSize: 24, color: "#57534E", marginTop: 16 }}>
          Cat & Dog Repo
        </div>
      </div>
    ),
    { ...size },
  );
}
