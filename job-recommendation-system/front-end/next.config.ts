import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    type CssModuleOptions = {
      localIdentName?: string;
      getLocalIdent?: (context: unknown, identifier: string, localName: string) => string;
    };

    type CssLoaderUse = {
      loader?: string;
      options?: {
        modules?: CssModuleOptions;
      };
    };

    type RuleLike = {
      oneOf?: RuleLike[];
      use?: Array<unknown>;
    };

    const rules = (config.module?.rules ?? []) as RuleLike[];

    const isRuleWithOneOf = (rule: RuleLike): rule is RuleLike & { oneOf: RuleLike[] } => {
      return Array.isArray(rule.oneOf);
    };

    const isCssLoaderUse = (use: unknown): use is CssLoaderUse => {
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
