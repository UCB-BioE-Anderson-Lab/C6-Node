// models/Schema.js

class Schema {
  constructor(id, description, fields) {
    this.id = id; // The unique identifier for the Schema
    this.type = "schema"; // The type of the sharable object (always "schema" for Schema)
    this.description = description; // A description of the Schema
    this.fields = fields; // An object defining the fields and their types for the Schema
  }

  // Additional methods or functionality for the Schema class can be added here
}

module.exports = Schema; // Export the Schema class for use in other files

