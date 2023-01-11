const {urlToRequest} = require('loader-utils');

const imageReferenceRegEx = /!\[(?<alt>[^\]]*)\]\((?<path>(?!(?:https?:)?\/\/)[^)'"]+(?:\s+["'][^"']*["'])?)\)/g;

function getPublicPath(options, context) {
  if ('publicPath' in options) {
    return typeof options.publicPath === 'function' ? options.publicPath(context) : options.publicPath;
  }

  if (context.options && context.options.output && 'publicPath' in context.options.output) {
    return context.options.output.publicPath;
  }

  if (context._compilation && context._compilation.outputOptions && 'publicPath' in context._compilation.outputOptions) {
    return context._compilation.outputOptions.publicPath;
  }

  return '';
}

module.exports = async function (content, map, meta) {
  this.cacheable && this.cacheable();
  const callback = this.async();
  const options = this.getOptions() || {};
  const publicPath = getPublicPath(options, this);
  const loaderContext = this;

  // collect all references
  // TODO: matching performance improvements
  let references = [];
  for (match of content.matchAll(imageReferenceRegEx)) {
    references.push({reference: match[0], index: match.index, path: match.groups.path});
  }

  function importAsset(reference) {
    return new Promise((resolve, reject) => {
      loaderContext.importModule(urlToRequest(reference.path), {publicPath}, (err, module) => {
        if (err)
          return reject(err);

        reference.module = module;
        resolve(reference);
      });
    });
  }

  // resolve all references asynchronously
  try {
    references = await Promise.all(references.map(importAsset));
  } catch (e) {
    return callback(e);
  }

  // replace all image references with resolved modules
  // (right to left because indices change with each replace)
  for (let i = references.length - 1; i >= 0; i--) {
    let ref = references[i];

    let pathStart = ref.reference.length - 1 - ref.path.length;

    content = content.substring(0, ref.index + pathStart) + ref.module + content.substring(ref.index + ref.reference.length - 1);
  }

  return callback(null, content, map, meta);
};
