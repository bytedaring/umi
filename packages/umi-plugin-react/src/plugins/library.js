import { compatDirname } from 'umi-utils';
import { dirname } from 'path';

export default function(api, options) {
  const { cwd } = api.service;

  api.chainWebpackConfig(webpackConfig => {
    if (options === 'preact') {
      webpackConfig.resolve.alias
        .set('preact/devtools', require.resolve('preact/devtools'))
        .set('preact', require.resolve('preact'))
        .set(
          'react',
          compatDirname(
            'preact-compat/package.json',
            cwd,
            dirname(require.resolve('preact-compat/package.json')),
          ),
        )
        .set(
          'react-dom',
          compatDirname(
            'preact-compat/package.json',
            cwd,
            dirname(require.resolve('preact-compat/package.json')),
          ),
        )
        .set(
          'create-react-class',
          compatDirname(
            'preact-compat/lib/create-react-class',
            cwd,
            dirname(require.resolve('preact-compat/lib/create-react-class')),
          ),
        );
    }
  });

  api.addEntryImport(() => {
    if (process.env.NODE_ENV === 'development' && options === 'preact') {
      return {
        source: 'preact/devtools',
      };
    } else {
      return [];
    }
  });
}
