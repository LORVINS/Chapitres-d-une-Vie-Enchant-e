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
    "chapitre-11": "horizonPromis",
    "chapitre-12": "horizonPromis",
    "chapitre-13": "horizonPromis",
    "chapitre-14": "horizonPromis",
    "chapitre-15": "horizonPromis",
};

// --- Données des livres (à étendre) ---
// IMPORTANT : Les chemins des images et des PDFs doivent être corrects.
// Assure-toi que les images sont dans assets/images/book_covers/ et les PDFs dans assets/pdfs/
const BOOKS_DATA = [
    { id: "chapitre-01", title: "Le Secret des Échos", cover: "cover_book1.png", pdfSrc: "Je-tai-perdue-mais-pas-mon-espoir_Livre_finalV5.pdf" },
    { id: "chapitre-02", title: "Sous l'Ombre des Étoiles", cover: "cover_book2.png", pdfSrc: "assets/pdfs/chapitre-02.pdf" },
    { id: "chapitre-03", title: "La Danse des Volutes", cover: "cover_book3.png", pdfSrc: "assets/pdfs/chapitre-03.pdf" },
    { id: "chapitre-04", title: "Les Murmures de la Forêt", cover: "cover_book4.png", pdfSrc: "assets/pdfs/chapitre-04.pdf" },
    { id: "chapitre-05", title: "L'Arbre aux Souvenirs", cover: "cover_book5.png", pdfSrc: "assets/pdfs/chapitre-05.pdf" },
    { id: "chapitre-06", title: "Le Chant du Crépuscule", cover: "cover_book6.png", pdfSrc: "assets/pdfs/chapitre-06.pdf" },
    { id: "chapitre-07", title: "Là où les Rêves S'envolent", cover: "cover_book7.png", pdfSrc: "assets/pdfs/chapitre-07.pdf" },
    { id: "chapitre-08", title: "L'Éclat de la Pierre Oubliée", cover: "cover_book8.png", pdfSrc: "assets/pdfs/chapitre-08.pdf" },
    { id: "chapitre-09", title: "Les Voiles du Passé", cover: "cover_book9.png", pdfSrc: "assets/pdfs/chapitre-09.pdf" },
    { id: "chapitre-10", title: "Vers l'Aube Nouvelle", cover: "cover_book10.png", pdfSrc: "assets/pdfs/chapitre-10.pdf" },
    { id: "chapitre-11", title: "L'arrivée du jour", cover: "cover_book11.gif", pdfSrc: "assets/pdfs/chapitre-11.pdf" },
    { id: "chapitre-12", title: "L'histoire d'Aurelie", cover: "cover_book12.gif", pdfSrc: "assets/pdfs/chapitre-12.pdf" },
    { id: "chapitre-12", title: "Le monde à l'envers", cover: "cover_book13.gif", pdfSrc: "assets/pdfs/chapitre-13.pdf" },
    { id: "chapitre-13", title: "Le monde sous l'océan de Madacascar", cover: "cover_book14.gif", pdfSrc: "assets/pdfs/chapitre-14.pdf" },
    { id: "chapitre-14", title: "Un Noel pas comme les autres, mais avec l'espoir", cover: "cover_book15.gif", pdfSrc: "assets/pdfs/chapitre-15.pdf" },
];

// --- Données des pistes musicales ---
// IMPORTANT : Assure-toi d'avoir ces fichiers audio dans assets/audio/ avec ces noms exacts.
const MUSIC_TRACKS = [
    { title: "Patrick Watson - Je te laisserai des mots", src:"Je te laisserai des mots.mp3" },
    { title: "Lana Del Rey - Cinnamon Girl (Lyrics)", src:"Cinnamon Girl.mp3" },
    { title: "yung kai - blue", src:"blue.mp3" },
    { title: "I Wanna Be Yours", src:"I Wanna Be Yours.mp3" },
];

let currentTrackIndex = 0;
let sound; // Variable pour l'instance Howl
let isPlaying = false; // Initialisation correcte
let currentBookId = null;

