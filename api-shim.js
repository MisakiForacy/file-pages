/* GitHub Pages 镜像：/api/* 转发到 file.foracy.site；不可用时退回数据快照 */
(function () {
  var ORIGIN = 'https://file.foracy.site';
  var SNAPSHOT_BASE = 'https://misakiforacy.github.io/myblog/data/';

  function mapUrl(u) {
    try {
      var s = String(u);
      if (s.charAt(0) !== '/') return null;
      if (s.indexOf('/api/') === 0) return ORIGIN + s;
      return null;
    } catch (e) { return null; }
  }
  function snapshotFor(url) {
    if (!url) return null;
    if (url.indexOf(ORIGIN + '/api/files') === 0) return SNAPSHOT_BASE + 'files.json';
    return null;
  }

  var rawFetch = window.fetch;
  if (rawFetch) {
    window.fetch = function (input, init) {
      var original = typeof input === 'string' ? input : (input && input.url);
      var mapped = mapUrl(original);
      if (!mapped) return rawFetch.call(window, input, init);
      return rawFetch.call(window, mapped, init).then(function (res) {
        if (res && res.ok) return res;
        var snap = snapshotFor(mapped);
        if (!snap) return res;
        return rawFetch.call(window, snap, { cache: 'no-store' });
      }).catch(function () {
        var snap = snapshotFor(mapped);
        if (!snap) throw new Error('network');
        return rawFetch.call(window, snap, { cache: 'no-store' });
      });
    };
  }

  var rawOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    var m = mapUrl(url); if (m) arguments[1] = m;
    return rawOpen.apply(this, arguments);
  };
})();
