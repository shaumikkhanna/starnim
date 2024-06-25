let lastMoveByPlayer = false; // Indicate if the last move was made by the player

document.addEventListener("DOMContentLoaded", function () {
	const n = localStorage.getItem("n"); // Retrieve 'n' from local storage
	generateStar(parseInt(n, 10)); // Ensure 'n' is an integer and generate the star
	attachNodeEventListeners(); // Attach event listeners after nodes are created
});

function startGame() {
	const n = document.getElementById("n-input").value;
	const difficulty = document.getElementById("difficulty").value;

	// Check if 'n' is odd
	if (n % 2 === 0) {
		alert("Please enter an odd number for 'n'.");
		return false; // Prevent form submission
	}

	localStorage.setItem("n", n);
	localStorage.setItem("difficulty", difficulty);
	window.location.href = "/game"; // Redirect to the game page
}

function attachNodeEventListeners() {
	const nodes = document.querySelectorAll(".node");
	nodes.forEach((node) => {
		node.addEventListener("click", function () {
			if (this.classList.contains("selected")) {
				this.classList.remove("selected");
			} else {
				const selectedNodes =
					document.querySelectorAll(".node.selected");
				if (selectedNodes.length === 0) {
					// No nodes selected, free to select any node
					this.classList.add("selected");
				} else if (selectedNodes.length === 1) {
					// One node already selected, check if it's a neighbor
					if (areNodesConnected(this, selectedNodes[0])) {
						this.classList.add("selected");
					} else {
						alert(
							"You can only select two nodes if they are directly connected."
						);
					}
				} else {
					// Two nodes already selected, no more selections allowed
					alert("No more than two nodes can be selected.");
				}
			}
		});
	});
}

function areNodesConnected(node1, node2) {
	// Check if there's a line connecting these two nodes
	const svg = document.querySelector("svg");
	const lines = svg.querySelectorAll("line");
	return Array.from(lines).some(
		(line) =>
			(line.getAttribute("x1") == node1.getAttribute("cx") &&
				line.getAttribute("y1") == node1.getAttribute("cy") &&
				line.getAttribute("x2") == node2.getAttribute("cx") &&
				line.getAttribute("y2") == node2.getAttribute("cy")) ||
			(line.getAttribute("x2") == node1.getAttribute("cx") &&
				line.getAttribute("y2") == node1.getAttribute("cy") &&
				line.getAttribute("x1") == node2.getAttribute("cx") &&
				line.getAttribute("y1") == node2.getAttribute("cy"))
	);
}

document.getElementById("submit-move").addEventListener("click", function () {
	const selectedNodes = document.querySelectorAll(".node.selected");
	selectedNodes.forEach((node) => {
		node.classList.add("removed");
		node.classList.remove("selected"); // Remove the selected class to reset the state
	});

	lastMoveByPlayer = true; // Indicate that the last move was made by the player
	checkGameStatus(); // Check if the game has ended
});

function generateStar(n) {
	const svgNS = "http://www.w3.org/2000/svg";
	const centerX = 300;
	const centerY = 300;
	const radius = 250;
	const step = (2 * Math.PI) / n;
	let points = [];

	const svg = document.querySelector("svg");
	svg.innerHTML = ""; // Clear previous content

	// Generate points
	for (let i = 0; i < n; i++) {
		let x = Math.round(centerX + radius * Math.cos(i * step));
		let y = Math.round(centerY + radius * Math.sin(i * step));
		points.push({ x, y, id: `node${i + 1}` });
	}

	// Draw lines for each point to the opposite side connections
	points.forEach((point, index) => {
		// Calculate indices considering even/odd total points
		let oppositeIndex1 = (index + Math.floor(n / 2)) % n;
		let oppositeIndex2 = (index + Math.ceil(n / 2)) % n;

		[oppositeIndex1, oppositeIndex2].forEach((oppositeIndex) => {
			let line = document.createElementNS(svgNS, "line");
			line.setAttribute("x1", point.x);
			line.setAttribute("y1", point.y);
			line.setAttribute("x2", points[oppositeIndex].x);
			line.setAttribute("y2", points[oppositeIndex].y);
			line.setAttribute("stroke", "black");
			svg.appendChild(line);
		});
	});

	// Draw nodes on top of lines
	points.forEach((point) => {
		let circle = document.createElementNS(svgNS, "circle");
		circle.setAttribute("cx", point.x);
		circle.setAttribute("cy", point.y);
		circle.setAttribute("r", 20);
		circle.setAttribute("fill", "white");
		circle.setAttribute("stroke", "black");
		circle.setAttribute("class", "node");
		circle.setAttribute("id", point.id);
		svg.appendChild(circle);
	});
}

// Continue with the event listeners setup for selecting and submitting nodes
document.getElementById("computer-move").addEventListener("click", function () {
	const nodes = document.querySelectorAll(".node");
	const nodeStates = Array.from(nodes).map((node) =>
		node.classList.contains("removed")
	);
	const difficulty = localStorage.getItem("difficulty");

	fetch("/computer-move", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			node_states: nodeStates,
			difficulty: difficulty,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.move && data.move.length > 0) {
				// Check if move is not empty
				data.move.forEach((index) => {
					nodes[index].classList.add("removed"); // Apply the class to each node
				});
			} else {
				alert("No valid moves available for the computer.");
			}
		})
		.catch((error) => console.error("Error:", error));

	setTimeout(() => {
		console.log("Checking nodes' status right before status check:");
		nodes.forEach((node, index) => {
			console.log(`Node ${index}: ${node.classList.contains("removed")}`);
		});

		lastMoveByPlayer = false;
		checkGameStatus();
	}, 500);
});

function checkGameStatus() {
	console.log("Checking game status...");
	console.log("Last move by player:", lastMoveByPlayer);

	const nodes = document.querySelectorAll(".node");
	const allRemoved = Array.from(nodes).every((node) =>
		node.classList.contains("removed")
	);

	if (allRemoved) {
		if (lastMoveByPlayer) {
			showConfettiAnimation();
		} else {
			showSadAnimation();
		}
	}
}

function showConfettiAnimation() {
	// Assuming canvas-confetti is included in your project
	confetti({
		particleCount: 100,
		spread: 70,
		origin: { y: 0.6 },
	});
}

function showSadAnimation() {
	document.getElementById("sad-animation").style.display = "block";
}
