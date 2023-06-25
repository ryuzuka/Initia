/** Initia.js ********************************************************************************************************** */
window.Initia = (function (_gsap) {
  let $swiper = document.querySelector('.swiper')
  let $scrollSection = document.querySelector('.section04')
  let $topVideo = document.querySelector('#video01')
  let $videoBox = document.querySelectorAll('section .video-box')

  let sectionY = []
  let slideIndex = 0
  let slideLength = $swiper.getElementsByTagName('section').length
  let isSlide = true

  function slideSection (scrollDir) {
    isSlide = true
    if (scrollDir === 'down') {
      slideIndex++
      if (slideIndex > slideLength) {
        slideIndex = slideLength
        isSlide = false
      } else if (slideIndex > slideLength - 1) {
        _gsap.to($topVideo, 0.5, {opacity: 0, ease: Expo.easeOut})

      }

    } else if (scrollDir === 'up') {
      slideIndex--
      if (slideIndex < 0) {
        slideIndex = 0
        isSlide = false
      } else if (slideIndex < slideLength) {
        _gsap.to($topVideo, 0.5, {opacity: 1, ease: Cubic.easeInOut})
      }
    }

    console.log(slideIndex, sectionY[slideIndex])
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
    let $section = $swiper.querySelectorAll('section')
    $section.forEach((el, idx) => {
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

  let isSection = [false, false, false, false, false, false, false]

  function onScroll (e) {
    let st = Math.floor(e.currentTarget.scrollY)
    if (st < $scrollSection.offsetTop) {
      document.body.blockScroll('block')
      document.body.bodySwipe('on')
      window.removeEventListener('scroll', onScroll)
      window.addEventListener('wheel', onWheel)
      slideIndex = 3
      slideSection('up')
    } else {
      if (sectionY[3] <= st && st <= sectionY[4]) {
        if (!isSection[3]) {
          slideIndex = 3
          isSection = [false, false, false, true, false, false, false]
          // $videoBox.forEach((el, idx) => {
          //   console.log(slideIndex, idx, slideIndex -3)
          //   if (idx === slideIndex - 3) {
          //     _gsap.to(el, 0.3, {opacity: 1})
          //   } else {
          //     _gsap.to(el, 0.3, {opacity: 0})
          //   }
          // })
          console.log('slideIndex: ', slideIndex, isSection)
        }
      } else if (sectionY[4] <= st && st <= sectionY[5]) {
        if (!isSection[4]) {
          slideIndex = 4
          isSection = [false, false, false, false, true, false, false]
          // $videoBox.forEach((el, idx) => {
          //   console.log(slideIndex, idx, slideIndex -3)
          //   if (idx === slideIndex - 3) {
          //     _gsap.to(el, 0.3, {opacity: 1})
          //   } else {
          //     _gsap.to(el, 0.3, {opacity: 0})
          //   }
          // })
          console.log('slideIndex: ', slideIndex, isSection)
        }
      } else if (sectionY[5] <= st && st <= sectionY[6]) {
        if (!isSection[5]) {
          slideIndex = 5
          isSection = [false, false, false, false, false, true, false]
          // $videoBox.forEach((el, idx) => {
          //   console.log(slideIndex, idx, slideIndex -3)
          //   if (idx === slideIndex - 3) {
          //     _gsap.to(el, 0.3, {opacity: 1})
          //   } else {
          //     _gsap.to(el, 0.3, {opacity: 0})
          //   }
          // })
          console.log('slideIndex: ', slideIndex, isSection)
        }
      } else if (sectionY[6] <= st && st <= sectionY[7]) {
        if (!isSection[6]) {
          slideIndex = 6
          isSection = [false, false, false, false, false, false, true]
          // $videoBox.forEach((el, idx) => {
          //   console.log(slideIndex, idx, slideIndex -3)
          //   if (idx === slideIndex - 3 || idx === 4) {
          //     _gsap.to(el, 0.3, {opacity: 1})
          //   } else {
          //     _gsap.to(el, 0.3, {opacity: 0})
          //   }
          // })
          console.log('slideIndex: ', slideIndex, isSection)
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

      AOS.init();
      $topVideo.play()
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
      $videoBox.forEach((el, idx) => {
        el.querySelector('video').play()
        el.style.opacity = 1
        // if (idx < videoLength - 1) {
        //   Object.assign(el.style, {
        //     position: 'fixed',
        //     top: (window.innerHeight - el.offsetHeight) / 2 + 'px'
        //   })
        // }
      })
    }
  }

  return _initia
}(window.gsap))
/** ***************************************************************************************************************** */