// --- Sélecteurs d'Éléments du DOM ---
const accessOverlay = document.getElementById('accessOverlay');
const mainPasswordInput = document.getElementById('mainPasswordInput');
const enterButton = document.getElementById('enterButton');
const errorMessage = document.getElementById('errorMessage');
const mainContent = document.getElementById('mainContent');
const currentDateSpan = document.getElementById('currentDate');
const currentTimeSpan = document.getElementById('currentTime');
const bookShelf = document.getElementById('bookShelf');

// Modal du livre
const bookModalOverlay = document.getElementById('bookModalOverlay');
const bookModal = document.querySelector('.book-modal');
const closeModalBtn = document.querySelector('.close-modal-btn');
const bookCoverAnimation = document.getElementById('bookCoverAnimation');
const animatedCover = document.querySelector('.animated-cover');
const bookPasswordPrompt = document.getElementById('bookPasswordPrompt');
const bookPasswordInput = document.getElementById('bookPasswordInput');
const verifyBookButton = document.getElementById('verifyBookButton');
const bookErrorMessage = document.getElementById('bookErrorMessage');
const bookContentDisplay = document.getElementById('bookContentDisplay');
const modalBookTitle = document.getElementById('modalBookTitle');
const pdfViewer = document.getElementById('pdfViewer'); // L'iframe pour le PDF

// Lecteur de musique
const musicPlayer = document.getElementById('musicPlayer');
const prevTrackBtn = document.getElementById('prevTrackBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const nextTrackBtn = document.getElementById('nextTrackBtn');
const vinylDisc = document.getElementById('vinylDisc');
const songTitleSpan = document.getElementById('songTitle');
const progressBar = document.getElementById('progressBar');
const progressOverlay = document.getElementById('progressOverlay');
const currentTimeDisplay = document.getElementById('currentTimeDisplay');
const durationDisplay = document.getElementById('durationDisplay');
// NOUVEAU SÉLECTEUR POUR LE BOUTON DE BASCULE
const togglePlayerBtn = document.getElementById('togglePlayerBtn');


// --- Fonctions Utilitaires ---

function showErrorMessage(element, message) {
    element.textContent = message;
    element.classList.add('show');
    gsap.fromTo(element, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 });
    setTimeout(() => {
        gsap.to(element, { opacity: 0, y: -10, duration: 0.3, onComplete: () => {
            element.classList.remove('show');
        }});
    }, 3000);
}

function updateDateTime() {
    const now = new Date();
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    currentDateSpan.textContent = now.toLocaleDateString('fr-FR', optionsDate);
    currentTimeSpan.textContent = now.toLocaleTimeString('fr-FR', optionsTime);
}

// --- Fonctions du Lecteur de Musique ---

function loadTrack(index) {
    if (sound) {
        sound.stop();
        sound.unload();
    }
    const track = MUSIC_TRACKS[index];
    songTitleSpan.textContent = track.title;
    sound = new Howl({
        src: [track.src],
        html5: true, // Utilisation de l'audio HTML5 pour un meilleur contrôle
        onplay: () => {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            vinylDisc.classList.add('playing');
            requestAnimationFrame(updateProgressBar);
        },
        onpause: () => {
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            vinylDisc.classList.remove('playing');
        },
        onend: () => {
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            vinylDisc.classList.remove('playing');
            nextTrack(); // Passer à la piste suivante à la fin
        },
        onload: () => {
            durationDisplay.textContent = formatTime(sound.duration());
            // Si la piste est chargée et que le lecteur était en pause/stop, s'assurer que le disque est arrêté.
            if (!isPlaying) {
                vinylDisc.classList.remove('playing');
            }
        }
    });
}

function playPause() {
    if (sound.playing()) {
        sound.pause();
    } else {
        sound.play();
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % MUSIC_TRACKS.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) { // Jouer seulement si c'était en lecture avant de changer de piste
        sound.play();
    }
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) { // Jouer seulement si c'était en lecture avant de changer de piste
        sound.play();
    }
}

