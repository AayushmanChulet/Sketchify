import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // Exclude svg from the default Next.js asset handling
    config.module.rules = config.module.rules.map((rule: any) => {
      if (
        typeof rule.test !== "undefined" &&
        rule.test instanceof RegExp &&
        rule.test.test(".svg")
      ) {
        return { ...rule, exclude: /\.svg$/i };
      }
      return rule;
    });

    // Add SVGR loader
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
