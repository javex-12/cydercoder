// SoundWave Music Player JavaScript

class MusicPlayer {
    constructor() {
        this.currentTrack = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.repeatMode = 'none'; // none, one, all
        this.volume = 0.7;
        this.currentTime = 0;
        this.duration = 0;
        
        this.tracks = [
            {
                title: "Sunset Dreams",
                artist: "Ambient Waves",
                duration: 245,
                cover: "🌅"
            },
            {
                title: "Digital Horizon",
                artist: "Synth Masters",
                duration: 198,
                cover: "🌐"
            },
            {
                title: "Neon Nights",
                artist: "Retro Future",
                duration: 267,
                cover: "🌃"
            },
            {
                title: "Ocean Breeze",
                artist: "Nature Sounds",
                duration: 312,
                cover: "🌊"
            },
            {
                title: "Mountain Echo",
                artist: "Acoustic Soul",
                duration: 189,
                cover: "🏔️"
            },
            {
                title: "City Lights",
                artist: "Urban Beats",
                duration: 223,
                cover: "🏙️"
            }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderPlaylist();
        this.loadTrack(0);
        this.updateVolumeDisplay();
        this.startProgressSimulation();
    }

    setupEventListeners() {
        // Play/Pause button
        document.getElementById('playBtn').addEventListener('click', () => {
            this.togglePlay();
        });

        // Previous/Next buttons
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousTrack();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextTrack();
        });

        // Shuffle button
        document.getElementById('shuffleBtn').addEventListener('click', () => {
            this.toggleShuffle();
        });

        // Repeat button
        document.getElementById('repeatBtn').addEventListener('click', () => {
            this.toggleRepeat();
        });

        // Progress bar
        const progressBar = document.getElementById('progressBar');
        progressBar.addEventListener('click', (e) => {
            this.seekTo(e);
        });

        // Volume bar
        const volumeBar = document.getElementById('volumeBar');
        volumeBar.addEventListener('click', (e) => {
            this.setVolume(e);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    renderPlaylist() {
        const playlist = document.getElementById('playlist');
        playlist.innerHTML = '';

        this.tracks.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = `playlist-item ${index === this.currentTrack ? 'active' : ''}`;
            item.innerHTML = `
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${track.title}</div>
                    <div class="playlist-item-artist">${track.artist}</div>
                </div>
                <div class="playlist-item-duration">${this.formatTime(track.duration)}</div>
            `;
            
            item.addEventListener('click', () => {
                this.loadTrack(index);
                if (this.isPlaying) {
                    this.play();
                }
            });
            
            playlist.appendChild(item);
        });
    }

    loadTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;
        
        this.currentTrack = index;
        const track = this.tracks[index];
        
        // Update UI
        document.getElementById('trackTitle').textContent = track.title;
        document.getElementById('trackArtist').textContent = track.artist;
        document.getElementById('albumCover').innerHTML = `<span class="album-placeholder">${track.cover}</span>`;
        document.getElementById('totalTime').textContent = this.formatTime(track.duration);
        
        // Reset progress
        this.currentTime = 0;
        this.duration = track.duration;
        this.updateProgress();
        
        // Update playlist active state
        this.renderPlaylist();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.isPlaying = true;
        document.getElementById('playBtn').textContent = '⏸️';
        document.getElementById('albumCover').classList.add('playing');
        document.querySelector('.equalizer').classList.add('playing');
    }

    pause() {
        this.isPlaying = false;
        document.getElementById('playBtn').textContent = '▶️';
        document.getElementById('albumCover').classList.remove('playing');
        document.querySelector('.equalizer').classList.remove('playing');
    }

    previousTrack() {
        let newIndex;
        
        if (this.isShuffled) {
            newIndex = Math.floor(Math.random() * this.tracks.length);
        } else {
            newIndex = this.currentTrack - 1;
            if (newIndex < 0) {
                newIndex = this.tracks.length - 1;
            }
        }
        
        this.loadTrack(newIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    nextTrack() {
        let newIndex;
        
        if (this.repeatMode === 'one') {
            newIndex = this.currentTrack;
        } else if (this.isShuffled) {
            newIndex = Math.floor(Math.random() * this.tracks.length);
        } else {
            newIndex = this.currentTrack + 1;
            if (newIndex >= this.tracks.length) {
                if (this.repeatMode === 'all') {
                    newIndex = 0;
                } else {
                    this.pause();
                    return;
                }
            }
        }
        
        this.loadTrack(newIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        const shuffleBtn = document.getElementById('shuffleBtn');
        shuffleBtn.classList.toggle('active', this.isShuffled);
    }

    toggleRepeat() {
        const modes = ['none', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];
        
        const repeatBtn = document.getElementById('repeatBtn');
        repeatBtn.classList.toggle('active', this.repeatMode !== 'none');
        
        // Update button text based on mode
        switch (this.repeatMode) {
            case 'none':
                repeatBtn.textContent = '🔁';
                break;
            case 'all':
                repeatBtn.textContent = '🔁';
                break;
            case 'one':
                repeatBtn.textContent = '🔂';
                break;
        }
    }

    seekTo(e) {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        
        this.currentTime = percent * this.duration;
        this.updateProgress();
    }

    setVolume(e) {
        const volumeBar = e.currentTarget;
        const rect = volumeBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        
        this.volume = Math.max(0, Math.min(1, percent));
        this.updateVolumeDisplay();
    }

    updateProgress() {
        const percent = (this.currentTime / this.duration) * 100;
        
        document.getElementById('progressFill').style.width = `${percent}%`;
        document.getElementById('progressThumb').style.left = `${percent}%`;
        document.getElementById('currentTime').textContent = this.formatTime(this.currentTime);
    }

    updateVolumeDisplay() {
        const percent = this.volume * 100;
        
        document.getElementById('volumeFill').style.width = `${percent}%`;
        document.getElementById('volumeThumb').style.left = `${percent}%`;
        
        // Update volume icon
        const volumeIcon = document.querySelector('.volume-icon');
        if (this.volume === 0) {
            volumeIcon.textContent = '🔇';
        } else if (this.volume < 0.5) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }

    startProgressSimulation() {
        setInterval(() => {
            if (this.isPlaying && this.currentTime < this.duration) {
                this.currentTime += 1;
                this.updateProgress();
                
                // Auto next track when current ends
                if (this.currentTime >= this.duration) {
                    this.nextTrack();
                }
            }
        }, 1000);
    }

    handleKeyboard(e) {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousTrack();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextTrack();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.volume = Math.min(1, this.volume + 0.1);
                this.updateVolumeDisplay();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.volume = Math.max(0, this.volume - 0.1);
                this.updateVolumeDisplay();
                break;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize the music player
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
    console.log('SoundWave Music Player initialized!');
});