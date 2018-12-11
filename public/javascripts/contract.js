const capnp = require('capnp-ts');
const transactionSchemas = require('./transaction.capnp');
const helpers = require('./helpers');
const wallet = require('./wallet');
const pow = require('./pow');

const ContractTransaction = transactionSchemas.ContractTransaction;
const Metadata = transactionSchemas.Metadata;
const ContractPayload = transactionSchemas.ContractPayload;
const Kwargs = transactionSchemas.Kwargs;
const Value = transactionSchemas.Value;
const Map = transactionSchemas.Map;

class CurrencyContractTransaction {
    constructor() {
        this.sender_sk = null;
        this.sender = null;
        this.stamps_supplied = null;
        this.nonce = null;
        this.to = null;
        this.amount = null;
        this.contract_name = null;
        this.func_name = null;
        this.signature = null;
        this.pow = null;
    }

    // PSUEDO-CONSTRUCTOR
    create(sender_sk, stamps_supplied, nonce, to, amount, contract_name='currency', func_name='transfer') {
        // Fill the class objects for later use
        // These are initialized here instead of in the constructor so we can emulate having multiple
        // constructors (as with in python @class_method)
        this.sender_sk = sender_sk;
        this.stamps_supplied = stamps_supplied;
        this.nonce = nonce;
        this.to = to;
        this.amount = amount;
        this.contract_name = contract_name;
        this.func_name = func_name;

        // Initialize capnp objects
        const struct = new capnp.Message();
        const tx = struct.initRoot(ContractTransaction);
        const metadata = tx.initMetadata();
        const message = new capnp.Message();
        const payload = message.initRoot(ContractPayload);
        const valuebuffer = new capnp.Message(); // In order to set the value we need to
                                                 // construct it as a message than deepcopy
                                                 // it over
        const valuebuf = valuebuffer.initRoot(Value);
        const kwargs = payload.initKwargs();
        const entries = kwargs.initEntries(2); // Set to static length of 2 for currency contract

        // Cast required inputs to capnp types
        const stamps = capnp.Uint64.fromNumber(this.stamps_supplied);

        // Build the deterministic section of the payload
        payload.setContractName(this.contract_name);
        payload.setFunctionName(this.func_name);
        payload.setNonce(this.nonce);
        payload.setSender(wallet.get_vk(this.sender_sk));
        payload.setStampsSupplied(stamps);

        // Build the non-deterministic section of the payload (kwargs)
        entries.get(0).setKey('to');
        entries.get(1).setKey('amount');
        valuebuf.setText(this.to); // Fill the buffer with the 'to' text
        entries.get(0).setValue(valuebuf);
        valuebuf.setFixedPoint(this.amount.toString()); // Fill the buffer with the amount
        entries.get(1).setValue(valuebuf);

        // Get the payload bytes
        const plbytes = new Uint8Array(message.toArrayBuffer());

        // Get signature
        this.signature = wallet.sign(this.sender_sk, plbytes);
        const sigbuf = helpers.str2ab(this.signature);
        const msig = metadata.initSignature(sigbuf.byteLength);
        msig.copyBuffer(sigbuf);

        // Calculate POW
        this.pow = pow.find(plbytes);
        const powbuf = helpers.str2ab(this.pow.pow);
        const mpow = metadata.initProof(powbuf.byteLength);
        mpow.copyBuffer(powbuf);

        // Set payload of tx -- payload binary
        const pl = tx.initPayload(plbytes.byteLength);
        pl.copyBuffer(plbytes);

        return struct;
    }

    toBytesPacked() {
        return this.tx.toPackedArrayBuffer();
    }

    toBytes() {
        return this.tx.toArrayBuffer();
    }

    deserializePayload(i) {
        const msg = new capnp.Message(i);
        const payload = msg.getRoot(ContractPayload);
        return payload;
    }

    deserializeData(i) {
        const msg = new capnp.Message(i);
        const tx = msg.getRoot(ContractTransaction);
        return tx;
    }
}

module.exports.CurrencyContractTransaction = CurrencyContractTransaction;
