// --- 1. BARRE DE PROGRESSION GLOBALE ---
const progressBar = document.getElementById("progressBar");
const body = document.body;

body.addEventListener("scroll", () => {
	const scrollTop = body.scrollTop;
	const scrollHeight = body.scrollHeight - body.clientHeight;
	const scrollPercentage = (scrollTop / scrollHeight) * 100;
	progressBar.style.width = scrollPercentage + "%";
});

// --- 2. LOGIQUE DU CAROUSEL (AUTO & MANUEL) ---
const track = document.getElementById("track");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const dotsContainer = document.getElementById("dotsContainer");

let currentIndex = 0;
const cards = document.querySelectorAll(".project-card");
const totalCards = cards.length;
const cardsPerView = 1;

// Variables pour l'autoplay
let autoPlayInterval;
let resumeTimeout;
const autoPlayDelay = 3500; // Temps entre chaque slide automatique (ms)
const interactionDelay = 5000; // Temps d'attente après un clic avant reprise (ms)

// Création des points (dots)
const totalSlides = Math.ceil(totalCards / cardsPerView);
dotsContainer.innerHTML = "";
for (let i = 0; i < totalSlides; i++) {
	const dot = document.createElement("div");
	dot.classList.add("dot");
	if (i === 0) dot.classList.add("active");
	// Ajout du clic sur les dots pour naviguer
	dot.addEventListener("click", () => {
		manualNavigation(i);
	});
	dotsContainer.appendChild(dot);
}
const dots = document.querySelectorAll(".dot");

// Fonction principale de mise à jour visuelle
function updateCarousel() {
	const cardWidth = cards[0].offsetWidth + 20; // width + gap (20px défini dans le CSS)
	track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

	// Mise à jour des points
	dots.forEach((d) => d.classList.remove("active"));
	if (dots[currentIndex]) dots[currentIndex].classList.add("active");
}

// Fonction pour avancer (utilisée par auto-play et bouton suivant)
function goNext() {
	if (currentIndex < totalCards - cardsPerView) {
		currentIndex++;
	} else {
		// Boucle : Retour au début
		currentIndex = 0;
	}
	updateCarousel();
}

// Fonction pour reculer
function goPrev() {
	if (currentIndex > 0) {
		currentIndex--;
	} else {
		// Boucle : Aller à la fin
		currentIndex = totalCards - cardsPerView;
	}
	updateCarousel();
}

// --- GESTION DE L'AUTOMATISATION ---

function startAutoPlay() {
	stopAutoPlay();
	autoPlayInterval = setInterval(() => {
		goNext();
	}, autoPlayDelay);
}

function stopAutoPlay() {
	clearInterval(autoPlayInterval);
}

// Fonction appelée lors d'une interaction manuelle (flèches ou dots)
function manualNavigation(targetIndex = null) {
	stopAutoPlay();
	clearTimeout(resumeTimeout);
	if (targetIndex !== null) {
		currentIndex = targetIndex;
		updateCarousel();
	}
	resumeTimeout = setTimeout(() => {
		startAutoPlay();
	}, interactionDelay);
}

// Écouteurs d'événements pour les boutons
nextBtn.addEventListener("click", () => {
	goNext();
	manualNavigation(); // Gère le reset du timer
});

prevBtn.addEventListener("click", () => {
	goPrev();
	manualNavigation(); // Gère le reset du timer
});

// Lancer l'auto-play au chargement
startAutoPlay();

// --- 3. LOGIQUE MODAL ---
function openModal(id) {
	const modal = document.getElementById(id);
	if (modal) {
		modal.style.display = "flex";
		stopAutoPlay();
		clearTimeout(resumeTimeout);
	}
}

function closeModal(id) {
	const modal = document.getElementById(id);
	if (modal) {
		modal.style.display = "none";
		startAutoPlay();
	}
}

// Fermer si on clique en dehors
window.onclick = function (event) {
	if (event.target.classList.contains("modal")) {
		event.target.style.display = "none";
		startAutoPlay();
	}
};
window.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		document.querySelectorAll(".modal").forEach((modal) => {
			if (modal.style.display === "flex") {
				modal.style.display = "none";
				startAutoPlay();
			}
		});
	}
});

// --- 4. ANIMATION DES BARRES DE SKILLS ---
const skillsSection = document.getElementById("skills");
const progressFills = document.querySelectorAll(".progress-fill");

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				progressFills.forEach((fill) => {
					fill.style.width = fill.getAttribute("data-width");
				});
			}
		});
	},
	{ threshold: 0.5 },
);

if (skillsSection) {
	observer.observe(skillsSection);
}
