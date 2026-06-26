import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a0a00",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 108,
            height: 108,
            border: "3px solid #C9A84C",
            transform: "rotate(45deg)",
            position: "absolute",
          }}
        />
        <div
          style={{
            width: 64,
            height: 64,
            border: "2px solid #C9A84C",
            transform: "rotate(45deg)",
            position: "absolute",
          }}
        />
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#C9A84C",
            position: "absolute",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
