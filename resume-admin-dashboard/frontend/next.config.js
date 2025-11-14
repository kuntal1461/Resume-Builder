const path = require('node:path');

const workspaceRoot = path.resolve(__dirname, '../..');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/admin',
  experimental: {
    externalDir: true,
  },
  turbopack: {},
  outputFileTracingRoot: workspaceRoot,
  webpack(config) {
    const rules = config.module?.rules ?? [];

    const ensureArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

    const visitRule = (rule) => {
      if (rule.oneOf && Array.isArray(rule.oneOf)) {
        rule.oneOf.forEach(visitRule);
        return;
      }

      ensureArray(rule.use).forEach((use) => {
        if (!use || typeof use !== 'object') return;
        if (typeof use.loader !== 'string') return;
        if (!use.loader.includes('css-loader')) return;
        if (!use.options || !use.options.modules) return;

        use.options.modules = {
          ...use.options.modules,
          exportLocalsConvention: 'asIs',
          mode: 'local',
          getLocalIdent: (_context, _identifier, localName) => localName,
        };
      });
    };

    rules.forEach(visitRule);

    return config;
  },
};

module.exports = nextConfig;
