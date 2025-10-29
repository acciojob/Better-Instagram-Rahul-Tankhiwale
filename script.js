// script.js - drag & drop swap for <img id="dragN"> inside container divs

document.addEventListener('DOMContentLoaded', () => {
  let dragged = null; // the dragged <img> element

  // pick all draggable imgs (id = drag1..drag6)
  const draggables = document.querySelectorAll('img.draggable');

  draggables.forEach(img => {
    // dragstart: mark dragged element and set dataTransfer (for other browsers)
    img.addEventListener('dragstart', (e) => {
      dragged = img;
      img.classList.add('dragging');

      // store id so native DnD has something too
      try { e.dataTransfer.setData('text/plain', img.id); } catch (err) { /* some browsers may throw */ }
      e.dataTransfer.effectAllowed = 'move';
    });

    img.addEventListener('dragend', () => {
      if (dragged) dragged.classList.remove('dragging');
      dragged = null;
      // cleanup any over class on image-boxes
      document.querySelectorAll('.image-box').forEach(b => b.classList.remove('over'));
    });

    // Add drag handlers on parent drop target (the .image-box)
    const parent = img.parentElement;
    parent.addEventListener('dragenter', (e) => {
      e.preventDefault();
      if (parent && dragged && dragged !== img) parent.classList.add('over');
    });

    parent.addEventListener('dragover', (e) => {
      e.preventDefault(); // necessary to allow drop
      e.dataTransfer.dropEffect = 'move';
    });

    parent.addEventListener('dragleave', () => {
      parent.classList.remove('over');
    });

    parent.addEventListener('drop', (e) => {
      e.preventDefault();
      parent.classList.remove('over');

      if (!dragged) return;

      // Find the <img> inside this parent (target)
      const targetImg = parent.querySelector('img.draggable');
      if (!targetImg) return;

      // If same image, nothing to do
      if (targetImg === dragged) return;

      // Swap src and alt (keeps img elements in place so tests that look for #divN img pass)
      const tmpSrc = dragged.src;
      const tmpAlt = dragged.alt;

      dragged.src = targetImg.src;
      dragged.alt = targetImg.alt;

      targetImg.src = tmpSrc;
      targetImg.alt = tmpAlt;

      // optional: small visual flash
      targetImg.classList.add('flash');
      setTimeout(() => targetImg.classList.remove('flash'), 250);

      // cleanup dragged classes
      dragged.classList.remove('dragging');
      dragged = null;
    });

    // Optional: support pointer-based drag for browsers that don't fire HTML5 DnD in tests
    // (Cypress sometimes synthesizes mouse events; having this fallback helps)
    img.addEventListener('mousedown', (e) => {
      // don't prevent default — real dragstart should occur —
      // this handler exists to ensure element is known as dragged in some environments
      dragged = img;
      img.classList.add('dragging');
    });

    // mouseup on document to clear state if needed
    document.addEventListener('mouseup', () => {
      if (dragged) {
        dragged.classList.remove('dragging');
        dragged = null;
      }
      document.querySelectorAll('.image-box').forEach(b => b.classList.remove('over'));
    });
  });
});
