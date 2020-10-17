const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp();

const express = require('express');
const app = express();
const firebase = require('firebase')
const config =   {
    apiKey: "AIzaSyBtv1TvNzuYdNLKe-jcgoWieJc2SNYh-Ww",
    authDomain: "tu-update.firebaseapp.com",
    databaseURL: "https://tu-update.firebaseio.com",
    projectId: "tu-update",
    storageBucket: "tu-update.appspot.com",
    messagingSenderId: "567590286871",
    appId: "1:567590286871:web:fe251e9b17064e1f68ce52",
    measurementId: "G-X9MVQ9WNTD"
  };
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello World");
// });

firebase.initializeApp(config)

// Getiing Updates From firebase

app.get('/updates',(req,res)=>{
    admin.firestore().collection('updates')
        .orderBy('createdAt','desc')
        .get()
        .then(data=> {
            let updates = [];
            data.forEach(doc=>{
                updates.push({
                    updateId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });

            });
            return res.json(updates)
        })
        .catch((err)=> console.error(err));
})

//Adding Updates By passing JSON
app.post('/add',(req,res)=>{
    const newUpdate = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    }
    admin.firestore().collection('updates')
        .add(newUpdate)
        .then(doc=>{
            res.json({message: `The Data with Id ${doc.id} added successfully to the database` });
        })
        .catch((err)=> {
            res.status(500).json({error: `File couldn't be added`});
            console.error(err)
        })

});

//Signup Route
app.post('/signUp',(req,res)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        conPass: req.body.conPass,
        handle: req.body.handle,
    };
    
    //Data Validation for the sign up Pages
    
    firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
        .then(data =>{
            return res.status(201).json({
                message: `user ${data.user.uid} has registered sucessfully`
            });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({
                error : err.code
            });
        })
})
exports.api = functions.https.onRequest(app);

