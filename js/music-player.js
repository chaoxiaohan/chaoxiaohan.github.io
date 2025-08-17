class MusicPlayer {
    constructor() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 0.7;
        this.isExpanded = false;
        this.currentLyricIndex = 0;
        this.lyrics = [];
        this.audio = null;
        this.currentSong = null;
        this.autoPlay = true; // 自动播放
        
        this.init();
    }

    init() {
        this.createPlayerHTML();
        this.bindEvents();
        this.loadDefaultSong();
    }

    createPlayerHTML() {
        const playerHTML = `
            <div class="music-player" id="musicPlayer">
                <div class="music-player-header" id="musicPlayerHeader">
                    <button class="music-toggle" id="musicToggle">
                        <i class="fa-solid fa-music"></i>
                    </button>
                    <div class="music-info">
                        <div class="music-title" id="musicTitle">Luv It Baby</div>
                        <div class="music-artist" id="musicArtist">点击播放音乐</div>
                    </div>
                </div>
                <div class="music-player-body">
                    <img class="music-cover" id="musicCover" src="/images/default-cover.svg" alt="音乐封面">
                    <div class="music-lyrics" id="musicLyrics">
                        <div class="lyric-line">暂无歌词</div>
                        <div class="lyric-line"></div>
                    </div>
                    <div class="music-progress-container">
                        <div class="music-progress" id="musicProgress">
                            <div class="music-progress-bar" id="musicProgressBar"></div>
                        </div>
                        <div class="music-time">
                            <span id="currentTime">00:00</span>
                            <span id="totalTime">00:00</span>
                        </div>
                    </div>
                    <div class="music-controls">
                        <button class="music-btn play-pause" id="playPauseBtn">
                            <i class="fa-solid fa-play"></i>
                        </button>
                    </div>
                    <div class="music-volume-container">
                        <span class="volume-icon">🔊</span>
                        <div class="music-volume" id="musicVolume">
                            <div class="music-volume-bar" id="musicVolumeBar"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', playerHTML);
    }

    bindEvents() {
        const header = document.getElementById('musicPlayerHeader');
        const player = document.getElementById('musicPlayer');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const progress = document.getElementById('musicProgress');
        const volume = document.getElementById('musicVolume');

        // 展开/收起播放器
        header.addEventListener('click', () => {
            this.togglePlayer();
        });

        // 播放/暂停
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePlay();
        });

        // 进度条控制
        progress.addEventListener('click', (e) => {
            const rect = progress.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.seekTo(percent);
        });

        // 音量控制
        volume.addEventListener('click', (e) => {
            const rect = volume.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.setVolume(percent);
        });
    }

    togglePlayer() {
        const player = document.getElementById('musicPlayer');
        this.isExpanded = !this.isExpanded;
        
        if (this.isExpanded) {
            player.classList.add('expanded');
        } else {
            player.classList.remove('expanded');
        }
    }

    // 解析LRC歌词格式
    parseLyrics(lyricText) {
        const lines = lyricText.split('\n');
        const lyrics = [];
        
        for (const line of lines) {
            const match = line.match(/\[(\d{2}):(\d{2}\.\d{2,3})\](.*)/);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseFloat(match[2]);
                const time = (minutes * 60 + seconds) * 1000; // 转换为毫秒
                const text = match[3].trim();
                
                if (text) { // 只添加非空歌词
                    lyrics.push({ time, text });
                }
            }
        }
        
        return lyrics.sort((a, b) => a.time - b.time);
    }

    loadDefaultSong() {
        // 真实歌词文本
        const lyricText = `[by:安潺]
[00:12.542]Baby きみが「かわいい」って
[00:15.391]言ってくれたメイクと服のまま一生いたいな
[00:25.257]Baby 耳に残るLove you
[00:27.794]不安を脱ぎ捨てられたら一緒にいられるの？
[00:36.115]会いたいな きみは何してるのかな
[00:43.213]返事もないから今夜も眠れないの
[00:49.436]わかってる？きみのせいだよ
[00:51.993]最近 私かわいくなったの
[00:55.103]勇気出したら奇跡は起きる?
[00:57.998]好きになっても いいの？だめなの？
[01:02.049]Luv it luv it luv it Baby
[01:05.076]さびしいの？Rabbit Baby
[01:08.252]どうしよう抱きしめたい
[01:11.290]傷付きたくないのに
[01:14.365]Luv it luv it luv it Baby
[01:17.246]きみとなら恋したいの
[01:26.412]もっと単純に もっと曖昧に
[01:29.313]もっと大胆に もっとPlease love me
[01:32.273]ちょっと苦しい恋は怖い
[01:35.654]だけど知りたい 「好き」って痛い?
[01:39.390]きみの匂いがする甘いワンルーム
[01:45.595]画面を飛び越えて きみにふれた
[01:51.057]わからないでしょ?
[01:52.976]きみの返事のない夜
[01:53.618]いつも泣いてますけど
[01:56.904]忘れないでよ キスした事も
[02:00.120]みんながいても名前呼んでよ
[02:03.390]Luv it luv it luv it Baby
[02:06.853]なんであの子を見てるの?
[02:09.947]なんで私じゃダメなの?
[02:12.789]なのになんで優しいの?
[02:16.267]Luv it luv it luv it Baby
[02:19.363]泣いちゃいそうだよ
[02:23.177]きみがほしいの
[02:28.378]もっと单純に もっと曖昧に
[02:30.895]もっと大胆に もっとPlease love me
[02:34.011]ちょっと苦しい恋は怖い
[02:37.358]だけど知りたい 「好き」って言いたい`;

        // 单一歌曲配置
        const song = {
            title: "Luv It Baby",
            artist: "なえなの",
            cover: "https://picgo-chaoxiaohan.oss-cn-qingdao.aliyuncs.com/img/music1.jpg",
            netease_id: "2158522240",
            lyrics: this.parseLyrics(lyricText)
        };

        this.currentSong = song;
        this.loadSong(song);
    }

    loadSong(song) {
        this.currentSong = song;
        this.lyrics = song.lyrics || [];
        this.currentTime = 0;
        this.currentLyricIndex = 0;
        
        document.getElementById('musicTitle').textContent = song.title;
        document.getElementById('musicArtist').textContent = song.artist;
        document.getElementById('musicCover').src = song.cover || '/images/default-cover.svg';
        
        if (this.audio) {
            this.audio.pause();
        }
        
        // 创建新的音频对象
        this.audio = new Audio();
        this.audio.volume = this.volume;
        this.audio.crossOrigin = "anonymous";
        
        // 使用OSS上的音频文件
        const audioUrl = 'https://picgo-chaoxiaohan.oss-cn-qingdao.aliyuncs.com/img/background_music.mp3';
        console.log('正在加载音频:', audioUrl);
        
        this.loadSingleAudioSource(audioUrl);

        this.audio.addEventListener('loadedmetadata', () => {
            this.duration = this.audio.duration;
            document.getElementById('totalTime').textContent = this.formatTime(this.duration);
            console.log('音频元数据加载完成:', song.title, '时长:', this.formatTime(this.duration));
            
            // 如果设置了自动播放，则开始播放
            if (this.autoPlay) {
                this.startAutoPlay();
            }
        });

        this.audio.addEventListener('timeupdate', () => {
            this.currentTime = this.audio.currentTime;
            this.updateProgress();
            this.updateLyrics();
        });

        this.audio.addEventListener('ended', () => {
            // 循环播放同一首歌
            this.currentTime = 0;
            this.currentLyricIndex = 0;
            this.audio.currentTime = 0;
            this.audio.play();
            this.displayLyrics();
        });

        this.audio.addEventListener('error', (e) => {
            console.log('音频播放出错:', e);
        });

        // 重置显示
        this.displayLyrics();
        document.getElementById('currentTime').textContent = '00:00';
    }

    startAutoPlay() {
        // 延迟自动播放，确保音频完全加载
        console.log('准备自动播放音频...');
        
        setTimeout(() => {
            if (this.audio && this.audio.readyState >= 2) {
                this.startPlayback();
            } else {
                console.log('音频尚未准备就绪，等待加载...');
                // 如果音频还没准备好，等待canplay事件自动触发播放
            }
        }, 2000);
    }

    loadSingleAudioSource(audioUrl) {
        console.log('开始加载音频:', audioUrl);
        document.getElementById('musicArtist').textContent = this.currentSong.artist + ' • 正在连接音频...';
        
        // 重置音频对象
        this.audio.src = '';
        this.audio.load();
        
        // 设置超时检查
        const loadTimeout = setTimeout(() => {
            console.log('音频加载超时');
            this.showAudioError('加载超时，请检查网络连接');
        }, 15000); // 15秒超时

        // 音频可以播放事件
        const onCanPlay = () => {
            clearTimeout(loadTimeout);
            this.audio.removeEventListener('canplay', onCanPlay);
            this.audio.removeEventListener('error', onError);
            this.audio.removeEventListener('loadstart', onLoadStart);
            
            console.log('✅ 音频加载成功，可以播放');
            document.getElementById('musicArtist').textContent = this.currentSong.artist + ' • 音频已就绪';
            
            // 自动播放
            if (this.autoPlay) {
                console.log('开始自动播放...');
                this.startPlayback();
            }
        };

        // 开始加载事件
        const onLoadStart = () => {
            console.log('音频开始下载...');
            document.getElementById('musicArtist').textContent = this.currentSong.artist + ' • 正在加载...';
        };

        // 错误事件
        const onError = (e) => {
            clearTimeout(loadTimeout);
            this.audio.removeEventListener('canplay', onCanPlay);
            this.audio.removeEventListener('error', onError);
            this.audio.removeEventListener('loadstart', onLoadStart);
            
            console.error('❌ 音频加载失败:', e.type, e);
            this.showAudioError('音频加载失败，请检查网络或稍后重试');
        };

        // 音频可以开始播放事件(有足够数据)
        const onCanPlayThrough = () => {
            console.log('音频数据足够，可以完整播放');
        };

        // 添加事件监听器
        this.audio.addEventListener('canplay', onCanPlay, { once: true });
        this.audio.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
        this.audio.addEventListener('error', onError, { once: true });
        this.audio.addEventListener('loadstart', onLoadStart, { once: true });

        // 添加更多调试事件
        this.audio.addEventListener('progress', () => {
            console.log('音频下载进度更新');
        });

        this.audio.addEventListener('suspend', () => {
            console.log('音频数据加载暂停');
        });

        this.audio.addEventListener('loadeddata', () => {
            console.log('音频第一帧数据加载完成');
        });

        // 设置音频源并开始加载
        try {
            this.audio.src = audioUrl;
            console.log('设置音频源:', audioUrl);
            this.audio.load();
            console.log('开始加载音频数据...');
        } catch (error) {
            console.error('设置音频源时出错:', error);
            this.showAudioError('音频源设置失败');
        }
    }

    startPlayback() {
        if (!this.audio || !this.audio.src) {
            console.error('音频未准备好 - 无音频对象或音频源');
            return;
        }

        console.log('尝试开始播放音频...');
        console.log('音频状态 - readyState:', this.audio.readyState, 'networkState:', this.audio.networkState);
        
        this.audio.play().then(() => {
            console.log('✅ 音频播放成功启动');
            this.isPlaying = true;
            const playBtn = document.getElementById('playPauseBtn');
            const player = document.getElementById('musicPlayer');
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            player.classList.add('playing');
            
            // 更新显示状态
            document.getElementById('musicArtist').textContent = this.currentSong.artist + ' • 正在播放';
            
        }).catch(e => {
            console.error('⚠️ 音频播放失败:', e.name, e.message);
            
            if (e.name === 'NotAllowedError') {
                console.log('浏览器阻止自动播放，需要用户交互');
                this.showPlayTip();
                this.setupUserInteractionPlay();
            } else {
                console.log('其他播放错误:', e);
                this.showAudioError('播放失败: ' + e.message);
            }
        });
    }

    setupUserInteractionPlay() {
        console.log('设置用户交互播放...');
        
        const enablePlay = () => {
            console.log('用户交互触发，尝试播放...');
            if (!this.isPlaying && this.audio && this.audio.src) {
                this.startPlayback();
            }
            // 移除事件监听器
            document.removeEventListener('click', enablePlay);
            document.removeEventListener('keydown', enablePlay);
            document.removeEventListener('touchstart', enablePlay);
        };
        
        // 监听多种用户交互事件
        document.addEventListener('click', enablePlay, { once: true });
        document.addEventListener('keydown', enablePlay, { once: true });
        document.addEventListener('touchstart', enablePlay, { once: true });
    }

    showAudioError(message) {
        const artistEl = document.getElementById('musicArtist');
        artistEl.textContent = message;
        artistEl.style.color = '#ff6b6b';
        
        // 3秒后恢复原始文本
        setTimeout(() => {
            artistEl.textContent = this.currentSong.artist;
            artistEl.style.color = '';
        }, 3000);
        
        console.error('音频播放错误:', message);
    }

    togglePlay() {
        console.log('用户点击播放/暂停按钮');
        
        if (!this.audio || !this.audio.src) {
            console.error('音频尚未准备好 - 无音频对象或音频源');
            this.showAudioError('音频未加载，请稍后重试');
            return;
        }

        console.log('当前音频状态:', {
            isPlaying: this.isPlaying,
            readyState: this.audio.readyState,
            networkState: this.audio.networkState,
            paused: this.audio.paused,
            src: this.audio.src
        });

        this.isPlaying = !this.isPlaying;
        const playBtn = document.getElementById('playPauseBtn');
        const player = document.getElementById('musicPlayer');
        
        if (this.isPlaying) {
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            player.classList.add('playing');
            
            // 播放真实音频
            this.audio.play().then(() => {
                console.log('✅ 手动播放成功');
                document.getElementById('musicArtist').textContent = this.currentSong.artist + ' • 正在播放';
            }).catch(e => {
                console.error('❌ 手动播放失败:', e.name, e.message);
                this.isPlaying = false;
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                player.classList.remove('playing');
                this.showAudioError('播放失败: ' + e.message);
            });
        } else {
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            player.classList.remove('playing');
            this.audio.pause();
            console.log('音频已暂停');
            document.getElementById('musicArtist').textContent = this.currentSong.artist + ' • 已暂停';
        }
    }

    showPlayTip() {
        // 显示需要用户交互才能播放音频的提示
        const playBtn = document.getElementById('playPauseBtn');
        const originalHTML = playBtn.innerHTML;
        
        playBtn.innerHTML = '<i class="fa-solid fa-hand-pointer"></i>';
        playBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8e8e)';
        
        setTimeout(() => {
            playBtn.innerHTML = originalHTML;
            playBtn.style.background = 'linear-gradient(135deg, #4a90e2, #87ceeb)';
        }, 2000);
        
        console.log('由于浏览器安全策略，需要用户手动点击播放');
    }

    seekTo(percent) {
        if (!this.audio || !this.duration) {
            return;
        }
        
        const newTime = this.duration * percent;
        this.audio.currentTime = newTime;
        this.updateProgress();
    }

    setVolume(percent) {
        this.volume = Math.max(0, Math.min(1, percent));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        document.getElementById('musicVolumeBar').style.width = (this.volume * 100) + '%';
    }

    updateProgress() {
        const percent = (this.currentTime / this.duration) * 100;
        document.getElementById('musicProgressBar').style.width = percent + '%';
        document.getElementById('currentTime').textContent = this.formatTime(this.currentTime);
    }

    updateLyrics() {
        if (!this.lyrics.length) return;
        
        let currentIndex = 0;
        for (let i = 0; i < this.lyrics.length; i++) {
            if (this.currentTime * 1000 >= this.lyrics[i].time) {
                currentIndex = i;
            } else {
                break;
            }
        }

        if (currentIndex !== this.currentLyricIndex) {
            this.currentLyricIndex = currentIndex;
            this.displayLyrics();
        }
    }

    displayLyrics() {
        const lyricsContainer = document.getElementById('musicLyrics');
        const lines = lyricsContainer.querySelectorAll('.lyric-line');
        
        // 显示当前和下一句歌词
        const currentLyric = this.lyrics[this.currentLyricIndex]?.text || '';
        const nextLyric = this.lyrics[this.currentLyricIndex + 1]?.text || '';
        
        lines[0].textContent = currentLyric;
        lines[1].textContent = nextLyric;
        
        lines[0].classList.add('current');
        lines[1].classList.remove('current');
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// 页面加载完成后初始化音乐播放器
document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，确保页面完全加载
    setTimeout(() => {
        window.musicPlayer = new MusicPlayer();
        console.log('🎵 音乐播放器初始化完成');
        
        // 自动展开播放器
        setTimeout(() => {
            const player = document.getElementById('musicPlayer');
            if (player) {
                player.classList.add('expanded');
                window.musicPlayer.isExpanded = true;
            }
        }, 2000);
        
        // 尝试启用音频上下文（某些浏览器需要）
        document.addEventListener('click', function enableAudio() {
            const audioContext = window.AudioContext || window.webkitAudioContext;
            if (audioContext) {
                const context = new audioContext();
                if (context.state === 'suspended') {
                    context.resume();
                }
            }
            document.removeEventListener('click', enableAudio);
        }, { once: true });
        
    }, 1000);
});
