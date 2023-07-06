/** Initia.js ******************************************************************************************************* */
window.Initia = (_gsap => {
	const MOBILE_WIDTH = 780

	let $initia = document.querySelector('#initia-wrap')
	let $header = $initia.querySelector('header.header')
	let $section = $initia.querySelectorAll('section')
	let $motion = $initia.querySelectorAll('.motion')
	let $topVideo = null

	let tagAOS = ['h2', 'h3', 'span', 'p', 'li']
	let scrollTop = 0
	let headerHeight = $header.offsetHeight
	let sectionY = []
	let sectionIndex = 0
	let isMobile = false
	let isVideo = [false, false, false, false, false, false, false, false]

	function onResize (e) {
		isMobile = e.target.innerWidth < MOBILE_WIDTH ? true : false
		headerHeight = $header.offsetHeight
		tagAOS.forEach(tag => {
			$initia.querySelectorAll(tag).forEach(el => {
				if (el.dataset['aosOffset']) {
					el.dataset['aosOffset'] = isMobile ? 0 : el.dataset['pcOffset']
				}
			})
			AOS.refresh()
		})

		setSectionY()
		window.dispatchEvent(new Event('scroll'))
	}

	function onScroll (e) {
		scrollTop = e.currentTarget.scrollY
		let st = Math.floor(e.currentTarget.scrollY + window.innerHeight * 0.5)

		let calcPercent = (scrollTop * 100) / sectionY[1]
		let result = -1 * (calcPercent - 30)

		if (0 <= scrollTop + headerHeight && scrollTop + headerHeight < sectionY[1]) {
			$topVideo.style.position = 'fixed'
			$topVideo.style.top = isMobile ? '50%' : 13.5 + 'rem'
			_gsap.to($topVideo, 0.8, {transform: `translate3d(${result}%, ${isMobile ? '-65%' : '0%'}, 0)`, ease: Quad.easeOut})
			$topVideo.closest('section').querySelectorAll('span').forEach(el => el.classList.add('animate'))

		} else if (sectionY[1] <= scrollTop + headerHeight && scrollTop + headerHeight < sectionY[2]) {
			$topVideo.style.position = 'fixed'
			$topVideo.style.top = isMobile ? '50%' : 13.5 + 'rem'
			_gsap.to($topVideo, 0.8, {transform: `translate3d(${-(result + 100)}%, ${isMobile ? '-65%' : '0'}, 0)`, ease: Quad.easeOut})
			$topVideo.closest('section').querySelectorAll('span').forEach(el => el.classList.remove('animate'))

		} else if (sectionY[2] <= scrollTop + headerHeight && scrollTop + headerHeight < sectionY[3]) {
			$topVideo.style.position = 'absolute'
			$topVideo.style.top = isMobile ? '245%' : (sectionY[2] - 100) + 'px'
			_gsap.to($topVideo, 0.8, {transform: isMobile ? 'translate3d(25%, -65%, 0)' : 'translate3d(50%, 0, 0)', ease: Quad.easeOut})
			$topVideo.closest('section').querySelectorAll('span').forEach(el => el.classList.remove('animate'))

		} else {
			$topVideo.style.position = 'absolute'
			$topVideo.style.top = isMobile ? '245%' : (sectionY[2] - 100) + 'px'
			$topVideo.closest('section').querySelectorAll('span').forEach(el => el.classList.remove('animate'))
		}

		if (sectionY[3] <= st && st <= sectionY[4]) {
			if (!isVideo[3]) {
				sectionIndex = 3
				activeSection(sectionIndex)
			}
		} else if (sectionY[4] <= st && st <= sectionY[5]) {
			if (!isVideo[4]) {
				sectionIndex = 4
				activeSection(sectionIndex)
			}
		} else if (sectionY[5] <= st && st <= sectionY[6]) {
			if (!isVideo[5]) {
				sectionIndex = 5
				activeSection(sectionIndex)
			}
		} else if (sectionY[6] <= st && st <= sectionY[7]) {
			if (!isVideo[6]) {
				sectionIndex = 6
				activeSection(sectionIndex)
			}
		} else if (sectionY[7] <= st) {
			if (!isVideo[7]) {
				sectionIndex = 7
				activeSection(sectionIndex)
			}
		} else {
			sectionIndex = 0
		}
		activeMotion()
	}

	function activeSection (index) {
		$section.forEach(($sect, idx) => {
			let $video = $sect.querySelector('video')
			if (index === idx) {
				if ($video) {
					isVideo[idx] = true
					$video['play']()
				}
			}
		})
	}

	function activeMotion () {
		$motion.forEach(el => {
			if (!el.closest('.swiper')) {
				if (el.getBoundingClientRect) {
					let clientRect = el.getBoundingClientRect()
					let isView = document.documentElement.clientHeight > clientRect.top + clientRect.height / 3
					el.classList[isView ? 'add' : 'remove']('active')
				}
			}
		})
	}

	function setSectionY () {
		sectionY = []
		$initia.querySelectorAll('section').forEach(el => {
			sectionY.push(el.offsetTop)
		})
	}

	return {
		init () {
			tagAOS.forEach(tag => {
				$initia.querySelectorAll(tag).forEach(el => {
					if (el.dataset['aosOffset']) {
						el.dataset['pcOffset'] = el.dataset['aosOffset']
					}
				})
			})

			AOS.init()
			setSectionY()
			this.setVideo()
			this.setEvent()
		},
		setEvent () {
			window.addEventListener('scroll', onScroll)
			window.addEventListener('resize', onResize)

			setTimeout(() => {
				window.dispatchEvent(new Event('resize'))
				window.dispatchEvent(new Event('scroll'))
			}, 100)
		},
		setVideo () {
			$initia.querySelectorAll('section').forEach((el, index) => {
				if (index === 0) {
					$topVideo = el.querySelector('.video-box')
				} else {
					let $video = el.querySelector('video')
					if ($video) {
						let $videoBox = $video.closest('.video-box')
						let $txtBox = el.querySelector('.txt-box')
						$videoBox.style.top = parseInt(($txtBox.offsetHeight - $videoBox.offsetHeight) / 2 + headerHeight / 2) + 'px'
						$video.addEventListener('ended', e => {
							e.target.pause()
							e.target.currentTime = 6
							e.target.play()
						})
					}
				}
			})
		}
	}
})(window.gsap)
/** ***************************************************************************************************************** */
