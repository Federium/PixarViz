// Custom cursor logic for all pages
export function initCustomCursor() {
	const cursor = document.getElementById("custom-cursor");
	if (!cursor) return;

	let is3DHovering = false;
	let mouseX = 0;
	let mouseY = 0;
	let cursorX = 0;
	let cursorY = 0;

	// Listen for 3D hover events from Gallery3D
	window.addEventListener("3d-hover", ((e) => {
		is3DHovering = e.detail.isHovering;
	}));

	document.addEventListener("mousemove", e => {
		mouseX = e.clientX;
		mouseY = e.clientY;

		// Get element under cursor (cursor has pointer-events: none so it's ignored)
		const elementUnderCursor = document.elementFromPoint(
			e.clientX,
			e.clientY
		);

		// Check if it's an interactive element
		let isInteractive = false;

		if (elementUnderCursor && elementUnderCursor !== cursor) {
			isInteractive =
				elementUnderCursor.tagName === "BUTTON" ||
				elementUnderCursor.tagName === "A" ||
				elementUnderCursor.tagName === "INPUT" ||
				elementUnderCursor.tagName === "SELECT" ||
				elementUnderCursor.tagName === "TEXTAREA" ||
				!!elementUnderCursor.closest("button, a, input, select, textarea");
		}

		// Also consider 3D hover state
		if (isInteractive || is3DHovering) {
			cursor.classList.add("hover");
		} else {
			cursor.classList.remove("hover");
		}
	});

	// Smooth follow animation
	function animateCursor() {
		if (!cursor) return;

		// Interpolate cursor position with delay (lerp)
		const speed = 0.15; // Lower = more delay
		cursorX += (mouseX - cursorX) * speed;
		cursorY += (mouseY - cursorY) * speed;

		cursor.style.left = cursorX + "px";
		cursor.style.top = cursorY + "px";

		requestAnimationFrame(animateCursor);
	}

	animateCursor();
}
