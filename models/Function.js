// models/Function.js

class Function {
  constructor(id, description, parameters, code) {
    this.id = id; // The unique identifier for the Function
    this.type = "function"; // The type of the sharable object (always "function" for Function)
    this.description = description; // A description of the Function
    this.parameters = parameters; // An array of objects defining the parameters for the Function
    this.code = code; // The executable code for the Function (as a string or function reference)
  }

  // Additional methods or functionality for the Function class can be added here
}

module.exports = Function; // Export the Function class for use in other files

