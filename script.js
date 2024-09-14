"use strict";

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js'
import { getFirestore, collection, getDocs, onSnapshot, doc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js'

const userId = "martin";

const name1 = document.getElementById("name1");
const name2 = document.getElementById("name2");
const points = document.getElementById("points");
const lastSip = document.getElementById("last-sip");
const leaderboard = document.getElementById("leaderboard-body");

function getTimestampString(timestamp) {
	const seconds = Math.floor(Date.now() / 1000) - timestamp;
	if (seconds >= 2 * 24 * 3600) {
		return `${Math.floor(seconds / (24 * 3600))} days ago`;
	} else if (seconds >= 24 * 3600) {
		return "yesterday";
	} else if (seconds >= 2 * 3600) {
		return `${Math.floor(seconds / 3600)} hours ago`;
	} else if (seconds >= 3600) {
		return "1 hour ago";
	} else if (seconds >= 60) {
		return `${Math.floor(seconds / 60)} min ago`;
	}
	return `${seconds} sec ago`;
}

const app = initializeApp({
	apiKey: "AIzaSyBcnkE7Xkt6hp9p5C97WKwvkaAVhr5hCGo",
	authDomain: "waterboo-e7da1.firebaseapp.com",
	projectId: "waterboo-e7da1",
	storageBucket: "waterboo-e7da1.appspot.com",
	messagingSenderId: "157604762084",
	appId: "1:157604762084:web:5dfec3183bdaa6435837f1"
});

const db = getFirestore(app);
const unsub = await onSnapshot(collection(db, "users"), (querySnapshot) => {
	querySnapshot.forEach((doc) => {
		const data = doc.data();
		console.log(doc.id, data);
		if (doc.id === userId) {
			// For the logged in user, instead of adding to leaderboard, update dashboard
			name1.textContent = data["name"];
			name2.textContent = data["name"];
			points.textContent = data["points"];
			const timestamp = data["last-sip"];
			lastSip.textContent = getTimestampString(timestamp);
			if (lastSip.className !== "") {
				clearInterval(parseInt(lastSip.className, 10));
			}
			lastSip.className = setInterval(() => {
				lastSip.textContent = getTimestampString(timestamp);
			}, 1000);
			return;
		}
		let nameCell = document.getElementById(`user-name-${doc.id}`);
		console.log(nameCell);
		let pointsCell = document.getElementById(`user-points-${doc.id}`);
		let lastSipCell = document.getElementById(`user-last-sip-${doc.id}`);
		if (nameCell === null) {
			const row = leaderboard.insertRow();
			nameCell = row.insertCell();
			nameCell.id = `user-name-${doc.id}`;
			pointsCell = row.insertCell();
			pointsCell.id = `user-points-${doc.id}`;
			lastSipCell = row.insertCell();
			lastSipCell.id = `user-last-sip-${doc.id}`;
		}
		nameCell.textContent = data["name"];
		pointsCell.textContent = data["points"];
		const timestamp = data["last-sip"];
		lastSipCell.textContent = getTimestampString(timestamp);
		if (lastSipCell.className !== "") {
			clearInterval(parseInt(lastSipCell.className, 10));
		}
		lastSipCell.className = setInterval(() => {
			lastSipCell.textContent = getTimestampString(timestamp);
		}, 1000);
	});
});