function updateProgressBar() {
    if (sound && sound.playing()) { // Vérifier si sound existe et est en lecture
        const percent = (sound.seek() / sound.duration()) * 100;
        progressBar.style.width = percent + '%';
        currentTimeDisplay.textContent = formatTime(sound.seek());
        requestAnimationFrame(updateProgressBar);
    } else if (sound && !sound.playing() && isPlaying) {
        // Si sound existe mais ne joue plus et isPlaying est toujours vrai, c'est que la lecture s'est arrêtée
        // sans passer par onend/onpause (ex: erreur ou fin de la piste si onend n'est pas appelé)
        // Mettre à jour isPlaying à false pour refléter l'état réel.
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        vinylDisc.classList.remove('playing');
    }
}

function formatTime(secs) {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function seek(event) {
    if (sound && sound.duration() > 0) { // S'assurer que la piste est chargée
        const seekPos = (event.clientX - progressOverlay.getBoundingClientRect().left) / progressOverlay.offsetWidth;
        sound.seek(sound.duration() * seekPos);
    }
}

// NOUVELLE FONCTION : Basculer la minimisation du lecteur
function togglePlayerMinimization() {
    musicPlayer.classList.toggle('minimized');
    const icon = togglePlayerBtn.querySelector('i');
    if (musicPlayer.classList.contains('minimized')) {
        icon.classList.remove('fa-chevron-left');
        icon.classList.add('fa-chevron-right'); // Changer l'icône quand réduit
    } else {
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-left'); // Revenir à l'icône d'origine
    }
}

// --- Fonctions d'Initialisation du Site ---

function initSiteContent() {
    gsap.to(accessOverlay, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
            accessOverlay.style.display = 'none';
            mainContent.classList.remove('hidden');
            gsap.to(mainContent, { opacity: 1, duration: 1, ease: "power2.out" });
            // Animation du music player
            gsap.fromTo(musicPlayer, 
                { x: '100%', opacity: 0 }, 
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 0.8, 
                    ease: "power2.out", 
                    delay: 0.5, 
                    onComplete: () => {
                        musicPlayer.classList.add('active'); // S'assurer qu'il est "actif" une fois visible
                    }
                }
            );
            loadTrack(currentTrackIndex); // Charger la première piste
            // Vérifier si sound est prêt avant de tenter de jouer
            if (sound && typeof sound.play === 'function') {
                sound.play(); // Lancer la musique au démarrage du site
            } else {
                // Si sound n'est pas prêt, ajouter un petit délai ou un écouteur onload pour le jouer
                sound.once('load', function() {
                    sound.play();
                });
            }
            loadBooksIntoShelf();
        }
    });
}

