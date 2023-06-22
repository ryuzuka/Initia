/** Initia.js ********************************************************************************************************** */
window.Initia = (function (_gsap) {
  let $swiper = document.querySelector('.swiper')
  let $topVideo = document.querySelector('#video01')


  let slideLength = 3
  let slideIndex = -1
  let slideY = []
  let scrollDir = 'down'
  let isSlide = false



  function slideSection (scrollDir) {
    if (isSlide) return

    isSlide = true
    if (scrollDir === 'down') {
      slideIndex++
      if (slideIndex > slideLength -1) {
        slideIndex = slideLength - 1
      }
    } else if (scrollDir === 'up') {
      slideIndex--
      if (slideIndex < 0) {
        slideIndex = 0
      }
    }
    activeSection(slideIndex)
  }

  function activeSection (index) {
    let $section = $swiper.querySelectorAll('.swiper-slide')
    $section.forEach((el, idx) => {
      if (index === idx) {
        el.querySelectorAll('.motion').forEach((el, idx) => {
          el.classList.add('active')
        })
      }
    })
  }

  return {
    init () {
      // window.blockScroll()
      $topVideo.play()

      this.setSlideY()
      this.setWheel()

      slideSection(scrollDir)
    },
    setSlideY () {
      Array.from($swiper.getElementsByClassName('swiper-slide')).forEach(el => {
      })
    },
    setWheel () {
      window.addEventListener('wheel', wheel, {
        passive: false,
      });

      function wheel(e) {
        let delta = e.deltaY;

        if (!isSlide && Math.abs(delta) > 10) {
          let _delta = e.deltaY;

          if (_delta > 0) {
            scrollDir = 'down';
          } else {
            scrollDir = 'up';
          }
          slideSection(scrollDir)
        }
      }
    },
  }
}(window.gsap))
/** ***************************************************************************************************************** */
