const handler = require('./handler');
(async function() {
  console.log(await handler.generate());

})();
