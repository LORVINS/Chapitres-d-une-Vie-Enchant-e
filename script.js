// --- Mots de passe secrets (À PERSONNALISER ABSOLUMENT !) ---
const MAIN_PASSWORD = "1703";
const BOOK_PASSWORDS = {
    "chapitre-01": "2803",
    "chapitre-02": "ombreSilencieuse",
    "chapitre-03": "destinTisse",
    "chapitre-04": "coeurVaillant",
    "chapitre-05": "2109",
    "chapitre-06": "foretEndormie",
    "chapitre-07": "etoileGuiding",
    "chapitre-08": "pontDesSoupirs",
    "chapitre-09": "echoDuPassage",
    "chapitre-10": "horizonPromis",
};

// --- Données des livres (à étendre) ---
// Note: Les chemins des images sont des exemples. Assure-toi qu'elles existent dans assets/images/book_covers/
// Le chemin du contenu est dans assets/content/ pour des fichiers HTML séparés.
const BOOKS_DATA = [
    { id: "chapitre-01", title: "Le Secret des Échos", cover: "cover_book1.png" },
    { id: "chapitre-02", title: "Sous l'Ombre des Étoiles", cover: "cover_book2.png" },
    { id: "chapitre-03", title: "La Danse des Volutes", cover: "cover_book3.png" },
    { id: "chapitre-04", title: "Les Murmures de la Forêt", cover: "cover_book4.png" },
    { id: "chapitre-05", title: "L'Arbre aux Souvenirs", cover: "cover_book5.png" },
    { id: "chapitre-06", title: "Le Chant du Crépuscule", cover: "cover_book6.png" },
    { id: "chapitre-07", title: "Là où les Rêves S'envolent", cover: "cover_book7.png" },
    { id: "chapitre-08", title: "L'Éclat de la Pierre Oubliée", cover: "cover_book8.png" },
    { id: "chapitre-09", title: "Les Voiles du Passé", cover: "cover_book9.png" },
    { id: "chapitre-10", title: "Vers l'Aube Nouvelle", cover: "cover_book10.png" },
];

// --- Données des pistes musicales ---
// Assure-toi d'avoir ces fichiers audio dans assets/audio/
const MUSIC_TRACKS = [
    { title: "Patrick Watson - Je te laisserai des mots", src:"Je te laisserai des mots.mp3" },
    { title: "Lana Del Rey - Cinnamon Girl (Lyrics)", src:"Cinnamon Girl.mp3" },
    { title: "yung kai - blue", src:"blue.mp3" },
    { title: "I Wanna Be Yours", src:"I Wanna Be Yours.mp3" },
];

// --- Références aux éléments du DOM ---
const accessOverlay = document.getElementById('accessOverlay');
const mainPasswordInput = document.getElementById('mainPasswordInput');
const enterButton = document.getElementById('enterButton');
const errorMessage = document.getElementById('errorMessage');
const mainContent = document.getElementById('mainContent');

const bookShelf = document.getElementById('bookShelf');
const bookModalOverlay = document.getElementById('bookModalOverlay');
const bookModal = bookModalOverlay.querySelector('.book-modal');
const closeBookModalBtn = bookModal.querySelector('.close-modal-btn');
const bookCoverAnimation = document.getElementById('bookCoverAnimation');
const animatedCover = bookCoverAnimation.querySelector('.animated-cover');
const bookPasswordPrompt = document.getElementById('bookPasswordPrompt');
const bookPasswordInput = document.getElementById('bookPasswordInput');
const verifyBookButton = document.getElementById('verifyBookButton');
const bookErrorMessage = document.getElementById('bookErrorMessage');
const bookContentDisplay = document.getElementById('bookContentDisplay');
const modalBookTitle = document.getElementById('modalBookTitle');
const modalBookContent = document.getElementById('modalBookContent');

const profilePic = document.querySelector('.profile-pic');
const currentDateDisplay = document.getElementById('currentDate');
const currentTimeDisplay = document.getElementById('currentTime');

