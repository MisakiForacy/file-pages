/* GitHub Pages 镜像：把 /api 与 /games 转发到 file.foracy.site */
(function () {
  var ORIGIN = 'https://file.foracy.site';
  var prefixes = ['/api/'];

  function mapUrl(u) {
    try {
      var s = String(u);
      if (s.charAt(0) !== '/') return null;
      for (var i = 0; i < prefixes.length; i++) {
        if (s.indexOf(prefixes[i]) === 0) return ORIGIN + s;
      }
      return null;
    } catch (e) { return null; }
  }

  var rawFetch = window.fetch;
  if (rawFetch) {
    window.fetch = function (input, init) {
      if (typeof input === 'string') { var m = mapUrl(input); if (m) input = m; }
      else if (input && input.url) { var n = mapUrl(input.url); if (n) input = new Request(n, input); }
      return rawFetch.call(window, input, init);
    };
  }

  var rawOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    var m = mapUrl(url); if (m) arguments[1] = m;
    return rawOpen.apply(this, arguments);
  };
})();
