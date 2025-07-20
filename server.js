#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from dist directory
app.use(express.static('dist'));

// Health check endpoint
app.get('/health.json', (req, res) => {
  const healthFile = path.join(__dirname, 'dist', 'health.json');
  if (fs.existsSync(healthFile)) {
    res.sendFile(healthFile);
  } else {
    res.json({
      status: 'healthy',
      service: 'neptunize-frontend',
      timestamp: new Date().toISOString()
    });
  }
});

// Handle SPA routing - serve index.html for all non-api routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend server running on port ${port}`);
});
