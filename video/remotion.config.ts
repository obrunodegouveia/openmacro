import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// The course is TypeScript from a workspace package; let the bundler read it.
Config.overrideWebpackConfig((current) => ({
  ...current,
  resolve: {
    ...current.resolve,
    extensionAlias: { '.js': ['.js', '.ts', '.tsx'] },
  },
}));
