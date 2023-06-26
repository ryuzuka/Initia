$(document).ready(function() {
    var sectionOffset = [];
    var sectionIndex = 0;
    var bodyScrollTop = 0;
    var responsiveSlick01 = null;
    var responsiveSlick02 = null;
    var $mark = $('.guide-mark img');
    var $markSrc = $mark.attr('src');

    $('.slick01').slick({
        dots: true,
        arrows: false,
        fade: true
    });

    $('.slick03').slick({
        dots: false,
        arrows: false,
        fade: true,
        //autoplay: true,
        autoplaySpeed: 3000,
		responsive: [
			{
				breakpoint: 769,
				settings: {
					dots: true
				}
			}
		]
    });

    // gnb
    $('.btn-gnb').on('click', function(){
        $(this).toggleClass('on');

        if ($(this).hasClass('on')) {
            bodyScrollTop = $(window).scrollTop();
            $('body').toggleClass('scroll-lock');
            $('body').css({top: -bodyScrollTop + "px"});
            $('.gnb-list, .gnb-bg').addClass('on');
            $mark.attr('src', $markSrc.replace('-b', '-w'));
        } else {
            $('body').removeClass('scroll-lock');
            $('body').removeAttr('style');
            $(window).scrollTop(bodyScrollTop);
            $('.gnb-list, .gnb-bg').removeClass('on');
        }
    });

    $('.gnb-bg').on('click', function() {
        $('.btn-gnb, .gnb-list, .gnb-bg').removeClass('on');
        $('body').removeClass('scroll-lock');
        $('body').removeAttr('style');
        $(window).scrollTop(bodyScrollTop);
    });

    $('.menu-list li').on('click', 'a', function(e) {
        e.preventDefault();
        var index = $(this).parent().index();

        if ($(window).width() < 769) {
            $('.btn-gnb, .gnb-list, .gnb-bg').removeClass('on');
            $('body').removeClass('scroll-lock');
            $('body').removeAttr('style');
            $(window).scrollTop(bodyScrollTop);

            var headerH = $('.btn-gnb').height() - 20;

            setTimeout(function() {
                $('html, body').stop().animate({'scrollTop': sectionOffset[index] - headerH}, 500);
            }, 150);
        } else {
            $('html, body').stop().animate({'scrollTop': sectionOffset[index]}, 500);
        }
    });

    $('.business-menu li').on('click', 'a', function(e) {
        e.preventDefault();
        var index = $(this).parent().index();
        $('.slick03').slick('slickGoTo', index);

        $(this).parent().siblings().removeClass('on');
        $(this).parent().addClass('on');
    });

    $('.slick03').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        $('.business-menu li').each(function(index, item) {
            if (nextSlide === index) {
                $(this).addClass('on');
            } else {
                $(this).removeClass('on');
            }
        });
    });

    $('#wrap').on('click', '.btn-top', function(e) {
        e.preventDefault();
        $('html, body').stop().animate({'scrollTop': 0}, 600);
    });

	$('#wrap').on('click', '.btn-inquiry', function(e) {
        e.preventDefault();
        if (!$('.layer-popup-wrap').hasClass('on')) {
            $('.layer-popup-wrap').show();
            setTimeout(function() {
                $('.layer-popup-wrap').addClass('on');
            }, 100);

            bodyScrollTop = $(window).scrollTop();
            $('body').addClass('scroll-lock');
            $('body').css({top: -bodyScrollTop + "px"});
        }
    });

    $('.layer-popup-wrap').on('click', '.btn-close', function(e) {
        e.preventDefault();
        $('.layer-popup-wrap').stop().animate({opacity: 0}, 350, function() {
            $(this).removeAttr('style');
            $(this).removeClass('on');
            $(this).hide();
            
            $('body').removeClass('scroll-lock');
            $('body').removeAttr('style');
            $(window).scrollTop(bodyScrollTop);
        });
    });

    $(window).on('resize', function() {
        if($(window).width() < 769) {
            if (responsiveSlick01 === null) {
                responsiveSlick01 = $('.slick02').slick({
                    dots: true,
                    arrows: false,
                    fade: true
                });
            }

            if (responsiveSlick02 === null) {
                responsiveSlick02 = $('.slick04').slick({
                    dots: false,
                    arrows: false,
                    fade: false,
                    centerMode: true,
                    centerPadding: '0',
                    variableWidth: true
                });
            }
        } else {
            if (responsiveSlick01) {
                $('.slick02').slick('unslick');
                responsiveSlick01 = null;
            }
            if (responsiveSlick02) {
                $('.slick04').slick('unslick');
                responsiveSlick02 = null;
            }
        }

        setSectionOffset();
    });

    $(window).on('scroll', function(e) {
        var scrollTop = $(window).scrollTop();

        if ($('body').hasClass('scroll-lock')) {
            return;
        }

        if (scrollTop === 0) {
            $('header').removeClass('on');
            $mark.attr('src', $markSrc.replace('-b', '-w'));
        } else {
            $('header').addClass('on');
            $mark.attr('src', $markSrc.replace('-w', '-b'));
        }

        var _sectionIndex = -1;

        for (var i = 0; i < sectionOffset.length; i++) {
            if (sectionOffset[i] > scrollTop) {
                _sectionIndex = i;
                break;
            }
        }

        if (_sectionIndex < 0) {
            _sectionIndex = sectionOffset.length;
        }

        if (sectionIndex !== _sectionIndex) {
            sectionIndex = _sectionIndex;

            $('.side-menu-list li').removeClass('on');
            $('.side-menu-list li').each(function() {
                if (($(this).index()+1) === _sectionIndex) {
                    $(this).addClass('on');
                }
            });
        }

        // motion event
        var scrollTop2 = $(window).scrollTop() + 300;

        if(screen.width > 768) {
            if(sectionOffset[1] < scrollTop2) {
                $(".sec-vision .motion.vision01").addClass('on');

                setTimeout(function() {
                    $(".sec-vision .motion.vision02").addClass('on');
                }, 500);
            }
            
            if(sectionOffset[2] < scrollTop2) {
                $(".sec-member .motion").addClass('on');
            }
            
            if(sectionOffset[3] < scrollTop2) {
                $(".sec-business .motion").addClass('on');
            }
            
            if(sectionOffset[4] < scrollTop2) {
                $(".sec-primary .motion.primary01").addClass('on');
                
                setTimeout(function() {
                    $(".sec-primary .motion.primary02").addClass('on');
                }, 500);
                
                setTimeout(function() {
                    $(".sec-primary .motion.primary03").addClass('on');
                }, 1000);
            }
        }
    });

    $(window).resize();
    $(window).scroll();

    function setSectionOffset() { 
        sectionOffset = [];
        $('main section').each(function() {
            sectionOffset.push($(this).offset().top);
        });
    }
});