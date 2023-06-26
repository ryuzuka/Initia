/** Initia.js ********************************************************************************************************** */
window.Initia = (function (_gsap) {
  let $swiper = document.querySelector('.swiper')
  let $section = document.querySelectorAll('section')
  let $scrollSection = document.querySelector('.section04')
  let $videoBox = document.querySelectorAll('section .video-box')
  let $topVideo = document.querySelector('#video01')

  let sectionY = []
  let scrollDir = ''
  let scrollTop = 0
  let slideIndex = 0
  let slideLength = $swiper.getElementsByTagName('section').length
  let isSlide = true
  let isVideoSection = [false, false, false, false, false, false, false, false]

  function moveSlideSection (dir) {
    /** 상단 슬라이드 **/
    if (dir === 'up' && slideIndex === 0) return

    if (isSlide) return
    isSlide = true

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
        _gsap.to($topVideo, 0.5, {opacity: 1, ease: Cubic.easeInOut})
      }
    }

    _gsap.to('html, body', 0.8, {
      scrollTop: sectionY[slideIndex],
      ease: Cubic.easeInOut,
      onComplete () {
        activeSlideSection(slideIndex)
        if (slideIndex >= slideLength) {
          /** 슬라이드 -> 스크롤 **/

          isSlide = false
          window.removeEventListener('wheel', onWheel)
          window.addEventListener('scroll', onScroll)
          window.dispatchEvent(new Event('scroll'))
          setTimeout(() => {
            // 스크롤 튐 방지
            document.body.blockScroll('scroll')
          }, 100)
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
      /** 스크롤 -> 슬라이드 **/
      // if (isSlide) return

      document.body.blockScroll('block')
      document.body.bodySwipe('on')
      window.removeEventListener('scroll', onScroll)
      window.addEventListener('wheel', onWheel)

      slideIndex = 3
      moveSlideSection('up')

    } else {
      /** 하단 스크롤 **/
      if (sectionY[3] <= st && st <= sectionY[4]) {
        if (!isVideoSection[3]) {
          slideIndex = 3
          activeVideoSection(slideIndex)
        }
      } else if (sectionY[4] <= st && st <= sectionY[5]) {
        if (!isVideoSection[4]) {
          slideIndex = 4
          activeVideoSection(slideIndex)
        }
      } else if (sectionY[5] <= st && st <= sectionY[6]) {
        if (!isVideoSection[5]) {
          slideIndex = 5
          activeVideoSection(slideIndex)
        }
      } else if (sectionY[6] <= st && st <= sectionY[7]) {
        if (!isVideoSection[6]) {
          slideIndex = 6
          activeVideoSection(slideIndex)
        }
      }
      if ((st + window.innerHeight / 4) > sectionY[7]) {
        if (!isVideoSection[7]) {
          slideIndex = 7
          activeVideoSection(slideIndex)
        }
      }
    }
  }

  function setSectionY () {
    sectionY = []
    Array.from(document.getElementsByTagName('section')).forEach((el, idx) => {
      sectionY.push(el.offsetTop)
    })
  }

  function onWheel (e) {
    if (!isSlide && Math.abs(e.deltaY) > 10) {
      moveSlideSection(e.deltaY > 0 ? 'down' : 'up')
    }
  }

  function activeSlideSection (index) {
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
        isVideoSection[idx] = true
      }
    })
  }

  return {
    init () {
      window.onbeforeunload = () => window.scrollTo(0, 0)
      document.body.blockScroll('block')

      this.setEvent()
      this.setSwipe()
      this.setVideo()

      window.dispatchEvent(new CustomEvent('resize', {detail: {}}))

      activeSlideSection(slideIndex)
    },
    setEvent () {
      window.addEventListener('resize', e => {
        setSectionY()
      })

      window.addEventListener('wheel', onWheel, {
        passive: false,
      })

      Array.from(document.getElementsByTagName('section')).forEach((el, idx) => {
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
          // if (isSlide) return
          moveSlideSection(dir > 0 ? 'down' : 'up')
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