const musicPlayer = document.getElementById('musicPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevTrackBtn = document.getElementById('prevTrackBtn');
const nextTrackBtn = document.getElementById('nextTrackBtn');
const songTitleDisplay = document.getElementById('songTitle');
const progressBar = document.getElementById('progressBar');
const progressOverlay = document.getElementById('progressOverlay');
const currentTimeSong = document.getElementById('currentTimeDisplay');
const durationTimeSong = document.getElementById('durationDisplay');
const vinylDisc = document.getElementById('vinylDisc');

let currentBookId = '';
let sound = null; // Instance Howler.js
let currentTrackIndex = 0;
let isPlaying = false;

// --- Fonctions utilitaires ---
function showErrorMessage(element, message) {
    element.textContent = message;
    element.classList.add('show');
    gsap.to(element, { opacity: 1, duration: 0.3 });
    gsap.to(element, { opacity: 0, duration: 0.5, delay: 3, onComplete: () => element.classList.remove('show') });
}

function formatTime(secs) {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// --- Gestion de l'accès principal ---
enterButton.addEventListener('click', () => {
    if (mainPasswordInput.value === MAIN_PASSWORD) {
        gsap.to(accessOverlay, { opacity: 0, duration: 1, ease: "power2.inOut", onComplete: () => {
            accessOverlay.classList.add('hidden');
            mainContent.classList.remove('hidden');
            gsap.to(mainContent, { opacity: 1, duration: 1, ease: "power2.inOut" });
            gsap.to(musicPlayer, { opacity: 1, x: 0, duration: 0.8, delay: 0.5, ease: "power2.out", onComplete: initMusicPlayer }); // Anime le lecteur
            initSiteContent(); // Charge le reste du site
        }});
    } else {
        showErrorMessage(errorMessage, "Incantation incorrecte. Le Grimoire reste scellé.");
    }
    mainPasswordInput.value = '';
});

mainPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enterButton.click();
});

// --- Initialisation du contenu du site après connexion ---
function initSiteContent() {
    updateDateTime();
    setInterval(updateDateTime, 1000); // Met à jour date/heure toutes les secondes
    loadBooksIntoShelf();
    // Tu peux ajouter d'autres animations GSAP ici pour l'apparition des éléments de la page
}

// --- Mise à jour de la date et l'heure ---
function updateDateTime() {
    const now = new Date();
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    currentDateDisplay.textContent = now.toLocaleDateString('fr-FR', optionsDate);
    currentTimeDisplay.textContent = now.toLocaleTimeString('fr-FR', optionsTime);
}

// --- Chargement des livres dans l'étagère ---
function loadBooksIntoShelf() {
    BOOKS_DATA.forEach((bookData, index) => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.dataset.bookId = bookData.id;

        // Structure 3D simplifiée pour le livre
        bookElement.innerHTML = `
            <div class="book-cover">
                <div class="book-front" style="background-image: url(${bookData.cover});"></div>
                <div class="book-spine"></div>
            </div>
            <div class="book-title-overlay">${bookData.title}</div>
        `;
        bookShelf.appendChild(bookElement);

        // Animation au survol avec GSAP (facultatif si CSS suffit, mais GSAP est plus puissant)
        // GSAP.to(bookElement, {
        //     scrollTrigger: {
        //         trigger: bookElement,
        //         start: "left center", // Anime quand le livre arrive au centre
        //         toggleActions: "play none none none"
        //     },
        //     y: -20, rotationY: 5, scale: 1.05, duration: 0.6, ease: "power2.out",
        //     paused: true // Laissera GSAP gérer le play/pause on scroll
        // });


        bookElement.addEventListener('click', () => openBookModal(bookData));
    });

    // Initialisation de ScrollTrigger pour les livres (si besoin d'animations au scroll)
    // GSAP.utils.toArray(".book").forEach(book => {
    //     GSAP.from(book, {
    //         y: 50, opacity: 0, duration: 1, ease: "power3.out",
    //         scrollTrigger: {
    //             trigger: book,
    //             start: "left 80%", // Quand 80% du livre est visible à gauche
    //             containerAnimation: bookShelf, // Lie l'animation au défilement de l'étagère
    //             toggleActions: "play none none none"
    //         }
    //     });
    // });
}

// --- Gestion du modal du livre ---
function openBookModal(bookData) {
    currentBookId = bookData.id;
    modalBookTitle.textContent = bookData.title;
    animatedCover.src = bookData.cover; // Définit l'image de couverture pour l'animation

    // Réinitialise l'état du modal
    bookContentDisplay.classList.add('hidden');
    bookContentDisplay.classList.remove('visible');
    bookPasswordPrompt.classList.remove('hidden'); // S'assure que le prompt est visible
    bookPasswordPrompt.style.display = 'block'; // S'assure que le prompt est visible
    bookErrorMessage.classList.remove('show');
    animatedCover.style.transform = 'rotateY(0deg)'; // Remet la couverture à l'endroit

    bookModalOverlay.classList.add('active'); // Active l'overlay
    // Le reste de l'animation d'ouverture sera géré par GSAP ou CSS
}

closeBookModalBtn.addEventListener('click', closeBookModal);
bookModalOverlay.addEventListener('click', (e) => {
    if (e.target === bookModalOverlay) { // Ferme si on clique en dehors du modal
        closeBookModal();
    }
});

