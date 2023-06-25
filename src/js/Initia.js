/** Initia.js ********************************************************************************************************** */
window.Initia = (function (_gsap) {
  let $swiper = document.querySelector('.swiper')
  let $section = document.querySelectorAll('section')
  let $scrollSection = document.querySelector('.section04')
  let $topVideo = document.querySelector('#video01')
  let $videoBox = document.querySelectorAll('section .video-box')

  let scrollDir = ''
  let sectionY = []
  let slideIndex = 0
  let slideLength = $swiper.getElementsByTagName('section').length
  let isSlide = true
  let isVideoSection = [false, false, false, false, false, false, false, false]

  function slideSection (dir) {
    isSlide = true
    if (dir === 'down') {
      slideIndex++
      if (slideIndex > slideLength) {
        slideIndex = slideLength
        isSlide = false
      } else if (slideIndex > slideLength - 1) {
        _gsap.to($topVideo, 0.5, {opacity: 0, ease: Expo.easeOut})

      }

    } else if (dir === 'up') {
      slideIndex--
      if (slideIndex < 0) {
        slideIndex = 0
        isSlide = false
      } else if (slideIndex < slideLength) {
        _gsap.to($topVideo, 0.5, {opacity: 1, ease: Cubic.easeInOut})
      }
    }

    _gsap.to('html, body', 1, {
      scrollTop: sectionY[slideIndex],
      ease: Cubic.easeOut,
      onComplete () {
        activeSection(slideIndex)
        if (slideIndex >= slideLength) {
          isSlide = false
          window.removeEventListener('wheel', onWheel)
          window.addEventListener('scroll', onScroll)
          window.dispatchEvent(new Event('scroll'))
          document.body.blockScroll('scroll')
          document.body.bodySwipe('off')
        }
      }
    })
  }

  function activeSection (index) {
    let $swiperSection = $swiper.querySelectorAll('section')
    $swiperSection.forEach((el, idx) => {
      if (index === idx) {
        el.querySelectorAll('.motion').forEach(el=> {
          el.classList.add('active')
        })
      } else {
        el.querySelectorAll('.motion').forEach(el => {
          el.classList.remove('active')
        })
      }
    })
  }

  function setSectionY () {
    sectionY = []
    Array.from(document.getElementsByTagName('section')).forEach((el, idx) => {
      sectionY.push(el.offsetTop)
    })
  }

  function onWheel (e) {
    if (!isSlide && Math.abs(e.deltaY) > 10) {
      slideSection(e.deltaY > 0 ? 'down' : 'up')
    }
  }

  function activeVideoSection (index) {
    console.log('slideIndex: ', slideIndex, isVideoSection)
    $section.forEach(($sect, idx) => {
      let $video = $sect.querySelector('video')
      if (index === idx) {
        $sect.querySelectorAll('.motion').forEach((el, idx) => {
          setInterval(() => el.classList.add('active'), 150 * idx)
        })
        if ($video) {
          _gsap.to($video.parentElement, 0.5, {opacity: 1, ease: Cubic.easeOut})
          $video.play()
        }
      }
    })
  }

  let scrollTop = 0

  function onScroll (e) {
    let dir = scrollTop < scrollY ? 'down' : 'up'
    scrollTop = e.currentTarget.scrollY
    let st = Math.floor(e.currentTarget.scrollY + ((dir === 'down') ? (window.innerHeight / 1.6) : 0))

    if (st < $scrollSection.offsetTop) {
      document.body.blockScroll('block')
      document.body.bodySwipe('on')
      window.removeEventListener('scroll', onScroll)
      window.addEventListener('wheel', onWheel)

      slideIndex = 3
      $videoBox.forEach((el, idx) => {
        let $video = el.querySelector('video')
        isVideoSection[idx] = false
        _gsap.to($video.parentElement, 0.5, {opacity: 0, ease: Expo.easeOut, onComplete () {
          $video.pause()
        }})
      })
      slideSection('up')
    } else {
      if (sectionY[3] <= st && st <= sectionY[4]) {
        if (!isVideoSection[3]) {
          slideIndex = 3
          isVideoSection = [false, false, false, true, false, false, false, false]
          activeVideoSection(slideIndex)
          _gsap.to(document.querySelector('#video05').parentElement, 0.15, {opacity: 0, ease: Expo.easeOut})
        }
      } else if (sectionY[4] <= st && st <= sectionY[5]) {
        if (!isVideoSection[4]) {
          slideIndex = 4
          isVideoSection = [false, false, false, false, true, false, false, false]
          activeVideoSection(slideIndex)
          _gsap.to(document.querySelector('#video04').parentElement, 0.15, {opacity: 0, ease: Expo.easeOut})
          _gsap.to(document.querySelector('#video06').parentElement, 0.15, {opacity: 0, ease: Expo.easeOut})
        }
      } else if (sectionY[5] <= st && st <= sectionY[6]) {
        if (!isVideoSection[5]) {
          slideIndex = 5
          isVideoSection = [false, false, false, false, false, true, false, false]
          activeVideoSection(slideIndex)
          _gsap.to(document.querySelector('#video05').parentElement, 0.15, {opacity: 0, ease: Expo.easeOut})
          _gsap.to(document.querySelector('#video07').parentElement, 0.15, {opacity: 0, ease: Expo.easeOut})
          _gsap.to(document.querySelector('#video08').parentElement, 0.15, {opacity: 0, ease: Expo.easeOut})
        }
      } else if (sectionY[6] <= st && st <= sectionY[7]) {
        if (!isVideoSection[6]) {
          slideIndex = 6
          isVideoSection = [false, false, false, false, false, false, true, false]
          activeVideoSection(slideIndex)
          _gsap.to(document.querySelector('#video06').parentElement, 0.15, {opacity: 0, ease: Expo.easeOut})
        }
      }
      if ((st + window.innerHeight / 4) > sectionY[7]) {
        if (!isVideoSection[7]) {
          slideIndex = 7
          isVideoSection = [false, false, false, false, false, false, false, true]
          activeVideoSection(slideIndex)
        }
      }
    }
  }

  let _initia = {
    init () {
      window.onbeforeunload = () => window.scrollTo(0, 0)
      document.body.blockScroll('block')

      this.setEvent()
      this.setSwipe()
      this.setVideo()

      window.dispatchEvent(new CustomEvent('resize', {detail: {}}))

      activeSection(slideIndex)
    },
    setEvent () {
      Array.from(document.getElementsByTagName('section')).forEach((el, idx) => {
        let $motion = el.getElementsByClassName('motion')
        if ($motion.length > 0) {
          let length = $motion.length
          $motion[length - 1].addEventListener('animationend', e => {
            isSlide = false
          })
        }
      })

      window.addEventListener('resize', e => {
        setSectionY()
      })

      window.addEventListener('wheel', onWheel, {
        passive: false,
      })
    },
    setSwipe () {
      document.body.bodySwipe({
        down () {},
        move () {},
        up (dir, dis) {
          if (isSlide) return
          slideSection(dir > 0 ? 'down' : 'up')
        }
      })
    },
    setVideo () {
      let videoLength = $videoBox.length
      $topVideo.play()
      $videoBox.forEach((el, idx) => {
        el.style.opacity = 0
        if (idx < videoLength - 2) {
          Object.assign(el.style, {
            position: 'fixed',
            top: (window.innerHeight - el.offsetHeight) / 2 + 'px'
          })
        }
      })
    }
  }

  return _initia
}(window.gsap))
/** ***************************************************************************************************************** */
