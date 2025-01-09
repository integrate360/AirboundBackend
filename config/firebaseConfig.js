const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with service account credentials
const serviceAccount = require('../helper/service-account-key.json');  // Replace with your actual service account key path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
