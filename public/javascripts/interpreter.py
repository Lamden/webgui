from cilantro.messages.transaction.contract import *
import capnp
import transaction_capnp
import sys
import os
import json

def kwargs(payload):
    d = {}
    for entry in payload.kwargs.entries:
        if entry.value.which() == 'fixedPoint':
            d[entry.key] = Decimal(entry.value.fixedPoint)
        else:
            d[entry.key] = getattr(entry.value, entry.value.which())

    return d

i = sys.stdin.buffer.read()

#tx = transaction_capnp.ContractTransaction.from_bytes_packed(i)
tx = ContractTransaction._deserialize_data(i)
payload = transaction_capnp.ContractPayload.from_bytes(tx.payload)

#print(tx.metadata.signature)

#print(payload.as_builder().__dir__())

#print("PAYLOAD BYTES REINTERPRETED: {}".format(payload.as_builder().copy().to_bytes().hex()))

print()
print("DESERIALIZED TRANSACTION")
print("------------------------")
print("METADATA")
print("\tSignature: {}".format(str(tx.metadata.signature)))
print("\tProof: {}".format(str(tx.metadata.proof)))
print()
print("PAYLOAD")
print("\tSender: {}".format(str(payload.sender)))
print("\tGas: {}".format(str(payload.stampsSupplied)))
print("\tContract Name: {}".format(str(payload.contractName)))
print("\tFunction Name: {}".format(str(payload.functionName)))
print("\tNonce: {}".format(str(payload.nonce)))
print("\tKwargs: {}".format(kwargs(payload)))
print()
