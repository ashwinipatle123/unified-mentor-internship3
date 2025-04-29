const previousButton = document.getElementById("previous");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const shuffleButton = document.getElementById("shuffle");
const playlistSongs = document.getElementById("playlist-songs");

const allSongs = [
    {
        id: 0,
        title: "Ajnabi Hawaye",
        artist: "Aditya Narayan, Shreya Ghoshal",
        duration: "4:42",
        src: "https://pagalfree.com/musics/128-Ajnabi%20Hawaayein%20Bekrara%20Bahein%20-%20Shaapit%20128%20Kbps.mp3",
    },
    {
        id: 1,
        title: "Sunn Raha Hai (Female)",
        artist: "Shreya Ghoshal",
        duration: "5:14",
        src: "https://pagalfree.com/musics/128-Sunn%20Raha%20Hai%20(Female)%20-%20Aashiqui%202%20128%20Kbps.mp3",
    },
    {
        id: 2,
        title: "Suna Suna",
        artist: "Shreya Ghoshal",
        duration: "7:21",
        src: "https://pagalfree.com/musics/128-Suna%20Suna%20-%20Krishna%20Cottage%20128%20Kbps.mp3",
    },
    {
        id: 3,
        title: "Gun Gun Guna",
        artist: "Sunidhi Chauhan & Udit Narayan",
        duration: "4:46",
        src: "https://pagalfree.com/musics/128-Gun%20Gun%20Guna%20-%20Agneepath%20128%20Kbps.mp3",
    },
    {
        id: 4,
        title: "Mere Khwabon Mein",
        artist: " Udit Narayan, Alka Yagnik",
        duration: "4:16",
        src: "https://pagalfree.com/musics/128-Mere%20Khwabon%20Mein%20-%20Dilwale%20Dulhania%20Le%20Jayenge%20128%20Kbps.mp3",
    },
    {
        id: 5,
        title: "Sona Kitna Sona Hai",
        artist: "Sushma Shreshta and Udit Narayan",
        duration: "4:53",
        src: "https://pagalnew.com/128-download/14708",
    },
    {
        id: 6,
        title: "Deewana kar raha hai",
        artist: "Javed Ali",
        duration: "5:38",
        src: "https://hindi2.djpunjab.app/load/5tCfqlHD5B14dhbNAl5tTA==/Deewana%20Kar%20Raha%20Hai.mp3",
    },
    {
        id: 7,
        title: "Dil To Pagal Hai",
        artist: "Lata Mangeshkar, Udit Narayan",
        duration: "5:36",
        src: "https://pagalfree.com/musics/128-Dil%20To%20Pagal%20Hai%20-%20Dil%20To%20Pagal%20Hai%20128%20Kbps.mp3",
    },
    {
        id: 8,
        title: "Mere Dholna",
        artist: "M. G. Sreekumar and Shreya Ghoshal",
        duration: "6:47",
        src: "https://pagalfree.com/musics/128-Mere%20Dholna%20-%20Bhool%20Bhulaiyaa%20128%20Kbps.mp3",
    },
    {
        id: 9,
        title: "Are Re Are",
        artist: "Lata Mangeshkar, Udit Narayan",
        duration: "5:35",
        src: "https://pagalfree.com/musics/128-Are%20Re%20Are%20-%20Dil%20To%20Pagal%20Hai%20128%20Kbps.mp3",
    },
];

const audio = new Audio();

let userData = {
    songs: [...allSongs],
    currentSong: null,
    songCurrentTime: 0,
};

const playPreviousSong = () => {
    if (userData?.currentSong === null) return;
    else {
        const currentSongIndex = getCurrentSongIndex();
        const previousSong = userData?.songs[currentSongIndex - 1];

        playSong(previousSong.id);
    }
};

const playSong = (id) => {
    const song = userData?.songs.find((song) => song.id === id);
    audio.src = song.src;
    audio.title = song.title;

    if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
        audio.currentTime = 0;
    } else {
        audio.currentTime = userData.songCurrentTime;
    }

    userData.currentSong = song;
    playButton.classList.add("playing");
    
    highlightCurrentSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();
    audio.play();
};

