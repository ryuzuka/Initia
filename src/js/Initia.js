/** Initia.js ********************************************************************************************************** */
window.Initia = (function (_gsap) {
  let $swiper = document.querySelector('.swiper')
  let $section = document.querySelectorAll('section')
  let $scrollSection = document.querySelector('.section04')
  let $videoBox = document.querySelectorAll('section .video-box')
  let $topVideo = document.querySelector('#video01')

  let scrollDir = ''
  let scrollTop = 0
  let sectionY = []
  let slideIndex = 0
  let slideLength = $swiper.getElementsByTagName('section').length
  let isSlide = true
  let isVideoSection = [false, false, false, false, false, false, false, false]

  function slideSection (dir) {
    if (isSlide) return

    isSlide = true
    scrollDir = dir
    if (dir === 'down') {
      slideIndex++
      if (slideIndex > slideLength) {
        slideIndex = slideLength
      } else if (slideIndex > slideLength - 1) {
        _gsap.to($topVideo, 0.5, {opacity: 0, ease: Expo.easeOut})
      }

    } else if (dir === 'up') {
      slideIndex--
      if (slideIndex < 0) {
        slideIndex = 0
      } else if (slideIndex < slideLength) {
        _gsap.to($topVideo, 0.5, {opacity: 1, ease: Cubic.easeInOut})
      }
    }

    _gsap.to('html, body', 0.8, {
      scrollTop: sectionY[slideIndex],
      ease: Cubic.easeInOut,
      onComplete () {
        activeSection(slideIndex)
        if (slideIndex >= slideLength) {
          isSlide = false
          window.removeEventListener('wheel', onWheel)
          window.addEventListener('scroll', onScroll)
          window.dispatchEvent(new Event('scroll'))
          document.body.blockScroll('scroll')
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
    $section.forEach(($sect, idx) => {
      let $video = $sect.querySelector('video')
      if (index === idx) {
        $sect.querySelectorAll('.motion').forEach((el, idx) => {
          setInterval(() => el.classList.add('active'), 150 * idx)
        })
        if ($video) {
          _gsap.to($video.parentElement, 1, {opacity: 1, ease: Cubic.easeInOut})
          $video.play()
        }
      }
    })
  }

  function onScroll (e) {
    let dir = scrollTop < scrollY ? 'down' : 'up'
    scrollDir = dir
    scrollTop = e.currentTarget.scrollY
    let st = Math.floor(e.currentTarget.scrollY + ((dir === 'down') ? (window.innerHeight / 1.6) : 0))

    if (st < $scrollSection.offsetTop) {
      if (isSlide) return

      document.body.blockScroll('block')
      document.body.bodySwipe('on')
      window.removeEventListener('scroll', onScroll)
      window.addEventListener('wheel', onWheel)

      slideIndex = 3
      slideSection('up')

      $videoBox.forEach((el, idx) => {
        let $video = el.querySelector('video')
        isVideoSection[idx] = false
        _gsap.to($video.parentElement, 0.2, {opacity: 0, ease: Expo.easeOut, onComplete () {
          $video.pause()
        }})
      })

    } else {
      if (sectionY[3] <= st && st <= sectionY[4]) {
        if (!isVideoSection[3]) {
          slideIndex = 3
          isVideoSection = [false, false, false, true, false, false, false, false]
          activeVideoSection(slideIndex)
        }
      } else if (sectionY[4] <= st && st <= sectionY[5]) {
        if (!isVideoSection[4]) {
          slideIndex = 4
          isVideoSection = [false, false, false, false, true, false, false, false]
          activeVideoSection(slideIndex)
        }
      } else if (sectionY[5] <= st && st <= sectionY[6]) {
        if (!isVideoSection[5]) {
          slideIndex = 5
          isVideoSection = [false, false, false, false, false, true, false, false]
          activeVideoSection(slideIndex)
        }
      } else if (sectionY[6] <= st && st <= sectionY[7]) {
        if (!isVideoSection[6]) {
          slideIndex = 6
          isVideoSection = [false, false, false, false, false, false, true, false]
          activeVideoSection(slideIndex)
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

  return {
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
      $topVideo.play()
      $videoBox.forEach(el => {
        let $video = el.querySelectorAll('video')
        $video.forEach(videoEl => {
          videoEl.addEventListener('ended', e => {
            e.target.pause()
            e.target.currentTime = 6
            e.target.play()
          })
        })
      })
    }
  }
}(window.gsap))
/** ***************************************************************************************************************** */
