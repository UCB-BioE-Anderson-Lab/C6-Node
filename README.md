# C6-Node API and Plugin for ChatGPT

C6-Node is a simple Node.js server that provides an API for creating, reading, updating, deleting, and running sharable objects such as functions, data, and schemas. The server uses an in-memory database to store the sharable objects.

## Features

- Create, read, update, and delete sharable objects.
- Run functions with specified arguments and receive the results.
- Support for different types of sharable objects: functions, data, and schemas.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the C6-Node repository:
git clone https://github.com/your-username/C6-Node.git

2. Change to the C6-Node directory:
cd C6-Node

3. Install the required dependencies:
npm install

### Running the Server

1. Start the server:
npm start
-or-
node index.js

2. The server will start running on `http://localhost:3000`.

## API Endpoints

### Create a Sharable Object

- Endpoint: `POST /api/create`
- Request Body: JSON object representing the sharable object (function, datum, or schema).
- Response: JSON object containing the ID of the created sharable object.

### Read a Sharable Object

- Endpoint: `GET /api/read/:id`
- URL Parameter: `id` (ID of the sharable object to read).
- Response: JSON object representing the sharable object.

### Update a Sharable Object

- Endpoint: `PUT /api/update/:id`
- URL Parameter: `id` (ID of the sharable object to update).
- Request Body: JSON object representing the updated sharable object.
- Response: JSON object representing the updated sharable object.

### Delete a Sharable Object

- Endpoint: `DELETE /api/delete/:id`
- URL Parameter: `id` (ID of the sharable object to delete).
- Response: JSON object indicating success or failure.

### Run a Function

- Endpoint: `POST /api/run/:id`
- URL Parameter: `id` (ID of the function to run).
- Request Body: JSON object containing an array of arguments to pass to the function.
- Response: JSON object containing the result of the function execution.


## Usage with ChatGPT
To use this plugin with ChatGPT, you need to host the manifest file (.well-known/ai-plugin.json) on your server and provide the OpenAPI specification (openapi.yaml) that describes the plugin's API. Running index.js will take care of this. Follow the instructions provided by OpenAI to enable the plugin in ChatGPT.

Once the plugin is enabled, you can interact with it in ChatGPT by providing instructions that reference the plugin's functionality. The C6-Node plugin provides CRUD (Create, Read, Update, Delete) operations for sharable objects, as well as the ability to run functions. Here are some example interactions:

## Testing with ChatGPT
See https://shareg.pt/hykYCwM
In this conversation, we used the C6-Node plugin to create a "translate" function that translates DNA sequences into protein sequences. ChatGPT started by creating the initial version of the function using the "createSharable" method of the C6-Node plugin. It then tested the function using the "runFunction" method with a provided DNA sequence, and the function successfully translated the sequence into a protein sequence.

Next, we discussed various edge case scenarios, including handling sequences that don't start with a start codon, sequences with internal stop codons, sequences with lengths not divisible by three, and sequences with degeneracy bases. ChatGPT updated the function to handle these edge cases. However, the updated code was too long for the input format, so ChatGPT automatically shortened it by removing comments and unnecessary newlines.

After updating the function using the "updateSharable" method, ChatGPT tested it with various edge cases. It encountered some issues with sequences that were not multiples of three in length, which led to confusion in the testing process. After correcting the test sequences, the function successfully handled all edge cases, including interpreting degeneracy bases as 'X' amino acids and rejecting sequences with internal stop codons.

Overall, ChatGPT successfully created, updated, and tested the "translate" function using the C6-Node plugin, addressing edge case behavior and resolving issues encountered during testing. The final function is robust and handles a wide range of DNA sequences.

### Create a Function
User: Use the C6-Node Plugin to create a function with the ID "exampleFunction" that returns the square of a number.

### Read a Sharable Object
User: Use the C6-Node Plugin to get information for the ID "exampleFunction".

### Update a Function
User: Use the C6-Node Plugin to update the function with the ID "exampleFunction" to return the cube of a number.

### Delete a Sharable Object
User: Use the C6-Node Plugin to delete the object with the ID "exampleFunction".

### Run a Function
User: Use the C6-Node Plugin to run the function with the ID "exampleFunction" with the argument 3.

These are just examples of how you can interact with the C6-Node plugin in ChatGPT. You can use similar instructions to create, read, update, delete, and run other types of sharable objects, such as data and schemas.

## License

This project is licensed under the [Apache License](http://www.apache.org/licenses/).

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues to improve the plugin or suggest new features.

## Disclaimer

This plugin is for educational purposes only and is not intended for production use. Please use it as a reference for building your own ChatGPT plugins.
