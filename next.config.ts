import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  async headers() {
    return [
      {
        source: "/:path*.usdz",
        headers: [
          {
            key: "Content-Type",
            value: "model/vnd.usdz+zip",
          },
          {
            key: "Content-Disposition",
            value: "inline",
          },
        ],
      },
      {
        source: "/:path*.glb",
        headers: [
          {
            key: "Content-Type",
            value: "model/gltf-binary",
          },
        ],
      },
    ];
  },
};


export default nextConfig;
