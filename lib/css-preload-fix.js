// CSS Preload Fix Webpack Plugin
class CSSPreloadFixPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('CSSPreloadFixPlugin', (compilation) => {
      // Hook into the HTML generation process
      if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
        compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(
          'CSSPreloadFixPlugin',
          (data) => {
            // Remove problematic CSS preload links
            const problematicCSS = ['998fb806ce5f963a.css', '4830416415385555.css'];
            
            if (data.assets && data.assets.css) {
              data.assets.css = data.assets.css.filter(cssFile => {
                return !problematicCSS.some(problem => cssFile.includes(problem));
              });
            }
            
            return data;
          }
        );
      }

      // Hook into chunk optimization
      compilation.hooks.optimizeChunks.tap('CSSPreloadFixPlugin', (chunks) => {
        chunks.forEach(chunk => {
          // Mark certain CSS chunks as non-preloadable
          if (chunk.name && (
            chunk.name.includes('998fb806ce5f963a') ||
            chunk.name.includes('4830416415385555')
          )) {
            chunk.canBeInitial = () => false;
          }
        });
      });
    });
  }
}

module.exports = CSSPreloadFixPlugin;