(function() {
  function urlQueryToObject(query) {
    var search = query.substring(1).toLowerCase();

    return JSON.parse('{"' +
      decodeURI(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/\+/g, ' ')
        .replace(/=/g, '":"') +
      '"}');
  }

  window.urlQueryToObject = urlQueryToObject;
})();
