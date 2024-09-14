"use strict";

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js'
import { getFirestore, collection, getDocs, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js'

const leaderboard = document.getElementById("leaderboard-body");

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
	const data = doc.data();
	console.log(doc.id, data);
	const row = leaderboard.insertRow();
	row.id = `row-${doc.id}`;
	const nameCell = row.insertCell();
	const pointsCell = row.insertCell();
	const lastSipCell = row.insertCell();
	nameCell.textContent = data["name"];
	pointsCell.textContent = data["points"];
	const timestamp = data["last-sip"];
	const seconds = Math.floor(Date.now() / 1000) - timestamp;
	let lastSipString;
	if (seconds >= 2 * 24 * 3600) {
		lastSipString = `${Math.floor(seconds / (24 * 3600))} days ago`;
	} else if (seconds >= 24 * 3600) {
		lastSipString = "yesterday";
	} else if (seconds >= 2 * 3600) {
		lastSipString = `${Math.floor(seconds / 3600)} hours ago`;
	} else if (seconds >= 3600) {
		lastSipString = "1 hour ago";
	} else if (seconds >= 60) {
		lastSipString = `${Math.floor(seconds / 60)} min ago`;
	} else {
		lastSipString = `${seconds} sec ago`;
	}
	lastSipCell.textContent = lastSipString;
});
