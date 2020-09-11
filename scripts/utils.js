const path = require('path');
module.exports = {
  root: p => path.join(__dirname, '..', p),
  packages: p => path.join(__dirname, '../packages', p)
}
