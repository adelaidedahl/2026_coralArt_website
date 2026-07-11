/**
 * Moorea Coral Reef Infinity — interactive sticker
 *
 * Loads data/creatures.json, renders the full sticker with one absolutely
 * positioned, clickable overlay per creature, and wires up the highlight +
 * popup behavior. No build step, no framework — just fetch + DOM.
 */

const DATA_URL = 'data/creatures.json';
const IMAGE_BASE = 'assets/images/';

const stage = document.getElementById('sticker-stage');
const stageHint = document.getElementById('stage-hint');
const modal = document.getElementById('creature-modal');
const modalCard = modal.querySelector('.modal-card');
const modalCloseBtn = document.getElementById('modal-close');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalScientificName = document.getElementById('modal-scientific-name');
const modalDescription = document.getElementById('modal-description');
const modalPapers = document.getElementById('modal-papers');

let lastFocusedElement = null;

init();

async function init() {
  let data;
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    data = await response.json();
  } catch (err) {
    stageHint.textContent =
      'Could not load data/creatures.json. Check that the file exists and is valid JSON.';
    console.error('Failed to load creature data:', err);
    return;
  }

  renderStage(data);
  wireGlobalDismiss();
}

function renderStage(data) {
  const { sticker, creatures } = data;

  // Maintain the sticker's true aspect ratio so overlays (positioned in %)
  // always line up with the base image, at any viewport width.
  stage.style.aspectRatio = `${sticker.referenceWidth} / ${sticker.referenceHeight}`;

  renderBaseImage(sticker);

  creatures.forEach((creature) => {
    stage.appendChild(buildCreatureButton(creature, sticker));
  });

  stageHint.textContent =
    'Tip: click or tap a creature to spotlight it, use Tab + Enter to navigate by keyboard.';
}

function renderBaseImage(sticker) {
  const img = document.createElement('img');
  img.className = 'sticker-stage__base-image';
  img.src = IMAGE_BASE + 'sticker/' + sticker.file;
  img.alt = sticker.alt || 'Full sticker design';

  img.addEventListener('error', () => {
    img.remove();
    const placeholder = document.createElement('div');
    placeholder.className = 'sticker-stage__placeholder';
    placeholder.innerHTML =
      `Full sticker image not found.<br />` +
      `Add it at <code>assets/images/sticker/${sticker.file}</code>.`;
    stage.prepend(placeholder);
  });

  stage.appendChild(img);
}

function buildCreatureButton(creature, sticker) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'creature-button';
  button.dataset.creatureId = creature.id;
  button.setAttribute('aria-label', `${creature.name} — show details`);

  // Convert the pixel box stored in creatures.json into percentages of the
  // sticker's reference size, so positioning stays correct at any scale.
  button.style.left = pct(creature.x, sticker.referenceWidth);
  button.style.top = pct(creature.y, sticker.referenceHeight);
  button.style.width = pct(creature.width, sticker.referenceWidth);
  button.style.height = pct(creature.height, sticker.referenceHeight);

  const img = document.createElement('img');
  img.src = IMAGE_BASE + 'creatures/' + creature.image;
  img.alt = creature.alt || creature.name;

  img.addEventListener('error', () => {
    img.remove();
    const missing = document.createElement('span');
    missing.className = 'creature-missing';
    missing.textContent = `${creature.name} (image missing)`;
    button.appendChild(missing);
  });

  button.appendChild(img);
  button.addEventListener('click', () => selectCreature(creature, button));

  return button;
}

function pct(value, reference) {
  return `${(value / reference) * 100}%`;
}

// `papers` can be a single citation string, an array of citation strings
// (rendered as a bullet list), or empty/undefined (renders nothing, and
// the :empty CSS rule hides the whole box).
function renderPapers(papers) {
  if (!papers) return '';
  if (Array.isArray(papers)) {
    if (papers.length === 0) return '';
    return '<ul>' + papers.map((citation) => `<li>${citation}</li>`).join('') + '</ul>';
  }
  return papers;
}

function selectCreature(creature, button) {
  const isAlreadyActive = button.classList.contains('is-active');

  stage.querySelectorAll('.creature-button.is-active').forEach((el) => {
    el.classList.remove('is-active');
  });

  if (isAlreadyActive) {
    stage.classList.remove('has-active');
    closeModal();
    return;
  }

  stage.classList.add('has-active');
  button.classList.add('is-active');
  openModal(creature, button);
}

function openModal(creature, triggerEl) {
  lastFocusedElement = triggerEl;

  modalTitle.textContent = creature.name;
  modalScientificName.textContent = creature.scientificName || '';
  // innerHTML (not textContent) so tags like <em> or <a> written directly
  // into the JSON text render as formatting/links instead of literal text.
  // This data is authored by us, not user-submitted, so there's no
  // injection risk.
  modalDescription.innerHTML = creature.description;
  modalPapers.innerHTML = renderPapers(creature.papers);

  // Stay hidden until the image actually loads, so a missing file never
  // flashes a broken-image icon in the popup.
  modalImage.hidden = true;
  modalImage.onload = () => {
    modalImage.hidden = false;
  };
  modalImage.onerror = () => {
    modalImage.hidden = true;
  };
  modalImage.alt = creature.alt || creature.name;
  modalImage.src = IMAGE_BASE + 'creatures/' + creature.image;

  modal.hidden = false;
  modalCard.focus();
}

function closeModal() {
  modal.hidden = true;
  modalImage.removeAttribute('src');

  stage.classList.remove('has-active');
  stage.querySelectorAll('.creature-button.is-active').forEach((el) => {
    el.classList.remove('is-active');
  });

  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function wireGlobalDismiss() {
  modalCloseBtn.addEventListener('click', closeModal);

  // Clicking the dimmed backdrop (outside the card) closes the popup.
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  // Clicking empty space on the stage (not a creature) resets the highlight.
  stage.addEventListener('click', (event) => {
    if (event.target === stage || event.target.classList.contains('sticker-stage__base-image')) {
      stage.classList.remove('has-active');
      stage.querySelectorAll('.creature-button.is-active').forEach((el) => {
        el.classList.remove('is-active');
      });
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });
}
