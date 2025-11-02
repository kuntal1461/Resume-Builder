import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.forEach((rule: any) => {
      if (!Array.isArray(rule.oneOf)) {
        return;
      }

      rule.oneOf.forEach((one: any) => {
        if (!Array.isArray(one.use)) {
          return;
        }

        one.use.forEach((use: any) => {
          const isCssLoader =
            typeof use === 'object' &&
            typeof use.loader === 'string' &&
            use.loader.includes('css-loader');

          if (!isCssLoader || !use.options?.modules) {
            return;
          }

          use.options.modules.localIdentName = '[local]';
          use.options.modules.getLocalIdent = (
            _context: unknown,
            _identifier: string,
            localName: string,
          ) => localName;
        });
      });
    });

    return config;
  },
};

export default nextConfig;
