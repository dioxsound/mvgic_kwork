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
  const maxScroll = 300; // на каком скролле будет макс. блюр
  const maxBlur = 25; // максимум в px

  const scroll = Math.min(window.scrollY, maxScroll);
  const blurValue = (scroll / maxScroll) * maxBlur;

  background.style.setProperty('--blur-amount', `${blurValue}px`);
}

window.addEventListener('scroll', () => {
  requestAnimationFrame(updateBlurSmooth);
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view')
      } else {
        entry.target.classList.remove('in-view')
      }
    })
  },
  {
    threshold: 0.2
  }
)

document.querySelectorAll('.gallery__item').forEach(item => {
  observer.observe(item)
})

// === ПАРАЛЛАКС ГАЛЕРЕИ ===
const galleryItems = document.querySelectorAll('.gallery__item')

function parallaxGallery () {
  const windowHeight = window.innerHeight

  galleryItems.forEach(item => {
    const rect = item.getBoundingClientRect()
    const offset = rect.top - windowHeight / 2

    const maxTranslate = 50 // ограничим сдвиг, чтоб не улетали
    let translateY = offset * -0.15

    // clamp значение
    translateY = Math.max(-maxTranslate, Math.min(maxTranslate, translateY))

    item.style.transform = `translateY(${translateY}px)`
  })

  requestAnimationFrame(parallaxGallery)
}

requestAnimationFrame(parallaxGallery)
