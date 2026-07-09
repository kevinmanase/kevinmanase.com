import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1b1bec",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            color: "#ffffff",
          }}
        >
          km
        </div>
      </div>
    ),
    { ...size }
  );
}
