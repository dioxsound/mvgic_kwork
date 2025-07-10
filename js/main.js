// ============ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ============
const header = document.querySelector('.header')
const background = document.querySelector('.background')
const galleryItems = document.querySelectorAll('.gallery__item')
const audio = document.getElementById('background-audio')
const muteButton = document.querySelector('.header__menu-button')

let lastScrollY = 0
let ticking = false

// ============ ОТСЛЕЖИВАНИЕ ВЫСОТЫ ШАПКИ ============
function updateHeaderHeight () {
  document.documentElement.style.setProperty(
    '--header-height',
    `${header.offsetHeight}px`
  )
}

// Обновляем высоту шапки при загрузке и изменении размеров окна
updateHeaderHeight()
window.addEventListener('resize', updateHeaderHeight)

// ============ АНИМАЦИЯ РАЗМЫТИЯ ФОНА ============
function updateBlurSmooth () {
  const maxScroll = 300
  const maxBlur = 25
  const scroll = Math.min(window.scrollY, maxScroll)
  const blurValue = (scroll / maxScroll) * maxBlur

  background.style.setProperty('--blur-amount', `${blurValue}px`)
}

window.addEventListener('scroll', () => {
  requestAnimationFrame(updateBlurSmooth)
})

// ============ ИНТЕРСЕКЦИОННЫЙ ОБСЕРВЕР ДЛЯ ГАЛЕРЕИ ============
function handleIntersection (entries) {
  entries.forEach(entry => {
    const el = entry.target

    if (entry.isIntersecting) {
      el.classList.add('in-view')
      el.classList.remove('above', 'below')
    } else {
      const bounding = el.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      if (bounding.top < 0) {
        el.classList.remove('in-view', 'below')
        el.classList.add('above')
      } else if (bounding.top > viewportHeight) {
        el.classList.remove('in-view', 'above')
        el.classList.add('below')
      } else {
        el.classList.remove('in-view', 'above', 'below')
      }
    }
  })
}

const observer = new IntersectionObserver(handleIntersection, {
  threshold: 0,
  rootMargin: '10px 0px'
})

galleryItems.forEach(item => observer.observe(item))

// ============ КОНТРОЛЬ АУДИО ============
let audioInitialized = false

function initAudioPlayback () {
  if (!audio || !muteButton) return

  if (!audioInitialized) {
    audio.play().catch(err => {
      console.warn('Autoplay failed:', err)
    })
    audioInitialized = true
  }
}

// Автозапуск аудио при первом взаимодействии пользователя
;['click', 'scroll', 'keydown'].forEach(event => {
  window.addEventListener(event, initAudioPlayback, { once: true })
})

// Переключение состояния "тишина"
muteButton.addEventListener('click', () => {
  if (!audio) return

  audio.muted = !audio.muted
  muteButton.textContent = audio.muted ? 'Play' : 'Mute'
})

// ============ МЕНЮ С ПОДМЕНЮ "КОНТАКТЫ" ============
document.addEventListener('DOMContentLoaded', function () {
  const headerMenuItems = document.querySelectorAll('.header__menu-item')
  const submenu = document.querySelector('.header__submenu')
  const closeBtn = document.querySelector('.header__submenu-button')

  if (!submenu || !closeBtn) return

  let contactsMenuItem = null

  // Найдём пункт меню "Contacts"
  headerMenuItems.forEach(item => {
    const link = item.querySelector('.header__menu-button')
    if (link && link.textContent.trim() === 'Contacts') {
      contactsMenuItem = item
    }
  })

  if (!contactsMenuItem) return

  // Открытие подменю по клику на "Contacts"
  contactsMenuItem.addEventListener('click', function (e) {
    e.stopPropagation()
    submenu.classList.add('open')
  })

  // Закрытие подменю по клику на кнопку "Close"
  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation()
    submenu.classList.remove('open')
  })

  // Закрытие подменю при клике вне его области
  document.addEventListener('click', function (e) {
    if (!submenu.contains(e.target) && !contactsMenuItem.contains(e.target)) {
      submenu.classList.remove('open')
    }
  })
})
