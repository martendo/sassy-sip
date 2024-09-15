"use strict";

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js'
import { getFirestore, collection, getDocs, onSnapshot, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js'

let userId = "martin";

const nameSuffixes = [". Bozo", ". Doofus"];

const dashboard = document.getElementById("dashboard");
const login = document.getElementById("login");

const name1 = document.getElementById("name1");
const name2 = document.getElementById("name2");
const pointsDash = document.getElementById("points");
const lastSipDash = document.getElementById("lastsip");
const leaderboard = document.getElementById("leaderboard-body");

function getTimestampString(timestamp) {
	if (timestamp === null) {
		return "None";
	}
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

async function loadData() {
	const userRef = doc(db, "users", userId);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) {
		await setDoc(userRef, {
			name: userId,
			points: 0,
			lastsip: null,
		});
	}
	const unsub = await onSnapshot(collection(db, "users"), (querySnapshot) => {
		for (let i = leaderboard.children.length - 1; i >= 0; i--) {
			leaderboard.removeChild(leaderboard.children[i]);
		}

		const users = [];
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			data["id"] = doc.id;
			users.push(data);
		});
		users.sort((a, b) => b["points"] - a["points"]);
		for (let i = 0; i < users.length; i++) {
			const user = users[i];
			const id = user["id"];
			const name = user["name"];
			const points = user["points"];
			const timestamp = user["lastsip"];
			if (id === userId) {
				// For the logged in user, instead of adding to leaderboard, update dashboard
				name1.textContent = name + nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)];
				name2.textContent = name;
				pointsDash.textContent = points;
				lastSipDash.textContent = getTimestampString(timestamp);
				if (lastSipDash.hasAttribute("interval")) {
					clearInterval(parseInt(lastSipDash.getAttribute("interval"), 10));
				}
				lastSipDash.setAttribute("interval", setInterval(() => {
					lastSipDash.textContent = getTimestampString(timestamp);
				}, 1000));
			}

			const row = leaderboard.insertRow();
			const rankCell = row.insertCell();
			rankCell.className = "rankcell";
			const nameCell = row.insertCell();
			nameCell.className = "namecell";
			const pointsCell = row.insertCell();
			pointsCell.className = "pointscell";
			const lastSipCell = row.insertCell();
			lastSipCell.className = "lastsipcell";

			rankCell.textContent = i + 1;
			if (id === userId) {
				nameCell.innerHTML = `${name} <span class="marker-text">(you)</span>`;
			} else {
				nameCell.textContent = name;
			}
			pointsCell.textContent = points;
			lastSipCell.textContent = getTimestampString(timestamp);
			lastSipCell.setAttribute("interval", setInterval(() => {
				lastSipCell.textContent = getTimestampString(timestamp);
			}, 1000));
		}
		dashboard.style.display = "block";
		login.style.display = "none";
	});
}

const loginInput = document.getElementById("login-input");
const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", () => {
	userId = loginInput.value;
	loadData();
});
loginInput.addEventListener("keydown", (event) => {
	if (event.key !== "Enter") {
		return;
	}
	userId = loginInput.value;
	loadData();
});