const pauseSong = () => {
    userData.songCurrentTime = audio.currentTime;

    playButton.classList.remove("playing");
    audio.pause();
};

const playNextSong = () => {
    if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
    } else {
        const currentSongIndex = getCurrentSongIndex();
        const nextSong = userData?.songs[currentSongIndex + 1];

        playSong(nextSong.id);
    }
};

const shuffle = () => {
    userData?.songs.sort(() => Math.random() - 0.5);
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    renderSongs(userData?.songs);
    pauseSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();
};

const deleteSong = (id) => {
    if (userData?.currentSong?.id === id) {
        userData.currentSong = null;
        userData.songCurrentTime = 0;
        pauseSong();
        setPlayerDisplay();
    }

    userData.songs = userData?.songs.filter((song) => song.id !== id);
    renderSongs(userData?.songs);
    highlightCurrentSong();
    setPlayButtonAccessibleText();

    if (userData.songs.length === 0) {
        const resetButton = document.createElement("button");
        const resetText = document.createTextNode("Reset Playlist");

        resetButton.id = "reset";
        resetButton.ariaLabel = "Reset playlist";
        resetButton.appendChild(resetText);
        playlistSongs.appendChild(resetButton);

        resetButton.addEventListener("click", () => {
            userData.songs = [...allSongs];
            renderSongs(userData?.songs);
            setPlayButtonAccessibleText();
            resetButton.remove();
        });
    }
};

const setPlayerDisplay = () => {
    const playingSong = document.getElementById("player-song-title");
    const songArtist = document.getElementById("player-song-artist");
    const currentTitle = userData?.currentSong?.title;
    const currentArtist = userData?.currentSong?.artist;

    playingSong.textContent = currentTitle ? currentTitle : "";
    songArtist.textContent = currentArtist ? currentArtist : "";
};

const highlightCurrentSong = () => {
    const playlistSongElements = document.querySelectorAll(".playlist-song");
    const songToHighlight = document.getElementById(`song-${userData?.currentSong?.id}`);

    playlistSongElements.forEach((songEl) => {
        songEl.removeAttribute("aria-current");
    });

    if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

const renderSongs = (array) => {
    const songsHTML = array
        .map((song) => {
            return `
            <li id="song-${song.id}" class="playlist-song">
                <button class="playlist-song-info" onclick="playSong(${song.id})">
                    <span class="playlist-song-title">${song.title}</span>
                    <span class="playlist-song-artist">${song.artist}</span>
                    <span class="playlist-song-duration">${song.duration}</span>
                </button>
                <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
                </button>
            </li>
            `;
        })
        .join("");

    playlistSongs.innerHTML = songsHTML;
};

const setPlayButtonAccessibleText = () => {
    const song = userData?.currentSong || userData?.songs[0];

    playButton.setAttribute(
        "aria-label",
        song?.title ? `Play ${song.title}` : "Play"
    );
};

const getCurrentSongIndex = () => userData?.songs.indexOf(userData.currentSong);

previousButton.addEventListener("click", playPreviousSong);

playButton.addEventListener("click", () => {
    if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
    } else {
        playSong(userData?.currentSong.id);
    }
});

pauseButton.addEventListener("click", pauseSong);

nextButton.addEventListener("click", playNextSong);  

shuffleButton.addEventListener("click", shuffle);

audio.addEventListener("ended", () => {
    const currentSongIndex = getCurrentSongIndex();
    const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;

    if (nextSongExists) {
        playNextSong();
    } else {
        userData.currentSong = null;
        userData.songCurrentTime = 0;

        pauseSong();
        setPlayerDisplay();
        highlightCurrentSong();
        setPlayButtonAccessibleText();
    }
});

const sortSongs = () => {
    userData?.songs.sort((a, b) => {
        if (a.title < b.title) {
            return -1;
        }
    
        if (a.title > b.title) {
            return 1;
        }
    
        return 0;
    });
    return userData?.songs;
}

renderSongs(sortSongs());
setPlayButtonAccessibleText();