@0x921d030365beff8c;

struct MetaData {
    proof @0 :Data;
    signature @1 :Data;
    timestamp @2 :Float32;
}


struct ContractPayload {
    sender @0 :Text;
    nonce @1 :Text;
    stampsSupplied @2 :UInt64;

    contractName @3 :Text;
    functionName @4 :Text;
    kwargs @5 :Map(Value);
}


struct ContractTransaction {
    metadata @0: MetaData;
    payload @1: Data;
}


struct PublishPayload {
    sender @0 :Text;
    nonce @1 :Text;
    stampsSupplied @2 :UInt64;

    contractName @3 :Text;
    contractCode @4 :Text;

}


struct PublishTransaction {
    metadata @0: MetaData;
    payload @1: Data;
}


struct TransactionData {
    contractTransaction @0 :ContractTransaction;
    status @1: Text;
    state @2: Text;
    contractType @3: UInt16;
}


struct Transactions {
    transactions @0 :List(Data);
}


struct TransactionContainer {
    type @0 :UInt16;
    payload @1 :Data;
}


struct OrderingContainer {
    type @0 :UInt16;
    transaction @1 :Data;
    utcTimeMs @2 :UInt64;
}


struct TransactionBatch {
    transactions @0 :List(OrderingContainer);
}


struct StandardTransaction {
    metadata @0 :MetaData;
    payload @1 :Payload;

    struct Payload {
        sender @0 :Data;
        receiver @1 :Data;
        amount @2 :UInt64;
    }
}

struct Value {
 union {
   void @0 :Void;
   bool @1 :Bool;

   int8 @2 :Int8;
   int16 @3 :Int16;
   int32 @4 :Int32;
   int64 @5 :Int64;
   uint8 @6 :UInt8;
   uint16 @7 :UInt16;
   uint32 @8 :UInt32;
   uint64 @9 :UInt64;

   fixedPoint @10 :Text;

   float32 @11 :Float32;
   float64 @12 :Float64;

   text @13 :Text;
   data @14 :Data;

   list @15 :AnyPointer;

   enum @16 :UInt16;
   struct @17 :AnyPointer;

   anyPointer @18 :AnyPointer;
 }
}


struct Map(Value) {
  entries @0 :List(Entry);
  struct Entry {
    key @0 :Text;
    value @1 :Value;
  }
}


struct Kwargs {
    kwargs @0: Map(Value);
}
