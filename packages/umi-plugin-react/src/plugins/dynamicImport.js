import { join } from 'path';

export default function(api, options) {
  const { paths, winPath } = api;

  if (options.level) {
    process.env.CODE_SPLITTING_LEVEL = options.level;
  }

  if (process.env.NODE_ENV === 'production') {
    api.modifyAFWebpackOpts(opts => {
      return {
        ...opts,
        disableDynamicImport: false,
      };
    });

    api.modifyRouteComponent((memo, args) => {
      const { importPath, webpackChunkName } = args;

      let loadingOpts = '';
      if (options.loadingComponent) {
        loadingOpts = `, loading: require('${winPath(
          join(paths.absSrcPath, options.loadingComponent),
        )}').default `;
      }

      let extendStr = '';
      if (options.webpackChunkName) {
        extendStr = `/* webpackChunkName: ^${webpackChunkName}^ */`;
      }
      return `dynamic({ loader: () => import(${extendStr}'${importPath}')${loadingOpts} })`;
    });
  }
}
