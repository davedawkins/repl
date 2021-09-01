// @ts-check

import lzString from "lz-string";

function parseQuery() {
    var query = window.location.hash.replace(/^\#\?/, '');

    if (!query) {
        console.log("No query");
        return null;
    }

    return query.split('&').map(function(param) {
      var splitPoint = param.indexOf('=');

      return {
        key : param.substring(0, splitPoint),
        value : param.substring(splitPoint + 1)
      };
    }).reduce(function(params, param){
      if (param.key && param.value) {
        params[param.key] =
          param.key === "codes" || param.key === "names"
            ? JSON.parse(lzString.decompressFromEncodedURIComponent(param.value))
            : param.key === "html" || param.key === "css"
                ? lzString.decompressFromEncodedURIComponent(param.value)
                : decodeURIComponent(param.value);
      }
      return params;
    }, {});
}

export function updateQuery(names, codes, html, css) {
    var object =
        { names : lzString.compressToEncodedURIComponent(JSON.stringify(names)),
          codes : lzString.compressToEncodedURIComponent(JSON.stringify(codes)),
          html : lzString.compressToEncodedURIComponent(html),
          css : lzString.compressToEncodedURIComponent(css) };
    var query = Object.keys(object).map(function(key) {
      return key + '=' + object[key];
    }).join('&');

    window.location.hash = '?' + query;
}

export function loadState(key) {
    return Object.assign({
        names: [ "App.fs" ],
        codes: [ "// Write code or load a sample from sidebar" ],
        html: "",
        css: ""
      },
      JSON.parse(window.localStorage.getItem(key)) || {},
      parseQuery()
    );
}

export function saveState(key, names, codes, html, css) {
    const payload = JSON.stringify({ names, codes, html, css });
    window.localStorage.setItem(key, payload);
}