function loadBooksIntoShelf() {
    // IMPORTANT : Assurez-vous que BOOKS_DATA et BOOK_PASSWORDS sont définis ailleurs dans votre script ou un autre fichier js inclus.
    // Exemple de structure attendue pour BOOKS_DATA et BOOK_PASSWORDS:
    /*
    const BOOKS_DATA = [
        { id: 'chapitre1', title: 'Le Réveil des Anciens', cover: 'assets/covers/cover1.jpg', pdfSrc: 'assets/pdfs/chapitre1.pdf' },
        { id: 'chapitre2', title: 'Les Murmures Oubliés', cover: 'assets/covers/cover2.jpg', pdfSrc: 'assets/pdfs/chapitre2.pdf' },
    ];
    const BOOK_PASSWORDS = {
        'chapitre1': 'motdepasse1',
        'chapitre2': 'motdepasse2',
    };
    const MAIN_PASSWORD = 'motdepassemain';
    */

    // Vérifier si BOOKS_DATA existe avant de l'utiliser
    if (typeof BOOKS_DATA === 'undefined') {
        console.error("BOOKS_DATA n'est pas défini. Assurez-vous que vos données de livres sont chargées avant d'appeler loadBooksIntoShelf().");
        return;
    }

    BOOKS_DATA.forEach((bookData, index) => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.dataset.bookId = bookData.id;

        const bookCover = document.createElement('div');
        bookCover.classList.add('book-cover');
        bookCover.style.backgroundImage = `url(${bookData.cover})`;

        const bookSpine = document.createElement('div');
        bookSpine.classList.add('book-spine');

        const bookTitleOverlay = document.createElement('div');
        bookTitleOverlay.classList.add('book-title-overlay');
        bookTitleOverlay.textContent = bookData.title;

        bookCover.appendChild(bookTitleOverlay);
        bookElement.appendChild(bookCover);
        bookElement.appendChild(bookSpine);

        bookShelf.appendChild(bookElement);

        bookElement.addEventListener('click', () => openBookModal(bookData));

        // Animation ScrollTrigger optionnelle pour les livres
        // gsap.from(bookElement, {
        //     opacity: 0,
        //     y: 100,
        //     rotationX: -90,
        //     duration: 1,
        //     ease: "power3.out",
        //     scrollTrigger: {
        //         trigger: bookElement,
        //         start: "top 90%",
        //         end: "bottom 60%",
        //         toggleActions: "play none none none",
        //         once: true,
        //         markers: false // Mettre à true pour le débogage
        //     }
        // });
    });
}

// --- Fonctions du Modal de Livre ---

function openBookModal(bookData) {
    currentBookId = bookData.id;
    modalBookTitle.textContent = bookData.title;
    animatedCover.src = bookData.cover;
    
    // --- RÉINITIALISATION CRUCIALE DU MODAL POUR LES OUVERTURES ULTÉRIEURES ---
    // 1. Réinitialiser l'iframe PDF
    pdfViewer.src = ''; 
    
    // 2. Masquer le contenu du livre et s'assurer que le prompt est visible au début
    bookContentDisplay.classList.add('hidden');
    bookContentDisplay.classList.remove('visible'); // S'assurer que l'opacité est à 0
    bookContentDisplay.style.opacity = 0; // Réinitialiser l'opacité CSS si elle persiste
    
    bookPasswordPrompt.classList.remove('hidden');
    bookPasswordPrompt.style.display = 'block'; // S'assurer qu'il est affiché

    // 3. Réinitialiser l'animation de couverture
    bookCoverAnimation.style.display = 'block'; // Rendre la couverture visible
    gsap.set(animatedCover, { rotationY: 0 }); // Réinitialiser la rotation de la couverture
    bookCoverAnimation.classList.remove('flipped'); // S'assurer que la classe flipped est retirée

    // 4. Réinitialiser les champs de mot de passe et messages d'erreur
    bookPasswordInput.value = '';
    bookErrorMessage.classList.remove('show');
    // --- FIN RÉINITIALISATION ---

    bookModalOverlay.classList.add('active');
    gsap.fromTo(bookModal,
        { scale: 0.7, y: 50, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
}

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
            
            // --- RÉINITIALISATION CRUCIALE À LA FERMETURE POUR LA PROCHAINE OUVERTURE ---
            // 1. Réinitialise l'état de la couverture d'animation
            bookCoverAnimation.style.display = 'block'; // S'assurer que la couverture est visible pour le prochain livre
            gsap.set(animatedCover, { rotationY: 0 }); // Réinitialiser sa rotation à 0 degrés
            bookCoverAnimation.classList.remove('flipped'); // S'assurer que la classe "flipped" est retirée
            
            // 2. Réinitialise l'iframe PDF
            pdfViewer.src = ''; // Très important de vider le src de l'iframe
            
            // 3. Masquer le contenu du livre et réafficher le prompt pour la prochaine fois
            bookContentDisplay.classList.add('hidden');
            bookContentDisplay.classList.remove('visible'); 
            bookContentDisplay.style.opacity = 0; // Assurer une opacité à 0
            
            bookPasswordPrompt.classList.remove('hidden'); 
            bookPasswordPrompt.style.display = 'block'; // S'assurer qu'il est affiché

            // 4. Vider le champ mot de passe et cacher le message d'erreur
            bookPasswordInput.value = ''; 
            bookErrorMessage.classList.remove('show'); 
            // --- FIN RÉINITIALISATION À LA FERMETURE ---
        }
    });
}

