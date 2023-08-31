/** @type {import('next').NextConfig} */
const path = require('path')
const { i18n } = require("./next-i18next.config");
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mdxeditor/editor', 'react-diff-view'],
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  i18n,
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true 
    return config;
  },
};

module.exports = nextConfig;