const path = require('path');
const fs = require('fs');
const solc = require('solc');

const web2decetoragePath = path.resolve(__dirname, 'contracts', 'web2decentorage.sol');
const source = fs.readFileSync(web2decetoragePath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':web2decentorage'];