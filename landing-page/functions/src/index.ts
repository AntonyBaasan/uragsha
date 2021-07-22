import * as functions from 'firebase-functions';
const escapeHtml = require('escape-html');

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    functions.logger.info('Hello logs!', { structuredData: true });
    const email = escapeHtml(req.query.email || req.params.email);
    res.send({ message: 'Hello from Firebase! echo:' + email });
  }
});
