//your code here
// script.js - swap contents (background + text) between dragged and dropped tiles

let draggedEl = null;

// Add listeners to all .image tiles
document.addEventListener("DOMContentLoaded", () => {
  const tiles = document.querySelectorAll(".image");

  tiles.forEach(tile => {
    // drag start
    tile.addEventListener("dragstart", (e) => {
      draggedEl = tile;
      tile.classList.add("dragging");

      // For better cross-browser support, set some data
      e.dataTransfer.setData("text/plain", tile.id);
      // Use move effect
      e.dataTransfer.effectAllowed = "move";
    });

    // drag end (cleanup)
    tile.addEventListener("dragend", () => {
      draggedEl = null;
      tile.classList.remove("dragging");
      tiles.forEach(t => t.classList.remove("over"));
    });

    // when a draggable enters a tile
    tile.addEventListener("dragenter", (e) => {
      if (tile !== draggedEl) tile.classList.add("over");
    });

    // when draggable leaves a tile
    tile.addEventListener("dragleave", (e) => {
      tile.classList.remove("over");
    });

    // allow drop
    tile.addEventListener("dragover", (e) => {
      e.preventDefault(); // required to allow drop
      e.dataTransfer.dropEffect = "move";
    });

    // drop handler — swap the two tiles' visual content
    tile.addEventListener("drop", (e) => {
      e.preventDefault();
      tile.classList.remove("over");

      // if no dragged element or same element, nothing to do
      if (!draggedEl || draggedEl === tile) return;

      // Swap background-image and innerText
      const draggedBg = draggedEl.style.backgroundImage;
      const targetBg  = tile.style.backgroundImage;

      const draggedText = draggedEl.textContent;
      const targetText  = tile.textContent;

      draggedEl.style.backgroundImage = targetBg;
      tile.style.backgroundImage = draggedBg;

      draggedEl.textContent = targetText;
      tile.textContent = draggedText;
    });
  });
});
