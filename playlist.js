const tracks = [
    {
        title: 'Cloud 9',
        artist: 'Beach Bunny',
        file: 'cloud9.mp3',
        cover: '',
        lyrics: `
               
                Lately, I've been feeling not alive
                But you bring me back to life
                But when she loves me, I feel like I'm floating
                When she calls me pretty, I feel like somebody
                Even when we fade eventually, to nothing
                You will always be my favorite form of loving
`
    },
    {
        title: "Those Eyes", artist: 'Eye West', file: 'those_eyes.mp3', cover: '', lyrics: `
               
               'Cause all of the small things that you do
Are what remind me why I fell for you
And when we're apart and I'm missing you
I close my eyes and all I see is you
And the small things you do
`
    },
    {
       title: "The Space Between Us", artist: 'Siopaolo', file: 'the space between us.mp3', cover: '', lyrics: `
               
               You are my only one (my only one)
My shining sun
I keep orbit around
Nothing can take me down

Is it you?
My life, my moon, my everything
All I ever need baby
Travelling through galaxies
I don't need to breathe
I'll do anything to see
`
    },
    {
        title: 'The Only Exception', artist: 'Paramore', file: 'the_only_exception.mp3', cover: '',  lyrics: `
               To make it alone or keep a straight face
And I've always lived like this
Keeping a comfortable distance
And up until now, I had sworn to myself
That I'm content with loneliness
Because none of it was ever worth the risk
Well, you are the only exception
You are the only exception
`
    },
    {
        title: 'Sila', artist: 'Sud', file: 'sila.mp3', cover: '', lyrics: `
              Walang sagot sa tanong
Kung bakit ka mahalaga
Walang papantay sa'yo
Maging sino man sila
`
    },
    {
        title: 'Best Part', artist: 'Daniel Caesar', file: 'best_part.mp3', cover: '', lyrics: `
              I just wanna see how beautiful you are
You know that I see it, I know you're a star
Where you go, I'll follow, no matter how far
If life is a movie, then you're the best part, oh
You're the best part, ooh
`
    },
    {
        title: 'Pretty Boy', artist: 'The Neighbourhood', file: 'pretty_boy.mp3', cover: '', lyrics: `
             Even if my heart stops beating
You're the only thing I need, ooh, with me
Even if the Earth starts shaking
You're the only thing worth taking, ooh, with me
Even if the sky's on fire
Got you here, it's alright, ooh, with me
And if it's all over
I'm taking this moment, ooh, with me
`
    }
];

 const audio = new Audio();
        audio.preload = 'metadata';

        let current = 0;
        let isPlaying = false;
        let isLiked = false;
        let isShuffled = false;

        const vinyl = document.getElementById('vinyl');
        const needle = document.getElementById('needle');
        const trackTitle = document.getElementById('track-title');
        const trackArtist = document.getElementById('track-artist');
        const trackListEl = document.getElementById('trackList');
        const playBtn = document.getElementById('playBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const progressBar = document.getElementById('progressBar');
        const progressFill = progressBar.querySelector('i');
        const currentTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');
        const lyricsLine = document.getElementById('lyricsLine');
        const shuffleBtn = document.getElementById('shuffleBtn');
        const likeBtn = document.getElementById('likeBtn');

        const playIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="m2.7 1.3-.7.7v12l.7.7L15.4 8l-12.7-6.7z"/>
        </svg>`;

        const pauseIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>
        </svg>`;

        function loadTrack(i) {
            const t = tracks[i];
            audio.src = t.file;
            trackTitle.textContent = t.title;
            trackArtist.textContent = t.artist;
            document.getElementById('label-title').textContent = t.title;
            document.getElementById('label-artist').textContent = t.artist;
            document.querySelectorAll('.track-item').forEach((el, idx) => {
                el.classList.toggle('active', idx === i);
            });
            if (typeof t.lyrics === 'string') {
                lyricsLine.textContent = '';
                lyricsLine.innerText = t.lyrics.trim();
            } else {
                lyricsLine.textContent = (t.lyrics && t.lyrics.length) ? t.lyrics[0].line : 'No lyrics for this track.';
            }
        }

        function play() {
            audio.play().then(() => {
                isPlaying = true; vinyl.classList.add('playing'); needle.classList.add('playing'); 
                playBtn.querySelector('.control-icon').innerHTML = pauseIcon;
            }).catch(e => { console.warn('play failed', e); });
        }

        function pause() {
            audio.pause(); isPlaying = false; vinyl.classList.remove('playing'); needle.classList.remove('playing'); 
            playBtn.querySelector('.control-icon').innerHTML = playIcon;
        }

        // Like button functionality
        likeBtn.addEventListener('click', () => {
            isLiked = !isLiked;
            likeBtn.classList.toggle('liked', isLiked);
        });

        playBtn.addEventListener('click', () => {
            if (!audio.src) loadTrack(current);
            isPlaying ? pause() : play();
        });

        prevBtn.addEventListener('click', () => { 
            current = (current - 1 + tracks.length) % tracks.length; 
            loadTrack(current); 
            if (isPlaying) play(); 
        });

        nextBtn.addEventListener('click', () => { 
            current = (current + 1) % tracks.length; 
            loadTrack(current); 
            if (isPlaying) play(); 
        });

        shuffleBtn.addEventListener('click', () => { 
            isShuffled = !isShuffled;
            shuffleBtn.classList.toggle('shuffle-active', isShuffled);
            shuffle(); 
        });

        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const x = e.clientX - rect.left; const pct = x / rect.width; audio.currentTime = pct * audio.duration;
        });

        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            const pct = (audio.currentTime / audio.duration) * 100; progressFill.style.width = pct + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
            syncLyrics();
        });
        audio.addEventListener('loadedmetadata', () => { durationEl.textContent = formatTime(audio.duration); });
        audio.addEventListener('ended', () => { nextBtn.click(); });

        function formatTime(sec) { if (!sec || isNaN(sec)) return '0:00'; sec = Math.floor(sec); const m = Math.floor(sec / 60); const s = String(sec % 60).padStart(2, '0'); return `${m}:${s}` }

        function renderPlaylist() {
            trackListEl.innerHTML = '';
            tracks.forEach((t, i) => {
                const item = document.createElement('div'); item.className = 'track-item';
                item.innerHTML = `<div class="thumb">${t.title.charAt(0).toUpperCase()}</div><div class="meta"><b>${t.title}</b><span>${t.artist}</span></div>`;
                item.addEventListener('click', () => { current = i; loadTrack(i); play(); });
                trackListEl.appendChild(item);
            });
        }

        function syncLyrics() {
            const t = tracks[current];
            if (!t.lyrics || typeof t.lyrics === 'string') return;
            for (let i = t.lyrics.length - 1; i >= 0; i--) {
                if (audio.currentTime >= t.lyrics[i].time) {
                    if (lyricsLine.textContent !== t.lyrics[i].line) {
                        lyricsLine.style.opacity = 0;
                        setTimeout(() => {
                            lyricsLine.textContent = t.lyrics[i].line;
                            lyricsLine.style.opacity = 1;
                        }, 200);
                    }
                    break;
                }
            }
        }

        function shuffle() {
            for (let i = tracks.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[tracks[i], tracks[j]] = [tracks[j], tracks[i]] }
            renderPlaylist(); current = 0; loadTrack(0);
            if (isPlaying) play();
        }

        renderPlaylist();
        loadTrack(0);
        window.addEventListener('keydown', (e) => { 
            if (e.code === 'Space') { e.preventDefault(); playBtn.click() } 
            if (e.code === 'ArrowRight') { nextBtn.click() } 
            if (e.code === 'ArrowLeft') { prevBtn.click() } 
        });


          const envelope = document.getElementById('envelope');
        const letterContent = document.getElementById('letterContent');
        const closeBtn = document.getElementById('closeBtn');
        const floatingElements = document.getElementById('floatingElements');

        // Create subtle floating dots
        function createFloatingDot() {
            const dot = document.createElement('div');
            dot.className = 'floating-dot';
            dot.style.left = Math.random() * 100 + '%';
            dot.style.animationDelay = Math.random() * 20 + 's';
            dot.style.animationDuration = (Math.random() * 10 + 15) + 's';
            floatingElements.appendChild(dot);

            setTimeout(() => {
                if (dot.parentNode) {
                    dot.parentNode.removeChild(dot);
                }
            }, 25000);
        }

        // Create dots occasionally
        setInterval(createFloatingDot, 3000);

        function openLetter() {
            envelope.classList.add('opened');
            letterContent.classList.add('revealed');
        }

        function closeLetter() {
            envelope.classList.remove('opened');
            letterContent.classList.remove('revealed');
        }

        envelope.addEventListener('click', function(e) {
            if (!envelope.classList.contains('opened') && e.target !== closeBtn) {
                openLetter();
            }
        });

        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked'); // Debug log
            closeLetter();
        });

        // Alternative: also listen for mousedown to catch faster clicks
        closeBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });

        letterContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });