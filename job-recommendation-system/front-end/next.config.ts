import type { NextConfig } from 'next';
import type { RuleSetRule, RuleSetUseItem } from 'webpack';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    const rules = config.module?.rules ?? [];

    const isRuleWithOneOf = (rule: RuleSetRule): rule is RuleSetRule & { oneOf: RuleSetRule[] } => {
      return Array.isArray((rule as { oneOf?: unknown }).oneOf);
    };

    type CssLoaderUse = {
      loader: string;
      options?: {
        modules?: {
          localIdentName?: string;
          getLocalIdent?: (context: unknown, identifier: string, localName: string) => string;
        };
      };
    };

    const isCssLoaderUse = (use: RuleSetUseItem): use is CssLoaderUse => {
      if (typeof use !== 'object' || use === null) {
        return false;
      }

      const candidate = use as CssLoaderUse;
      return typeof candidate.loader === 'string' && candidate.loader.includes('css-loader');
    };

    rules.forEach((rule) => {
      if (!isRuleWithOneOf(rule)) {
        return;
      }

      rule.oneOf.forEach((one) => {
        if (!Array.isArray(one.use)) {
          return;
        }

        one.use.forEach((use) => {
          if (!isCssLoaderUse(use) || !use.options?.modules) {
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
