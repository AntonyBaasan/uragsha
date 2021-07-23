
import * as functions from 'firebase-functions';
const mailchimp = require('@mailchimp/mailchimp_marketing');
const escapeHtml = require('escape-html');
import { MailchimpService } from './mailchimp-service';

mailchimp.setConfig({
  apiKey: functions.config().mailchimp.apikey,
  server: functions.config().mailchimp.server,
});

const cors = (req: any, res: any, callback: any) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    callback(req, res);
  }
};

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const emailSubscribe = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const email = escapeHtml(req.query.email || req.params.email);
      const mailchimpService = new MailchimpService(mailchimp);
      const result = await mailchimpService.subscritionRequest(email);
      res.send({ message: result });
    } catch (err) {
      const mailchimpErrorResponse = JSON.parse(err.response.text);
      console.error(mailchimpErrorResponse.title);
      res.status(400).send({ errorMessage: mailchimpErrorResponse.title });
    }
  });
});

export const pingToMailchimp = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const mailchimpService = new MailchimpService(mailchimp);
    const result = await mailchimpService.ping();
    res.send({ message: result });
  });
});
