import nba from '@next/bundle-analyzer'

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",

  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@tyl/api",
    "@tyl/auth",
    "@tyl/db",
    "@tyl/ui",
    "@tyl/validators",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

const withBundleAnalyzer = nba({
  enabled: process.env.ANALYZE === 'true',
})
 
export default withBundleAnalyzer(config);
