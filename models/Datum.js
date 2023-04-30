// models/Datum.js

class Datum {
  constructor(id, schema, data) {
    this.id = id; // The unique identifier for the Datum
    this.type = "datum"; // The type of the sharable object (always "datum" for Datum)
    this.schema = schema; // The ID of the Schema that this Datum conforms to
    this.data = data; // An object containing the data fields for the Datum
  }

  // Additional methods or functionality for the Datum class can be added here
}

module.exports = Datum; // Export the Datum class for use in other files

