const admin = require('firebase-admin');

// pull from local env named "ku-share-firebase-key-config.json", should comment it when push to Heroku!!
// const serviceAccount = require('../ku-share-firebase-key-config.json');
// const FirebaseApp = admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: "ku-share-firebase.appspot.com"
// });

// Should change to this if you want it to work on Heroku!!!
const FirebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
        "type": process.env.FIREBASE_TYPE,
        "project_id": process.env.FIREBASE_PROJECT_ID,
        "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY,
        "client_email": process.env.FIREBASE_CLIENT_EMAIL,
        "client_id": process.env.FIREBASE_CLIENT_ID,
        "auth_uri": process.env.FIREBASE_AUTH_URI,
        "token_uri": process.env.FIREBASE_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
      }),
    storageBucket: "ku-share-firebase.appspot.com"
});

const storage = FirebaseApp.storage();
const bucket = storage.bucket();

module.exports = bucket;