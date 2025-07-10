const header = document.querySelector('.header')
document.documentElement.style.setProperty(
  '--header-height',
  `${header.offsetHeight}px`
)
window.addEventListener('resize', () => {
  document.documentElement.style.setProperty(
    '--header-height',
    `${header.offsetHeight}px`
  )
})

const background = document.querySelector('.background')

let lastScrollY = 0
let ticking = false

function updateBlurSmooth() {
  const maxScroll = 300;
  const maxBlur = 25;

  const scroll = Math.min(window.scrollY, maxScroll);
  const blurValue = (scroll / maxScroll) * maxBlur;

  background.style.setProperty('--blur-amount', `${blurValue}px`);
}

window.addEventListener('scroll', () => {
  requestAnimationFrame(updateBlurSmooth);
});


const galleryItems = document.querySelectorAll('.gallery__item');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const el = entry.target;

      if (entry.isIntersecting) {
        el.classList.add('in-view');
        el.classList.remove('above');
        el.classList.remove('below');
      } else {
        const bounding = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (bounding.top < 0) {
          // элемент выше экрана
          el.classList.remove('in-view');
          el.classList.add('above');
          el.classList.remove('below');
        } else if (bounding.top > viewportHeight) {
          // элемент ниже экрана
          el.classList.remove('in-view');
          el.classList.remove('above');
          el.classList.add('below');
        } else {
          el.classList.remove('in-view');
          el.classList.remove('above');
          el.classList.remove('below');
        }
      }
    });
  },
  {
    threshold: 0,
    rootMargin: '10px 0px',
  }
);



galleryItems.forEach(item => {
  observer.observe(item);
});










const audio = document.getElementById('background-audio');
const muteButton = document.querySelector('.header__menu-button');

let audioInitialized = false;

// Функция запуска звука
function initAudioPlayback() {
  if (!audioInitialized) {
    audio.play().catch(err => {
      console.warn('Audio playback failed:', err);
    });
    audioInitialized = true;
  }
}

// Включаем звук при ЛЮБОМ действии
['click', 'scroll', 'keydown'].forEach(event => {
  window.addEventListener(event, initAudioPlayback, { once: true });
});

// Обработка кнопки Mute
muteButton.addEventListener('click', () => {
  initAudioPlayback(); // на всякий случай, если первый клик — это mute
  audio.muted = !audio.muted;
  muteButton.textContent = audio.muted ? 'Play' : 'Mute';
});

