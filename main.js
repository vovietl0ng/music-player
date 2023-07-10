const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  // (1/2) Uncomment the line below to use localStorage
  // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Anh Nhớ Ra",
      singer: "Vũ ft Trang",
      path: "music/Anh Nhớ Ra.mp3",
      image:
        "https://i.ytimg.com/an/11XkLOIsLHI/2284248698322291325_mq.jpg?v=631d962a",
    },
    {
      name: "Cô ta",
      singer: "Vũ",
      path: "music/Cô Ta.mp3",
      image: "https://i.ytimg.com/vi/lxBC4SYjb2I/maxresdefault.jpg",
    },
    {
      name: "Bước qua mùa cô đơn",
      singer: "Vũ",
      path: "music/Bước Qua Mùa Cô Đơn.mp3",
      image: "https://i.ytimg.com/vi/n6Pnzi6r9NU/maxresdefault.jpg",
    },
    {
      name: "Bước qua nhau",
      singer: "Vũ",
      path: "music/Bước Qua Nhau.mp3",
      image: "https://i.ytimg.com/vi/Vdm6i1m4tDE/maxresdefault.jpg",
    },
    {
      name: "Đông kiếm em",
      singer: "Vũ",
      path: "music/Đông Kiếm Em.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2023/01/12/e/2/4/d/1673505926349_640.jpg",
    },
    {
      name: "Hành tinh song song",
      singer: "Vũ",
      path: "music/Hành Tinh Song Song.mp3",
      image: "https://i.ytimg.com/vi/Bmo4PSbB8E8/maxresdefault.jpg",
    },
    {
      name: "Happy for you",
      singer: "Vũ ft Lukas Graham",
      path: "music/Happy For You.mp3",
      image: "https://i.ytimg.com/vi/mf4upAPwHEo/maxresdefault.jpg?v=60ddd44b",
    },
    {
      name: "lạ lùng",
      singer: "Vũ",
      path: "music/Lạ Lùng.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2018/01/26/1/8/9/0/1516930244148_640.jpg",
    },
    {
      name: "Mở mắt",
      singer: "Đen ft Lil Wuyn",
      path: "music/Mở Mắt.mp3",
      image: "https://i.ytimg.com/vi/04pDvv3rN0g/maxresdefault.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                        <div class="song ${
                          index === this.currentIndex ? "active" : ""
                        }" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng

    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị pause

    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua song

    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next song

    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi prev song

    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Xử lý bật / tắt random song

    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xử lý lặp lại một song

    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xử lý next song khi audio ended

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist

    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song

        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xử lý khi click vào song option

        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Gán cấu hình từ config vào ứng dụng

    this.loadConfig();

    // Định nghĩa các thuộc tính cho object

    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)

    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng

    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button repeat & random

    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
