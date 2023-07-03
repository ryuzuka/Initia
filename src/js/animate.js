;(function (window, document, $) {
    'use strict';
    var bs = {
        get: function() {
            return _instance;
        },
        init: function(options) {
            return _instance || new Bs(options);
        },
        VERSION: '0.0.1'
    };
    
    var $window = $(window);
    var _instance;
    // var _options;

    var inViewList = [];
    var stickyList = [];

    var setList = function() {
        inViewList = [];
        stickyList = [];
        
        $('.bs-inview').each(function(i) {
            inViewList[i] = $(this);
            // console.log(1111);
        });

        $('.bs-sticky').each(function(i) {
            stickyList[i] = $(this);
        });
      
    }

    var scrollEvt = function() {
        // console.log(1111);
        var _scrollTop = $(window).scrollTop();
        for(var i = 0, length = inViewList.length; i < length; i++) {
            var $element = inViewList[i];
            // console.log($element);
            // console.log(11);
            if ($element.isInViewport(_scrollTop) && !$element.hasClass('bs-animate')) {
                $element.addClass('bs-animate');
            } else if (!$element.isInViewport(_scrollTop) && $element.hasClass('bs-animate') && $element.attr('data-bs-reset')) {
                $element.removeClass('bs-animate');
            }
        }
        
        for(var i = 0, length = stickyList.length; i < length; i++) {
            var $element = stickyList[i];
            var $area = $element.parent();
            var $areaTop = $area.offset().top;
            var $areaBot = $areaTop + $area.outerHeight();
            var viewportBottom = _scrollTop + $(window).height();

            if ($areaTop <= _scrollTop && $areaBot >= viewportBottom) { 
                var percent = (($element.position().top - parseFloat($area.css('padding-top'))) / ($area.height() * 0.9 - $element.outerHeight())).toFixed(2);

                if (percent > 1) { 
                    percent = 1;
                } else if (percent < 0) {
                    percent = 0;
                }

                $element.trigger('sticky', [percent]);
            }
        }
    }

    $.fn.isInViewport = function(viewportTop) {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();
        var viewportBottom = viewportTop + $(window).height();
        var offset = $(this).data('offset') || 0; 
        if (offset) {
            offset = (offset / 1920) * window.innerWidth;
        }
    
        return elementBottom > viewportTop && elementTop + offset < viewportBottom;
    };

    function Bs(options) {
        _instance = this;
        // _options = {};
        // _options = $.extend({}, _options, options);

        setList();

        return _instance;
    }

    Bs.prototype.refresh = function() {
        setList();
    }

    Bs.prototype.getParam = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    Bs.prototype.comma = function(value) {
        var data = value + '';
        var aryResult = data.split('');
        var startIndex = aryResult.length - 3;
        for (var i = startIndex; i > 0; i -= 3) {
            aryResult.splice(i, 0, ',');
        }

        return aryResult.join('');
    } 
    
    Bs.prototype.scrollTo = function($selector, option) {
        if (!$selector) return;
        
        var _option = $.extend({top: 0, duration: 300, skip: false}, option);

        var optionTop = _option.top;
        var optionDuration = _option.duration;
        var optionSkip = _option.skip;

        var _top = $selector.offset().top + optionTop;

        if (optionSkip) {
            $('html, body').scrollTop(_top);
        } else {
            $('html, body').stop().animate({
                'scrollTop' : _top
            }, optionDuration);
        }
    }

    $(document).ready(function() {
        setTimeout(function() {
            $window.on('scroll.bs-scroll', { passive: true }, scrollEvt);
            scrollEvt();
        }, 300);
    });

    if(typeof define === 'function' && define.amd) {
        define([], function () {
            return bs;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = bs;
    } else {
        window.bs = bs;
    }

})(window, document, jQuery);
