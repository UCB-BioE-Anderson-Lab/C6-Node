const vm = require('vm');
const express = require('express');
const router = express.Router();
const Datum = require('./models/Datum');
const Function = require(
    './models/Function');
const Schema = require(
    './models/Schema');

// In-memory database for storing Sharable objects
const db = {};

// Read operation
router.get('/api/read/:id', (req,
    res) => {
        const id = req.params.id;
        const sharable = db[id];
        if (!sharable) {
            return res.status(404)
                .json({
                    error: 'ID not found'
                });
        }
        res.json(sharable);
    });

// Example JSON objects for the three different types
const exampleFunction = {
    id: 'example_function_id',
    type: 'function',
    code: '/* function code */'
};

const exampleDatum = {
    id: 'example_datum_id',
    type: 'datum',
    schema: 'example_schema',
    data: {
        /* data fields */ }
};

const exampleSchema = {
    id: 'example_schema_id',
    type: 'schema',
    fields: {
        /* schema fields */ }
};

// Custom error class for validation errors
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name =
            'ValidationError';
    }
}

// Helper function to validate input data
function validate(sharable, db) {
    // Check if the 'type' field is defined
    if (!sharable || !sharable.id || !
        sharable.type) {
        throw new ValidationError(
            'Invalid input or missing ID or type. You have three choices for the type: function, datum, schema.\n' +
            'Examples:\n' +
            JSON.stringify(
                exampleFunction,
                null, 2) + '\n' +
            JSON.stringify(
                exampleDatum, null,
                2) + '\n' +
            JSON.stringify(
                exampleSchema, null,
                2)
        );
    }

    // Check if the 'type' field has a valid value
    if (!['function', 'datum', 'schema']
        .includes(sharable.type)) {
        throw new ValidationError(
            `Invalid type '${sharable.type}'. You have three choices for the type: function, datum, schema.\n` +
            'Examples:\n' +
            JSON.stringify(
                exampleFunction,
                null, 2) + '\n' +
            JSON.stringify(
                exampleDatum, null,
                2) + '\n' +
            JSON.stringify(
                exampleSchema, null,
                2)
        );
    }

    // Validate based on the type
    if (sharable.type === 'datum') {
        if (!sharable.schema) {
            throw new ValidationError(
                'Missing schema for datum.\n' +
                'Example:\n' +
                JSON.stringify(
                    exampleDatum,
                    null, 2)
            );
        }
        const schema = db[sharable
            .schema];
        if (!schema || schema.type !==
            'schema') {
            throw new ValidationError(
                'Schema not found or invalid.\n' +
                'Example:\n' +
                JSON.stringify(
                    exampleSchema,
                    null, 2)
            );
        }
        // Additional validation for datum fields based on the schema
        if (!sharable.data ||
            typeof sharable.data !==
            'object') {
            throw new ValidationError(
                'Missing or invalid data field for datum.\n' +
                'Example:\n' +
                JSON.stringify(
                    exampleDatum,
                    null, 2)
            );
        }
        for (const field in sharable
                .data) {
            if (!schema.fields[field]) {
                throw new ValidationError(
                    `Invalid field '${field}' not defined in schema.\n` +
                    'Example:\n' +
                    JSON.stringify(
                        exampleDatum,
                        null, 2)
                );
            }
        }
    } else if (sharable.type ===
        'function') {
        // Validation for function type
        if (!sharable.code ||
            typeof sharable.code !==
            'string') {
            throw new ValidationError(
                'Missing or invalid code field for function.\n' +
                'Example:\n' +
                JSON.stringify(
                    exampleFunction,
                    null, 2)
            );
        }
    } else if (sharable.type ===
        'schema') {
        // Validation for schema type
        if (!sharable.fields ||
            typeof sharable.fields !==
            'object') {
            throw new ValidationError(
                'Missing or invalid fields for schema.\n' +
                'Example:\n' +
                JSON.stringify(
                    exampleSchema,
                    null, 2)
            );
        }
    }

    return true;
}

// Create operation
router.post('/api/create', (req,
res) => {
    const sharable = req.body;
    const validationResult =
        validate(sharable, db);
    if (validationResult !==
        true) {
        return res.status(400)
            .json({
                error: validationResult
            });
    }
    if (db[sharable.id]) {
        return res.status(400)
            .json({
                error: 'ID already exists'
            });
    }
    db[sharable.id] = sharable;
    res.json({
        id: sharable.id
    });
});

// Update operation
router.put('/api/update/:id', (req,
    res) => {
        const id = req.params.id;
        const {
            type,
            data
        } = req.body;

        // Check if the sharable object exists in the database
        if (!db[id]) {
            return res.status(404)
                .json({
                    error: 'ID not found'
                });
        }

        // Create a new sharable object with the updated properties
        const updatedSharable = {
            id: id,
            type: type,
            data: data
        };

        // Validate the updated sharable object
        const validationResult =
            validate(
                updatedSharable, db
                );
        if (validationResult !==
            true) {
            return res.status(400)
                .json({
                    error: validationResult
                });
        }

        // Perform the update operation
        db[id] = updatedSharable;
        res.json(updatedSharable);
    });

// Delete operation
router.delete('/api/delete/:id', (req,
    res) => {
    const id = req.params.id;
    if (!db[id]) {
        return res.status(404)
            .json({
                error: 'ID not found'
            });
    }
    delete db[id];
    res.json({
        success: true
    });
});

// Run operation for Functions
router.post('/api/run/:id', (req,
    res) => {
        console.log(
            'Received request to run function'
            );
        const id = req.params.id;
        const args = req.body.args;
        console.log('Args:', args);
        const sharable = db[id];
        if (!sharable || sharable
            .type !== 'function') {
            return res.status(404)
                .json({
                    error: 'Function not found'
                });
        }
        console.log(
            'Function found:',
            sharable);
        const script = new vm
            .Script(sharable.code);
        const context = vm
            .createContext();
        script.runInContext(
        context);
        let result;
        try {
            // Use the correct function name "revcomp" when calling the function
            result = context
                .revcomp(...args);
        } catch (error) {
            console.error(
                'Execution error:',
                error);
            return res.status(500)
                .json({
                    error: 'Execution error'
                });
        }
        console.log(
            'Execution result:',
            result);
        res.json({
            result
        });
    });


module.exports = router;