function closeBookModal() {
    gsap.to(bookModal, {
        scale: 0.7,
        y: 50,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
            bookModalOverlay.classList.remove('active');
            currentBookId = '';
            // Réinitialise l'animation de couverture pour la prochaine ouverture
            bookCoverAnimation.classList.remove('flipped');
            animatedCover.style.transform = 'rotateY(0deg)'; // Assure un état propre
        }
    });
}

verifyBookButton.addEventListener('click', async () => {
    const password = bookPasswordInput.value;
    if (password === BOOK_PASSWORDS[currentBookId]) {
        // Animation de "flip" de la couverture
        gsap.to(animatedCover, {
            rotationY: -180, // Fait pivoter la couverture de 180 degrés (pour révéler le "dos")
            duration: 1,
            ease: "power3.inOut",
            onComplete: async () => {
                bookPasswordPrompt.classList.add('hidden');
                bookPasswordPrompt.style.display = 'none';
                bookContentDisplay.classList.remove('hidden');

                // Charger le contenu du fichier HTML
                const contentPath = `content/${currentBookId}.html`;
                try {
                    const response = await fetch(contentPath);
                    if (!response.ok) throw new Error('Contenu du chapitre non trouvé.');
                    const htmlContent = await response.text();
                    modalBookContent.innerHTML = htmlContent;

                    gsap.fromTo(bookContentDisplay,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", onComplete: () => {
                            bookContentDisplay.classList.add('visible');
                        }}
                    );

                } catch (error) {
                    console.error("Erreur de chargement du contenu du chapitre:", error);
                    modalBookContent.innerHTML = "<p>Désolé, le contenu de ce chapitre est introuvable pour le moment.</p>";
                    showErrorMessage(bookErrorMessage, "Problème de chargement du contenu.");
                }
            }
        });

    } else {
        showErrorMessage(bookErrorMessage, "Mot de passe incorrect. Le chapitre reste secret.");
    }
    bookPasswordInput.value = '';
});

bookPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifyBookButton.click();
});

// --- Lecteur de musique avec Howler.js ---
function initMusicPlayer() {
    sound = new Howl({
        src: [MUSIC_TRACKS[currentTrackIndex].src],
        html5: true, // Important pour le streaming et les longs fichiers
        onplay: () => {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            vinylDisc.classList.add('playing');
            requestAnimationFrame(step); // Lance la mise à jour de la barre de progression
        },
        onpause: () => {
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            vinylDisc.classList.remove('playing');
        },
        onend: () => {
            playNextTrack();
        },
        onload: () => {
            durationTimeSong.textContent = formatTime(sound.duration());
            songTitleDisplay.textContent = MUSIC_TRACKS[currentTrackIndex].title;
        }
    });

    // Initialisation du titre et durée
    songTitleDisplay.textContent = MUSIC_TRACKS[currentTrackIndex].title;
    // La durée sera mise à jour onload

    playPauseBtn.addEventListener('click', togglePlayPause);
    prevTrackBtn.addEventListener('click', playPrevTrack);
    nextTrackBtn.addEventListener('click', playNextTrack);
    progressOverlay.addEventListener('click', seekTrack);
}

function togglePlayPause() {
    if (sound.playing()) {
        sound.pause();
    } else {
        sound.play();
    }
}

function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % MUSIC_TRACKS.length;
    loadTrack();
}

function playPrevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
    loadTrack();
}

function loadTrack() {
    if (sound) sound.stop();
    sound = new Howl({
        src: [MUSIC_TRACKS[currentTrackIndex].src],
        html5: true,
        onplay: () => {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            vinylDisc.classList.add('playing');
            requestAnimationFrame(step);
        },
        onpause: () => {
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            vinylDisc.classList.remove('playing');
        },
        onend: () => {
            playNextTrack();
        },
        onload: () => {
            durationTimeSong.textContent = formatTime(sound.duration());
            songTitleDisplay.textContent = MUSIC_TRACKS[currentTrackIndex].title;
        }
    });
    sound.play();
}

function step() {
    if (sound.playing()) {
        const seek = sound.seek() || 0;
        currentTimeSong.textContent = formatTime(seek);
        progressBar.style.width = (((seek / sound.duration()) * 100) || 0) + '%';
        requestAnimationFrame(step);
    }
}

function seekTrack(event) {
    if (sound && sound.duration()) {
        const rect = progressOverlay.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const width = rect.width;
        const percent = clickX / width;
        sound.seek(sound.duration() * percent);
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Aucune action ici, tout est déclenché par le bouton "Entrer"
    // pour s'assurer que les animations et le joueur ne démarrent qu'après le mot de passe principal.
});
