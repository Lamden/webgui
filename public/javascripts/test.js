const contract = require('./contract');
const wallet = require('./wallet');

var kp = wallet.new_wallet();

//console.log("SK: " + kp.sk);
//console.log("VK: " + kp.vk);

const nonce = kp.vk + 'B'.repeat(64);
const to = 'B'.repeat(64);


var cct = new contract.CurrencyContractTransaction(kp.sk, 100, nonce, to, 6000.12);
var cct2 = new contract.CurrencyContractTransaction();
var cctbytes = cct.toBytesPacked()
const buffer = new Buffer.from(cctbytes);

process.stdout.write(buffer);

var rescct = cct.deserializeData(buffer);
console.log(rescct);