// Gestion de la vérification du mot de passe du livre
verifyBookButton.addEventListener('click', async () => {
    const password = bookPasswordInput.value;
    const currentBookData = BOOKS_DATA.find(book => book.id === currentBookId);

    // Vérifier si BOOK_PASSWORDS est défini et si le mot de passe existe pour ce livre
    if (typeof BOOK_PASSWORDS === 'undefined') {
        console.error("BOOK_PASSWORDS n'est pas défini. Assurez-vous que vos mots de passe de livres sont chargés.");
        showErrorMessage(bookErrorMessage, "Erreur de configuration. Veuillez contacter l'administrateur.");
        return;
    }

    if (password === BOOK_PASSWORDS[currentBookId]) {
        gsap.to(animatedCover, {
            rotationY: -180,
            duration: 1,
            ease: "power3.inOut",
            onComplete: async () => {
                // Masquer le prompt et afficher le contenu
                bookPasswordPrompt.classList.add('hidden');
                bookPasswordPrompt.style.display = 'none';

                bookContentDisplay.classList.remove('hidden');

                // Masquer l'animation de la couverture pour laisser le PDF apparaître
                bookCoverAnimation.style.display = 'none'; 
                
                if (currentBookData && currentBookData.pdfSrc) {
                    pdfViewer.src = currentBookData.pdfSrc; // Charger le PDF
                } else {
                    console.error("Chemin PDF non trouvé pour le livre:", currentBookId);
                    showErrorMessage(bookErrorMessage, "Désolé, le PDF de ce chapitre est introuvable.");
                }

                // Animer l'apparition du contenu du livre (PDF)
                gsap.fromTo(bookContentDisplay,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", onComplete: () => {
                        bookContentDisplay.classList.add('visible'); 
                    }}
                );
            }
        });

    } else {
        showErrorMessage(bookErrorMessage, "Mot de passe incorrect. Le chapitre reste secret.");
    }
    bookPasswordInput.value = '';
});


// --- Écouteurs d'Événements ---

// Accès initial au site
enterButton.addEventListener('click', () => {
    // Vérifier si MAIN_PASSWORD est défini
    if (typeof MAIN_PASSWORD === 'undefined') {
        console.error("MAIN_PASSWORD n'est pas défini. Assurez-vous que le mot de passe principal est configuré.");
        showErrorMessage(errorMessage, "Erreur de configuration. Veuillez contacter l'administrateur.");
        mainPasswordInput.value = '';
        return;
    }

    if (mainPasswordInput.value === MAIN_PASSWORD) {
        initSiteContent();
        // Optionnel : Désactiver l'écouteur après succès pour éviter des déclenchements multiples
        enterButton.removeEventListener('click', this); 
    } else {
        showErrorMessage(errorMessage, "Mot de passe incorrect. L'accès est refusé.");
    }
    mainPasswordInput.value = ''; // Toujours vider le champ
});

// Fermeture du modal du livre
closeModalBtn.addEventListener('click', closeBookModal);

// Contrôles du lecteur de musique
playPauseBtn.addEventListener('click', playPause);
nextTrackBtn.addEventListener('click', nextTrack);
prevTrackBtn.addEventListener('click', prevTrack);
progressOverlay.addEventListener('click', seek);
// NOUVEL ÉCOUTEUR POUR LE BOUTON DE BASCULE DU LECTEUR
togglePlayerBtn.addEventListener('click', togglePlayerMinimization);


// --- Initialisation au Chargement de la Page ---
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000); // Mettre à jour l'heure chaque seconde
});
