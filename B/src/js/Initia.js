/** Initia.js ********************************************************************************************************** */
window.Initia = (function (_gsap) {
  let $swiper = document.querySelector('.swiper')
  let $section = document.querySelectorAll('section')
  let $scrollSection = document.querySelector('.section04')
  let $videoBox = document.querySelectorAll('section .video-box')
  let $topVideo = document.querySelector('#video01')
  let $motion = document.querySelectorAll('.motion')

  let documentH = document.documentElement.clientHeight
  let sectionY = []
  let scrollDir = ''
  let scrollTop = 0
  let slideIndex = 0
  let slideLength = $swiper.getElementsByTagName('section').length
  let isSlide = true
  let isVideoSection = [false, false, false, false, false, false, false, false]

  function moveSlide (dir) {
    if (slideIndex === 0 && dir === 'up') return
    if (isSlide) return
    isSlide = true

    /** 상단 슬라이드 **/
    scrollDir = dir
    if (dir === 'down') {
      slideIndex++
      if (slideIndex > slideLength) {
        slideIndex = slideLength
      } else if (slideIndex > slideLength - 1) {
        _gsap.to($topVideo, 0.5, {opacity: 0, ease: Cubic.easeInOut})
      }

    } else if (dir === 'up') {
      slideIndex--
      if (slideIndex < 0) {
        slideIndex = 0
      } else if (slideIndex < slideLength) {
        _gsap.to($topVideo, 1, {opacity: 0.9, ease: Cubic.easeInOut})
      }
    }

    _gsap.to('html, body', 0.8, {
      scrollTop: sectionY[slideIndex],
      ease: Cubic.easeOut,
      onComplete () {
        activeSlide(slideIndex)

        if (slideIndex >= slideLength) {
          /** 슬라이드 -> 스크롤 **/

          window.removeEventListener('wheel', onWheel)
          window.addEventListener('scroll', onScroll)
          window.dispatchEvent(new Event('scroll'))
          setTimeout(() => {
            // 스크롤 튐 방지
            isSlide = false
            document.body.blockScroll('scroll')
            document.body.bodySwipe('off')
          }, 1000)
        }

        if (scrollDir === 'up' && slideIndex === 2) {
          /** 스크롤 -> 슬라이드 **/

          $motion.forEach(el => {
            if (el.closest('.swiper')) return
            el.classList.remove('active')
          })

          isVideoSection = [false, false, false, false, false, false, false, false]
          $videoBox.forEach(el => {
            let $video = el.querySelector('video')
            $video.pause()
            $video.load()
          })
        }
      }
    })
  }

  function onScroll (e) {
    let dir = scrollTop < e.currentTarget.scrollY ? 'down' : 'up'
    scrollDir = dir
    scrollTop = e.currentTarget.scrollY
    let st = Math.floor(e.currentTarget.scrollY + ((dir === 'down') ? (window.innerHeight / 1.6) : 0))

    if (st < parseInt($scrollSection.offsetTop)) {
      /** 스크롤 -> 슬라이드 **/

      document.body.blockScroll('block')
      document.body.bodySwipe('on')
      window.removeEventListener('scroll', onScroll)
      window.addEventListener('wheel', onWheel)

      slideIndex = 3
      moveSlide('up')

    } else {
      /** 하단 스크롤 **/
      if (sectionY[3] <= st && st <= sectionY[4]) {
        if (!isVideoSection[3]) {
          slideIndex = 3
          activeSection(slideIndex)
        }
      } else if (sectionY[4] <= st && st <= sectionY[5]) {
        if (!isVideoSection[4]) {
          slideIndex = 4
          activeSection(slideIndex)
        }
      } else if (sectionY[5] <= st && st <= sectionY[6]) {
        if (!isVideoSection[5]) {
          slideIndex = 5
          activeSection(slideIndex)
        }
      } else if (sectionY[6] <= st && st <= sectionY[7]) {
        if (!isVideoSection[6]) {
          slideIndex = 6
          activeSection(slideIndex)
        }
      } else if (sectionY[7] <= st) {
        if (!isVideoSection[7]) {
          slideIndex = 7
          activeSection(slideIndex)
        }
      }
      activeMotion(e.currentTarget.scrollY)
    }
  }

  function onWheel (e) {
    if (!isSlide && Math.abs(e.deltaY) > 10) {
      moveSlide(e.deltaY > 0 ? 'down' : 'up')
    }
  }

  function activeMotion () {
    $motion.forEach(el => {
      if (!el.closest('.swiper')) {
        if (el.getBoundingClientRect) {
          let clientRect = el.getBoundingClientRect()
          let isView = documentH > clientRect.top + clientRect.height / 3

          el.classList[isView ? 'add' : 'remove']('active')
        }
      }
    })
  }

  function activeSlide (index) {
    let $swiperSection = $swiper.querySelectorAll('section')
    $swiperSection.forEach((el, idx) => {
      if (index === idx) {
        el.querySelectorAll('.motion').forEach(el=> {
          if (!el.classList.contains('active')) {
            el.classList.add('active')
          }
        })
      } else {
        el.querySelectorAll('.motion').forEach(el => {
          if (el.classList.contains('active')) {
            el.classList.remove('active')
          }
        })
      }
    })
  }

  function activeSection (index) {
    $section.forEach(($sect, idx) => {
      let $video = $sect.querySelector('video')
      if (index === idx) {
        if ($video) {
          $video.play()
        }
        isVideoSection[index] = true
      }
    })
  }

  function setSectionY () {
    sectionY = []
    Array.from(document.getElementsByTagName('section')).forEach((el, idx) => {
      sectionY.push(el.offsetTop)
    })
  }

  return {
    init () {
      window.onbeforeunload = () => window.scrollTo(0, 0)
      document.body.blockScroll('block')

      this.setEvent()
      this.setSwipe()
      this.setVideo()

      setSectionY()
      activeSlide(slideIndex)
    },
    setEvent () {
      window.addEventListener('resize', e => {
        setSectionY()
      })

      window.addEventListener('wheel', onWheel, {
        passive: false,
      })

      Array.from(document.getElementsByTagName('section')).forEach((el, idx) => {
        if (!el.closest('.swiper')) return

        let $motion = el.getElementsByClassName('motion')
        if ($motion.length > 0) {
          let length = $motion.length
          $motion[length - 1].addEventListener('animationend', e => {
            isSlide = false
          })
        }
      })
    },
    setSwipe () {
      document.body.bodySwipe({
        down () {},
        move () {},
        up (dir) {
          moveSlide(dir > 0 ? 'down' : 'up')
        }
      })
    },
    setVideo () {
      $topVideo.play()
      $videoBox.forEach(el => {
        let $video = el.querySelectorAll('video')
        $video.forEach(videoEl => {
          videoEl.addEventListener('ended', e => {
            let $video = e.target
            $video.pause()
            $video.currentTime = 6
            $video.play()
          })
        })
      })
    }
  }
}(window.gsap))
/** ***************************************************************************************************************** */
