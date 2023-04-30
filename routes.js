const vm = require('vm');
const express = require('express');
const router = express.Router();
const Datum = require('./models/Datum');
const Function = require('./models/Function');
const Schema = require('./models/Schema');

// In-memory database for storing Sharable objects
const db = {};

// Read operation
router.get('/api/read/:id', (req, res) => {
  const id = req.params.id;
  const sharable = db[id];
  if (!sharable) {
    return res.status(404).json({ error: 'ID not found' });
  }
  res.json(sharable);
});

// Helper function to validate input data
function validate(sharable, db) {
  if (!sharable || !sharable.id || !sharable.type) {
    return 'Invalid input or missing ID or type';
  }

  if (sharable.type === 'datum') {
    if (!sharable.schema) {
      return 'Missing schema for datum';
    }
    const schema = db[sharable.schema];
    if (!schema || schema.type !== 'schema') {
      return 'Schema not found or invalid';
    }
    for (const field in sharable) {
      if (field !== 'id' && field !== 'type' && field !== 'schema' && !schema.fields[field]) {
        return `Invalid field '${field}' not defined in schema`;
      }
    }
  }

  return true;
}

// Create operation
router.post('/api/create', (req, res) => {
  const sharable = req.body;
  const validationResult = validate(sharable, db);
  if (validationResult !== true) {
    return res.status(400).json({ error: validationResult });
  }
  if (db[sharable.id]) {
    return res.status(400).json({ error: 'ID already exists' });
  }
  db[sharable.id] = sharable;
  res.json({ id: sharable.id });
});

// Update operation
router.put('/api/update/:id', (req, res) => {
  const id = req.params.id;
  const sharable = req.body;
  const validationResult = validate(sharable, db);
  if (validationResult !== true) {
    return res.status(400).json({ error: validationResult });
  }
  if (!sharable.id || sharable.id !== id) {
    return res.status(400).json({ error: 'Invalid input or ID mismatch' });
  }
  db[id] = sharable;
  res.json(sharable);
});

// Delete operation
router.delete('/api/delete/:id', (req, res) => {
  const id = req.params.id;
  if (!db[id]) {
    return res.status(404).json({ error: 'ID not found' });
  }
  delete db[id];
  res.json({ success: true });
});

// Run operation for Functions
router.post('/api/run/:id', (req, res) => {
  console.log('Received request to run function');
  const id = req.params.id;
  const args = req.body.args;
  console.log('Args:', args);
  const sharable = db[id];
  if (!sharable || sharable.type !== 'function') {
    return res.status(404).json({ error: 'Function not found' });
  }
  console.log('Function found:', sharable);
  const script = new vm.Script(sharable.code);
  const context = vm.createContext();
  script.runInContext(context);
  let result;
  try {
    // Use the correct function name "revcomp" when calling the function
    result = context.revcomp(...args);
  } catch (error) {
    console.error('Execution error:', error);
    return res.status(500).json({ error: 'Execution error' });
  }
  console.log('Execution result:', result);
  res.json({ result });
});


module.exports = router;
