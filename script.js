"use strict";

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js'
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js'

const app = initializeApp({
	apiKey: "AIzaSyBcnkE7Xkt6hp9p5C97WKwvkaAVhr5hCGo",
	authDomain: "waterboo-e7da1.firebaseapp.com",
	projectId: "waterboo-e7da1",
	storageBucket: "waterboo-e7da1.appspot.com",
	messagingSenderId: "157604762084",
	appId: "1:157604762084:web:5dfec3183bdaa6435837f1"
});

const db = getFirestore(app);
const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
	console.log(doc.id, doc.data());
});
