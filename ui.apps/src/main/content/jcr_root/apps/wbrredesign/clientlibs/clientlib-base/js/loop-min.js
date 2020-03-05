$(".open-share").click(function(i) {
    $(this).hide();
    $($(this).toggleClass("showing-share")).siblings().toggle()
});


/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.6.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var Slick = window.Slick || {};

    Slick = (function() {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this, dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function(slider, i) {
                    return $('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1);
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                useTransform: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.focussed = false;
            _.interrupted = false;
            _.hidden = 'hidden';
            _.paused = true;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


            _.registerBreakpoints();
            _.init(true);

        }

        return Slick;

    }());

    Slick.prototype.activateADA = function() {
        var _ = this;

        _.$slideTrack.find('.slick-active').attr({
            'aria-hidden': 'false'
        }).find('a, input, button, select').attr({
            'tabindex': '0'
        });

    };

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || (index >= _.slideCount)) {
            return false;
        }

        _.unload();

        if (typeof(index) === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function(index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.animateHeight = function() {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    Slick.prototype.animateSlide = function(targetLeft, callback) {

        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }

        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -(_.currentLeft);
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function(now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' +
                                now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' +
                                now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function() {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }

            }

        }

    };

    Slick.prototype.getNavTarget = function() {

        var _ = this,
            asNavFor = _.options.asNavFor;

        if ( asNavFor && asNavFor !== null ) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        return asNavFor;

    };

    Slick.prototype.asNavFor = function(index) {

        var _ = this,
            asNavFor = _.getNavTarget();

        if ( asNavFor !== null && typeof asNavFor === 'object' ) {
            asNavFor.each(function() {
                var target = $(this).slick('getSlick');
                if(!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }

    };

    Slick.prototype.applyTransition = function(slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.autoPlay = function() {

        var _ = this;

        _.autoPlayClear();

        if ( _.slideCount > _.options.slidesToShow ) {
            _.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );
        }

    };

    Slick.prototype.autoPlayClear = function() {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

    Slick.prototype.autoPlayIterator = function() {

        var _ = this,
            slideTo = _.currentSlide + _.options.slidesToScroll;

        if ( !_.paused && !_.interrupted && !_.focussed ) {

            if ( _.options.infinite === false ) {

                if ( _.direction === 1 && ( _.currentSlide + 1 ) === ( _.slideCount - 1 )) {
                    _.direction = 0;
                }

                else if ( _.direction === 0 ) {

                    slideTo = _.currentSlide - _.options.slidesToScroll;

                    if ( _.currentSlide - 1 === 0 ) {
                        _.direction = 1;
                    }

                }

            }

            _.slideHandler( slideTo );

        }

    };

    Slick.prototype.buildArrows = function() {

        var _ = this;

        if (_.options.arrows === true ) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if( _.slideCount > _.options.slidesToShow ) {

                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow
                        .addClass('slick-disabled')
                        .attr('aria-disabled', 'true');
                }

            } else {

                _.$prevArrow.add( _.$nextArrow )

                    .addClass('slick-hidden')
                    .attr({
                        'aria-disabled': 'true',
                        'tabindex': '-1'
                    });

            }

        }

    };

    Slick.prototype.buildDots = function() {

        var _ = this,
            i, dot;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$slider.addClass('slick-dotted');

            dot = $('<ul />').addClass(_.options.dotsClass);

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
            }

            _.$dots = dot.appendTo(_.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active').attr('aria-hidden', 'false');

        }

    };

    Slick.prototype.buildOut = function() {

        var _ = this;

        _.$slides =
            _.$slider
                .children( _.options.slide + ':not(.slick-cloned)')
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function(index, element) {
            $(element)
                .attr('data-slick-index', index)
                .data('originalStyling', $(element).attr('style') || '');
        });

        _.$slider.addClass('slick-slider');

        _.$slideTrack = (_.slideCount === 0) ?
            $('<div class="slick-track"/>').appendTo(_.$slider) :
            _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap(
            '<div aria-live="polite" class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();


        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }

    };

    Slick.prototype.buildRows = function() {

        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if(_.options.rows > 1) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(
                originalSlides.length / slidesPerSection
            );

            for(a = 0; a < numOfSlides; a++){
                var slide = document.createElement('div');
                for(b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for(c = 0; c < _.options.slidesPerRow; c++) {
                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.empty().append(newSlides);
            _.$slider.children().children().children()
                .css({
                    'width':(100 / _.options.slidesPerRow) + '%',
                    'display': 'inline-block'
                });

        }

    };

    Slick.prototype.checkResponsive = function(initial, forceUpdate) {

        var _ = this,
            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if ( _.options.responsive &&
            _.options.responsive.length &&
            _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint =
                            targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings,
                                _.breakpointSettings[
                                    targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings,
                            _.breakpointSettings[
                                targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if( !initial && triggerBreakpoint !== false ) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }

    };

    Slick.prototype.changeSlide = function(event, dontAnimate) {

        var _ = this,
            $target = $(event.currentTarget),
            indexOffset, slideOffset, unevenOffset;

        // If target is a link, prevent default action.
        if($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if(!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 :
                    event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }

    };

    Slick.prototype.checkNavigable = function(index) {

        var _ = this,
            navigables, prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function() {

        var _ = this;

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots)
                .off('click.slick', _.changeSlide)
                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

        _.$slider.off('focus.slick blur.slick');

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.cleanUpSlideEvents();

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);

    };

    Slick.prototype.cleanUpSlideEvents = function() {

        var _ = this;

        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));

    };

    Slick.prototype.cleanUpRows = function() {

        var _ = this, originalSlides;

        if(_.options.rows > 1) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.empty().append(originalSlides);
        }

    };

    Slick.prototype.clickHandler = function(event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }

    };

    Slick.prototype.destroy = function(refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }

        if ( _.$prevArrow && _.$prevArrow.length ) {

            _.$prevArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.prevArrow )) {
                _.$prevArrow.remove();
            }
        }

        if ( _.$nextArrow && _.$nextArrow.length ) {

            _.$nextArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.nextArrow )) {
                _.$nextArrow.remove();
            }
        }


        if (_.$slides) {

            _.$slides
                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
                .removeAttr('aria-hidden')
                .removeAttr('data-slick-index')
                .each(function(){
                    $(this).attr('style', $(this).data('originalStyling'));
                });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$slider.removeClass('slick-dotted');

        _.unslicked = true;

        if(!refresh) {
            _.$slider.trigger('destroy', [_]);
        }

    };

    Slick.prototype.disableTransition = function(slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.fadeSlide = function(slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function() {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }

        }

    };

    Slick.prototype.fadeSlideOut = function(slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });

        }

    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {

        var _ = this;

        if (filter !== null) {

            _.$slidesCache = _.$slides;

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.focusHandler = function() {

        var _ = this;

        _.$slider
            .off('focus.slick blur.slick')
            .on('focus.slick blur.slick',
                '*:not(.slick-arrow)', function(event) {

            event.stopImmediatePropagation();
            var $sf = $(this);

            setTimeout(function() {

                if( _.options.pauseOnFocus ) {
                    _.focussed = $sf.is(':focus');
                    _.autoPlay();
                }

            }, 0);

        });
    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {

        var _ = this;
        return _.currentSlide;

    };

    Slick.prototype.getDotCount = function() {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else if(!_.options.asNavFor) {
            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
        }else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;

    };

    Slick.prototype.getLeft = function(slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
                verticalOffset = (verticalHeight * _.options.slidesToShow) * -1;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
                    } else {
                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
            _.slideOffset = ((_.slideWidth * Math.floor(_.options.slidesToShow)) / 2) - ((_.slideWidth * _.slideCount) / 2);
        } else if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
        } else {
            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            if (_.options.rtl === true) {
                if (targetSlide[0]) {
                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                } else {
                    targetLeft =  0;
                }
            } else {
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
            }

            if (_.options.centerMode === true) {
                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }

                if (_.options.rtl === true) {
                    if (targetSlide[0]) {
                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                    } else {
                        targetLeft =  0;
                    }
                } else {
                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                }

                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;

    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {

        var _ = this;

        return _.options[option];

    };

    Slick.prototype.getNavigableIndexes = function() {

        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;

    };

    Slick.prototype.getSlick = function() {

        return this;

    };

    Slick.prototype.getSlideCount = function() {

        var _ = this,
            slidesTraversed, swipedSlide, centerOffset;

        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function(index, slide) {
                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;

        } else {
            return _.options.slidesToScroll;
        }

    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);

    };

    Slick.prototype.init = function(creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
            _.checkResponsive(true);
            _.focusHandler();

        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

        if ( _.options.autoplay ) {

            _.paused = false;
            _.autoPlay();

        }

    };

    Slick.prototype.initADA = function() {
        var _ = this;
        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
            'aria-hidden': 'true',
            'tabindex': '-1'
        }).find('a, input, button, select').attr({
            'tabindex': '-1'
        });

        _.$slideTrack.attr('role', 'listbox');

        _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
            $(this).attr('role', 'option');

            //Evenly distribute aria-describedby tags through available dots.
            var describedBySlideId = _.options.centerMode ? i : Math.floor(i / _.options.slidesToShow);

            if (_.options.dots === true) {
                $(this).attr('aria-describedby', 'slick-slide' + _.instanceUid + describedBySlideId + '');
            }
        });

        if (_.$dots !== null) {
            _.$dots.attr('role', 'tablist').find('li').each(function(i) {
                $(this).attr({
                    'role': 'presentation',
                    'aria-selected': 'false',
                    'aria-controls': 'navigation' + _.instanceUid + i + '',
                    'id': 'slick-slide' + _.instanceUid + i + ''
                });
            })
                .first().attr('aria-selected', 'true').end()
                .find('button').attr('role', 'button').end()
                .closest('div').attr('role', 'toolbar');
        }
        _.activateADA();

    };

    Slick.prototype.initArrowEvents = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'previous'
               }, _.changeSlide);
            _.$nextArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'next'
               }, _.changeSlide);
        }

    };

    Slick.prototype.initDotEvents = function() {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);
        }

        if ( _.options.dots === true && _.options.pauseOnDotsHover === true ) {

            $('li', _.$dots)
                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initSlideEvents = function() {

        var _ = this;

        if ( _.options.pauseOnHover ) {

            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initializeEvents = function() {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();
        _.initSlideEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).ready(_.setPosition);

    };

    Slick.prototype.initUI = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();

        }

    };

    Slick.prototype.keyHandler = function(event) {

        var _ = this;
         //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'next' :  'previous'
                    }
                });
            } else if (event.keyCode === 39 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'previous' : 'next'
                    }
                });
            }
        }

    };

    Slick.prototype.lazyLoad = function() {

        var _ = this,
            loadRange, cloneRange, rangeStart, rangeEnd;

        function loadImages(imagesScope) {

            $('img[data-lazy]', imagesScope).each(function() {

                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageSrcSet = $(this).attr('data-srcset'),
                    imageSizes  = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function() {

                    image
                        .animate({ opacity: 0 }, 100, function() {

                            if (imageSrcSet) {
                                image
                                    .attr('srcset', imageSrcSet );

                                if (imageSizes) {
                                    image
                                        .attr('sizes', imageSizes );
                                }
                            }

                            image
                                .attr('src', imageSource)
                                .animate({ opacity: 1 }, 200, function() {
                                    image
                                        .removeAttr('data-lazy data-srcset data-sizes')
                                        .removeClass('slick-loading');
                                });
                            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                        });

                };

                imageToLoad.onerror = function() {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                };

                imageToLoad.src = imageSource;

            });

        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

        if (_.options.lazyLoad === 'anticipated') {
            var prevSlide = rangeStart - 1,
                nextSlide = rangeEnd,
                $slides = _.$slider.find('.slick-slide');

            for (var i = 0; i < _.options.slidesToScroll; i++) {
                if (prevSlide < 0) prevSlide = _.slideCount - 1;
                loadRange = loadRange.add($slides.eq(prevSlide));
                loadRange = loadRange.add($slides.eq(nextSlide));
                prevSlide--;
                nextSlide++;
            }
        }

        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else
        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }

    };

    Slick.prototype.loadSlider = function() {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }

    };

    Slick.prototype.next = Slick.prototype.slickNext = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });

    };

    Slick.prototype.orientationChange = function() {

        var _ = this;

        _.checkResponsive();
        _.setPosition();

    };

    Slick.prototype.pause = Slick.prototype.slickPause = function() {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;

    };

    Slick.prototype.play = Slick.prototype.slickPlay = function() {

        var _ = this;

        _.autoPlay();
        _.options.autoplay = true;
        _.paused = false;
        _.focussed = false;
        _.interrupted = false;

    };

    Slick.prototype.postSlide = function(index) {

        var _ = this;

        if( !_.unslicked ) {

            _.$slider.trigger('afterChange', [_, index]);

            _.animating = false;

            _.setPosition();

            _.swipeLeft = null;

            if ( _.options.autoplay ) {
                _.autoPlay();
            }

            if (_.options.accessibility === true) {
                _.initADA();
            }

        }

    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });

    };

    Slick.prototype.preventDefault = function(event) {

        event.preventDefault();

    };

    Slick.prototype.progressiveLazyLoad = function( tryCount ) {

        tryCount = tryCount || 1;

        var _ = this,
            $imgsToLoad = $( 'img[data-lazy]', _.$slider ),
            image,
            imageSource,
            imageSrcSet,
            imageSizes,
            imageToLoad;

        if ( $imgsToLoad.length ) {

            image = $imgsToLoad.first();
            imageSource = image.attr('data-lazy');
            imageSrcSet = image.attr('data-srcset');
            imageSizes  = image.attr('data-sizes') || _.$slider.attr('data-sizes');
            imageToLoad = document.createElement('img');

            imageToLoad.onload = function() {

                if (imageSrcSet) {
                    image
                        .attr('srcset', imageSrcSet );

                    if (imageSizes) {
                        image
                            .attr('sizes', imageSizes );
                    }
                }

                image
                    .attr( 'src', imageSource )
                    .removeAttr('data-lazy data-srcset data-sizes')
                    .removeClass('slick-loading');

                if ( _.options.adaptiveHeight === true ) {
                    _.setPosition();
                }

                _.$slider.trigger('lazyLoaded', [ _, image, imageSource ]);
                _.progressiveLazyLoad();

            };

            imageToLoad.onerror = function() {

                if ( tryCount < 3 ) {

                    /**
                     * try to load the image 3 times,
                     * leave a slight delay so we don't get
                     * servers blocking the request.
                     */
                    setTimeout( function() {
                        _.progressiveLazyLoad( tryCount + 1 );
                    }, 500 );

                } else {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                    _.progressiveLazyLoad();

                }

            };

            imageToLoad.src = imageSource;

        } else {

            _.$slider.trigger('allImagesLoaded', [ _ ]);

        }

    };

    Slick.prototype.refresh = function( initializing ) {

        var _ = this, currentSlide, lastVisibleIndex;

        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if ( _.slideCount <= _.options.slidesToShow ) {
            _.currentSlide = 0;

        }

        currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, { currentSlide: currentSlide });

        _.init();

        if( !initializing ) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);

        }

    };

    Slick.prototype.registerBreakpoints = function() {

        var _ = this, breakpoint, currentBreakpoint, l,
            responsiveSettings = _.options.responsive || null;

        if ( $.type(responsiveSettings) === 'array' && responsiveSettings.length ) {

            _.respondTo = _.options.respondTo || 'window';

            for ( breakpoint in responsiveSettings ) {

                l = _.breakpoints.length-1;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {
                    currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while( l >= 0 ) {
                        if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
                            _.breakpoints.splice(l,1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

                }

            }

            _.breakpoints.sort(function(a, b) {
                return ( _.options.mobileFirst ) ? a-b : b-a;
            });

        }

    };

    Slick.prototype.reinit = function() {

        var _ = this;

        _.$slides =
            _.$slideTrack
                .children(_.options.slide)
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        _.cleanUpSlideEvents();
        _.initSlideEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        _.setPosition();
        _.focusHandler();

        _.paused = !_.options.autoplay;
        _.autoPlay();

        _.$slider.trigger('reInit', [_]);

    };

    Slick.prototype.resize = function() {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function() {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if( !_.unslicked ) { _.setPosition(); }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.setCSS = function(position) {

        var _ = this,
            positionProps = {},
            x, y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }

    };

    Slick.prototype.setDimensions = function() {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: (_.options.centerPadding + ' 0px')
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();


        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

    };

    Slick.prototype.setFade = function() {

        var _ = this,
            targetLeft;

        _.$slides.each(function(index, element) {
            targetLeft = (_.slideWidth * index) * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });

    };

    Slick.prototype.setHeight = function() {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }

    };

    Slick.prototype.setOption =
    Slick.prototype.slickSetOption = function() {

        /**
         * accepts arguments in format of:
         *
         *  - for changing a single option's value:
         *     .slick("setOption", option, value, refresh )
         *
         *  - for changing a set of responsive options:
         *     .slick("setOption", 'responsive', [{}, ...], refresh )
         *
         *  - for updating multiple values at once (not responsive)
         *     .slick("setOption", { 'option': value, ... }, refresh )
         */

        var _ = this, l, item, option, value, refresh = false, type;

        if( $.type( arguments[0] ) === 'object' ) {

            option =  arguments[0];
            refresh = arguments[1];
            type = 'multiple';

        } else if ( $.type( arguments[0] ) === 'string' ) {

            option =  arguments[0];
            value = arguments[1];
            refresh = arguments[2];

            if ( arguments[0] === 'responsive' && $.type( arguments[1] ) === 'array' ) {

                type = 'responsive';

            } else if ( typeof arguments[1] !== 'undefined' ) {

                type = 'single';

            }

        }

        if ( type === 'single' ) {

            _.options[option] = value;


        } else if ( type === 'multiple' ) {

            $.each( option , function( opt, val ) {

                _.options[opt] = val;

            });


        } else if ( type === 'responsive' ) {

            for ( item in value ) {

                if( $.type( _.options.responsive ) !== 'array' ) {

                    _.options.responsive = [ value[item] ];

                } else {

                    l = _.options.responsive.length-1;

                    // loop through the responsive object and splice out duplicates.
                    while( l >= 0 ) {

                        if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {

                            _.options.responsive.splice(l,1);

                        }

                        l--;

                    }

                    _.options.responsive.push( value[item] );

                }

            }

        }

        if ( refresh ) {

            _.unload();
            _.reinit();

        }

    };

    Slick.prototype.setPosition = function() {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);

    };

    Slick.prototype.setProps = function() {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined ||
            bodyStyle.MozTransition !== undefined ||
            bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if ( _.options.fade ) {
            if ( typeof _.options.zIndex === 'number' ) {
                if( _.options.zIndex < 3 ) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
    };


    Slick.prototype.setSlideClasses = function(index) {

        var _ = this,
            centerOffset, allSlides, indexOffset, remainder;

        allSlides = _.$slider
            .find('.slick-slide')
            .removeClass('slick-active slick-center slick-current')
            .attr('aria-hidden', 'true');

        _.$slides
            .eq(index)
            .addClass('slick-current');

        if (_.options.centerMode === true) {

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {

                    _.$slides
                        .slice(index - centerOffset, index + centerOffset + 1)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides
                        .slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

                if (index === 0) {

                    allSlides
                        .eq(allSlides.length - 1 - _.options.slidesToShow)
                        .addClass('slick-center');

                } else if (index === _.slideCount - 1) {

                    allSlides
                        .eq(_.options.slidesToShow)
                        .addClass('slick-center');

                }

            }

            _.$slides
                .eq(index)
                .addClass('slick-center');

        } else {

            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

                _.$slides
                    .slice(index, index + _.options.slidesToShow)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

                    allSlides
                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    allSlides
                        .slice(indexOffset, indexOffset + _.options.slidesToShow)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

            }

        }

        if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
            _.lazyLoad();
        }
    };

    Slick.prototype.setupInfinite = function() {

        var _ = this,
            i, slideIndex, infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > (_.slideCount -
                        infiniteCount); i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex - _.slideCount)
                        .prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex + _.slideCount)
                        .appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
                    $(this).attr('id', '');
                });

            }

        }

    };

    Slick.prototype.interrupt = function( toggle ) {

        var _ = this;

        if( !toggle ) {
            _.autoPlay();
        }
        _.interrupted = toggle;

    };

    Slick.prototype.selectHandler = function(event) {

        var _ = this;

        var targetElement =
            $(event.target).is('.slick-slide') ?
                $(event.target) :
                $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.setSlideClasses(index);
            _.asNavFor(index);
            return;

        }

        _.slideHandler(index);

    };

    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {

        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
            _ = this, navTarget;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if ( _.options.autoplay ) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        if ( _.options.asNavFor ) {

            navTarget = _.getNavTarget();
            navTarget = navTarget.slick('getSlick');

            if ( navTarget.slideCount <= navTarget.options.slidesToShow ) {
                navTarget.setSlideClasses(_.currentSlide);
            }

        }

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function() {
                    _.postSlide(animSlide);
                });

            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true) {
            _.animateSlide(targetLeft, function() {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }

    };

    Slick.prototype.startLoad = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();

        }

        _.$slider.addClass('slick-loading');

    };

    Slick.prototype.swipeDirection = function() {

        var xDist, yDist, r, swipeAngle, _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return (_.options.rtl === false ? 'right' : 'left');
        }
        if (_.options.verticalSwiping === true) {
            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
                return 'down';
            } else {
                return 'up';
            }
        }

        return 'vertical';

    };

    Slick.prototype.swipeEnd = function(event) {

        var _ = this,
            slideCount,
            direction;

        _.dragging = false;
        _.interrupted = false;
        _.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;

        if ( _.touchObject.curX === undefined ) {
            return false;
        }

        if ( _.touchObject.edgeHit === true ) {
            _.$slider.trigger('edge', [_, _.swipeDirection() ]);
        }

        if ( _.touchObject.swipeLength >= _.touchObject.minSwipe ) {

            direction = _.swipeDirection();

            switch ( direction ) {

                case 'left':
                case 'down':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide + _.getSlideCount() ) :
                            _.currentSlide + _.getSlideCount();

                    _.currentDirection = 0;

                    break;

                case 'right':
                case 'up':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide - _.getSlideCount() ) :
                            _.currentSlide - _.getSlideCount();

                    _.currentDirection = 1;

                    break;

                default:


            }

            if( direction != 'vertical' ) {

                _.slideHandler( slideCount );
                _.touchObject = {};
                _.$slider.trigger('swipe', [_, direction ]);

            }

        } else {

            if ( _.touchObject.startX !== _.touchObject.curX ) {

                _.slideHandler( _.currentSlide );
                _.touchObject = {};

            }

        }

    };

    Slick.prototype.swipeHandler = function(event) {

        var _ = this;

        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
            event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options
            .touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options
                .touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }

    };

    Slick.prototype.swipeMove = function(event) {

        var _ = this,
            edgeWasHit = false,
            curLeft, swipeDirection, swipeLength, positionOffset, touches;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = Math.round(Math.sqrt(
                Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));
        }

        swipeDirection = _.swipeDirection();

        if (swipeDirection === 'vertical') {
            return;
        }

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }


        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);

    };

    Slick.prototype.swipeStart = function(event) {

        var _ = this,
            touches;

        _.interrupted = true;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;

    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.unload = function() {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides
            .removeClass('slick-slide slick-active slick-visible slick-current')
            .attr('aria-hidden', 'true')
            .css('width', '');

    };

    Slick.prototype.unslick = function(fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();

    };

    Slick.prototype.updateArrows = function() {

        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if ( _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow &&
            !_.options.infinite ) {

            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            }

        }

    };

    Slick.prototype.updateDots = function() {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots
                .find('li')
                .removeClass('slick-active')
                .attr('aria-hidden', 'true');

            _.$dots
                .find('li')
                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
                .addClass('slick-active')
                .attr('aria-hidden', 'false');

        }

    };

    Slick.prototype.visibility = function() {

        var _ = this;

        if ( _.options.autoplay ) {

            if ( document[_.hidden] ) {

                _.interrupted = true;

            } else {

                _.interrupted = false;

            }

        }

    };

    $.fn.slick = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new Slick(_[i], opt);
            else
                ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));


  // Begin 5 slide card 
 $(document).on('ready', function() {
      $('._loop_slide_5').slick({
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        adaptiveHeight: false,
        dots: false,
        responsive: [
          {
            breakpoint: 568,
            settings: {
              slidesToShow: 2,
              adaptiveHeight: true
            }
          },
          {
            breakpoint: 400,
            settings: {
              slidesToShow: 2,
              adaptiveHeight: true
            }
          }
        ]
      });
      });
 // end 5 slide card 
 // Begin 4 slide card 
 $(document).on('ready', function() {
      $('._loop_slide_4').slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        adaptiveHeight: false,
        dots: false,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              adaptiveHeight: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              adaptiveHeight: true
            }
          }
        ]
      });
      });
 // end 4 slide card 

  // Begin 3 slide card 
 $(document).on('ready', function() {
      $('._loop_slide_3').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        adaptiveHeight: false,
        dots: false,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              adaptiveHeight: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              adaptiveHeight: true
            }
          }
        ]
      });
      });
 // end 3 slide card 
   // Begin 2 slide card 
 $(document).on('ready', function() {
      $('._loop_slide_2').slick({
        infinite: false,
        slidesToShow: 2,
        slidesToScroll: 1,
        adaptiveHeight: false,
        dots: false,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              adaptiveHeight: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              adaptiveHeight: true
            }
          }
        ]
      });
      });
 // end 2 slide card 
  $(document).on('ready', function() {
      $('._loop_slide_1').slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        dots: false,
      });
      });

 // end 1 slide card 
 $(document).on('ready', function() {
      $('.photo-card-carousel').slick({
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        adaptiveHeight: false,
        dots: false,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 4
            }
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 3,
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 3,
              adaptiveHeight: true
            }
          },
          {
            breakpoint: 500,
            settings: {
              slidesToShow: 2,
              adaptiveHeight: true
            }
          }
        ]
      });
      });
 //   


$('.annual_slide_6').slick({
    infinite: false,
     slidesToShow: 5,
    slidesToScroll: 1,
    dots: false,
    adaptiveHeight: false,
    responsive: [
        {
            breakpoint: 9999,
            settings: "unslick"
        },
        {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    adaptiveHeight: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    adaptiveHeight: true
                }
            }
    ]
    });
$('.annual_tab').slick({
    infinite: false,
     slidesToShow: 5,
    slidesToScroll: 1,
    dots: false,
    adaptiveHeight: false,
    autoSlidesToShow: true,
    responsive: [
        {
            breakpoint: 9999,
            settings: "unslick"
        },
       
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    adaptiveHeight: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    adaptiveHeight: true
                }
            },
            {
                breakpoint: 420,
                settings: {
                    slidesToShow: 1,
                    adaptiveHeight: true
                }
            }
    ]
    });

function stackBoxBlurImage(a,t,e,r,n){var o=document.getElementById(a),g=o.naturalWidth,l=o.naturalHeight,c=document.getElementById(t);c.style.width=g+"px",c.style.height=l+"px",c.width=g,c.height=l;var s=c.getContext("2d");s.clearRect(0,0,g,l),s.drawImage(o,0,0),isNaN(e)||1>e||(r?stackBoxBlurCanvasRGBA(t,0,0,g,l,e,n):stackBoxBlurCanvasRGB(t,0,0,g,l,e,n))}function stackBoxBlurCanvasRGBA(a,t,e,r,n,o,g){if(!(isNaN(o)||1>o)){o|=0,isNaN(g)&&(g=1),g|=0,g>3&&(g=3),1>g&&(g=1);var l,c=document.getElementById(a),s=c.getContext("2d");try{try{l=s.getImageData(t,e,r,n)}catch(i){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"),l=s.getImageData(t,e,r,n)}catch(i){throw alert("Cannot access local image"),new Error("unable to access local image data: "+i)}}}catch(i){throw alert("Cannot access image"),new Error("unable to access image data: "+i)}var u,b,f,x,h,m,B,d,v,w,y,I,k,N,C,E=l.data,R=o+o+1,p=r-1,D=n-1,_=o+1,S=new BlurStack,G=S;for(f=1;R>f;f++)if(G=G.next=new BlurStack,f==_);G.next=S;for(var P=null,A=mul_table[o],M=shg_table[o];g-->0;){for(B=m=0,b=n;--b>-1;){for(d=_*(I=E[m]),v=_*(k=E[m+1]),w=_*(N=E[m+2]),y=_*(C=E[m+3]),G=S,f=_;--f>-1;)G.r=I,G.g=k,G.b=N,G.a=C,G=G.next;for(f=1;_>f;f++)x=m+((f>p?p:f)<<2),d+=G.r=E[x],v+=G.g=E[x+1],w+=G.b=E[x+2],y+=G.a=E[x+3],G=G.next;for(P=S,u=0;r>u;u++)E[m++]=d*A>>>M,E[m++]=v*A>>>M,E[m++]=w*A>>>M,E[m++]=y*A>>>M,x=B+((x=u+o+1)<p?x:p)<<2,d-=P.r-(P.r=E[x]),v-=P.g-(P.g=E[x+1]),w-=P.b-(P.b=E[x+2]),y-=P.a-(P.a=E[x+3]),P=P.next;B+=r}for(u=0;r>u;u++){for(m=u<<2,d=_*(I=E[m]),v=_*(k=E[m+1]),w=_*(N=E[m+2]),y=_*(C=E[m+3]),G=S,f=0;_>f;f++)G.r=I,G.g=k,G.b=N,G.a=C,G=G.next;for(h=r,f=1;o>=f;f++)m=h+u<<2,d+=G.r=E[m],v+=G.g=E[m+1],w+=G.b=E[m+2],y+=G.a=E[m+3],G=G.next,D>f&&(h+=r);for(m=u,P=S,b=0;n>b;b++)x=m<<2,E[x+3]=C=y*A>>>M,C>0?(C=255/C,E[x]=(d*A>>>M)*C,E[x+1]=(v*A>>>M)*C,E[x+2]=(w*A>>>M)*C):E[x]=E[x+1]=E[x+2]=0,x=u+((x=b+_)<D?x:D)*r<<2,d-=P.r-(P.r=E[x]),v-=P.g-(P.g=E[x+1]),w-=P.b-(P.b=E[x+2]),y-=P.a-(P.a=E[x+3]),P=P.next,m+=r}}s.putImageData(l,t,e)}}function stackBoxBlurCanvasRGB(a,t,e,r,n,o,g){if(!(isNaN(o)||1>o)){o|=0,isNaN(g)&&(g=1),g|=0,g>3&&(g=3),1>g&&(g=1);var l,c=document.getElementById(a),s=c.getContext("2d");try{try{l=s.getImageData(t,e,r,n)}catch(i){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"),l=s.getImageData(t,e,r,n)}catch(i){throw new Error("unable to access local image data: "+i)}}}catch(i){throw new Error("unable to access image data: "+i)}var u,b,f,x,h,m,B,d,v,w,y,I,k,N=l.data,C=o+o+1,E=r-1,R=n-1,p=o+1,D=new BlurStack,_=D;for(f=1;C>f;f++)if(_=_.next=new BlurStack,f==p);_.next=D;for(var S=null,G=mul_table[o],P=shg_table[o];g-->0;){for(B=m=0,b=n;--b>-1;){for(d=p*(y=N[m]),v=p*(I=N[m+1]),w=p*(k=N[m+2]),_=D,f=p;--f>-1;)_.r=y,_.g=I,_.b=k,_=_.next;for(f=1;p>f;f++)x=m+((f>E?E:f)<<2),d+=_.r=N[x++],v+=_.g=N[x++],w+=_.b=N[x],_=_.next;for(S=D,u=0;r>u;u++)N[m++]=d*G>>>P,N[m++]=v*G>>>P,N[m++]=w*G>>>P,m++,x=B+((x=u+o+1)<E?x:E)<<2,d-=S.r-(S.r=N[x++]),v-=S.g-(S.g=N[x++]),w-=S.b-(S.b=N[x]),S=S.next;B+=r}for(u=0;r>u;u++){for(m=u<<2,d=p*(y=N[m++]),v=p*(I=N[m++]),w=p*(k=N[m]),_=D,f=0;p>f;f++)_.r=y,_.g=I,_.b=k,_=_.next;for(h=r,f=1;o>=f;f++)m=h+u<<2,d+=_.r=N[m++],v+=_.g=N[m++],w+=_.b=N[m],_=_.next,R>f&&(h+=r);for(m=u,S=D,b=0;n>b;b++)x=m<<2,N[x]=d*G>>>P,N[x+1]=v*G>>>P,N[x+2]=w*G>>>P,x=u+((x=b+p)<R?x:R)*r<<2,d-=S.r-(S.r=N[x]),v-=S.g-(S.g=N[x+1]),w-=S.b-(S.b=N[x+2]),S=S.next,m+=r}}s.putImageData(l,t,e)}}function BlurStack(){this.r=0,this.g=0,this.b=0,this.a=0,this.next=null}var mul_table=[1,171,205,293,57,373,79,137,241,27,391,357,41,19,283,265,497,469,443,421,25,191,365,349,335,161,155,149,9,278,269,261,505,245,475,231,449,437,213,415,405,395,193,377,369,361,353,345,169,331,325,319,313,307,301,37,145,285,281,69,271,267,263,259,509,501,493,243,479,118,465,459,113,446,55,435,429,423,209,413,51,403,199,393,97,3,379,375,371,367,363,359,355,351,347,43,85,337,333,165,327,323,5,317,157,311,77,305,303,75,297,294,73,289,287,71,141,279,277,275,68,135,67,133,33,262,260,129,511,507,503,499,495,491,61,121,481,477,237,235,467,232,115,457,227,451,7,445,221,439,218,433,215,427,425,211,419,417,207,411,409,203,202,401,399,396,197,49,389,387,385,383,95,189,47,187,93,185,23,183,91,181,45,179,89,177,11,175,87,173,345,343,341,339,337,21,167,83,331,329,327,163,81,323,321,319,159,79,315,313,39,155,309,307,153,305,303,151,75,299,149,37,295,147,73,291,145,289,287,143,285,71,141,281,35,279,139,69,275,137,273,17,271,135,269,267,133,265,33,263,131,261,130,259,129,257,1],shg_table=[0,9,10,11,9,12,10,11,12,9,13,13,10,9,13,13,14,14,14,14,10,13,14,14,14,13,13,13,9,14,14,14,15,14,15,14,15,15,14,15,15,15,14,15,15,15,15,15,14,15,15,15,15,15,15,12,14,15,15,13,15,15,15,15,16,16,16,15,16,14,16,16,14,16,13,16,16,16,15,16,13,16,15,16,14,9,16,16,16,16,16,16,16,16,16,13,14,16,16,15,16,16,10,16,15,16,14,16,16,14,16,16,14,16,16,14,15,16,16,16,14,15,14,15,13,16,16,15,17,17,17,17,17,17,14,15,17,17,16,16,17,16,15,17,16,17,11,17,16,17,16,17,16,17,17,16,17,17,16,17,17,16,16,17,17,17,16,14,17,17,17,17,15,16,14,16,15,16,13,16,15,16,14,16,15,16,12,16,15,16,17,17,17,17,17,13,16,15,17,17,17,16,15,17,17,17,16,15,17,17,14,16,17,17,16,17,17,16,15,17,16,14,17,16,15,17,16,17,17,16,17,15,16,17,14,17,16,15,17,16,17,13,17,16,17,17,16,17,14,17,16,17,16,17,16,17,9];

var stackBoxBlurIt=function(){function t(t,n){function r(t,i){if(clearInterval(this.timer),"undefined"==typeof i)stackBoxBlurImage(this.imgid,this.canvasid,t),this.curblur=t;else{var n=this,r=(new Date).getTime(),a=this.curblur;this.timer=setInterval(function(){var e=(new Date).getTime()-r,s=Math.min(e/i,1).toFixed(2);n.curblur=a+s*(t-a),stackBoxBlurImage(n.imgid,n.canvasid,n.curblur),s>=1&&clearInterval(n.timer)},1e3/e)}}var a=document.getElementById(t);if(!i)return a.blurit=function(){return this},a;if(a.style.display="none",this.imgid=t,"undefined"==typeof n){var s=document.createElement("canvas");s.setAttribute("id","canvas_"+t),a.parentNode.insertBefore(s,a.nextSibling)}this.canvasid="canvas_"+t,this.canvas=s,this.curblur=0,this.timer=null,r.call(this,0);var c=this;return this.canvas.blurit=function(t,e){return r.call(c,t,e),this},this.canvas}var e=30,i=!!document.createElement("canvas").getContext;return t}();

// Begin dropdown url
    /*$(document).ready(function() { 

        $('.dropdown-item li a').click(function(){
            var countryName = $(this).text();
            $(this).parent().parent().parent().find(".filter-option").html(countryName);
            var option = $(this).a('href');
            if(option !== "") {
                if(option.indexOf('worldbank.org')>-1 || option.indexOf('bancomundial.org')>-1 || 
                    option.indexOf('albankaldawli.org')>-1 || option.indexOf('banquemondiale.org')>-1 || 
                    option.indexOf('shihang.org')>-1) {
                    window.location = option;
                } else {
                    var newWindow = window.open(option,"_blank");
                    newWindow.location = option;
                }
            } 

        });

    }); */

 $( document ).ready(function() {
  $(".search-input-field").click(function(){
    $(".select-item").addClass("active-state");
   
  });
  $(".search-section").click(function(){
    $(".select-item").removeClass("active-state");
  });
 $(".dropdown-toggle").click(function(){
    $(".select-item").removeClass("active-state");
  });
 }); 
// Begin country-dropdown-search-text
// End dropdown url
$('.dropdown-checkbox').on("click", ".dropdown-menu", function (e) {
    $(this).parent().is(".open") && e.stopPropagation();
});
$(document).ready(function(){
    $('[data-toggle="popover"]').popover();   
});


 

var userAgent, ieReg, ie;
userAgent = window.navigator.userAgent;
ieReg = /msie|Trident.*rv[ :]*11\./gi;
ie = ieReg.test(userAgent);

if(ie) {
  $(".hero-img, .hero-smallimg, .large-hero-img, #hero-v4-image-1, .splash-bg-image, .splash-bg-image-v1").each(function () {
    var $container = $(this),
        imgUrl = $container.find("img").prop("src");
    if (imgUrl) {
      $container.css("backgroundImage", 'url(' + imgUrl + ')').addClass("custom-object-fit");
    }
  });
}


// Begin  highlights components
                    $(document).ready(function() {
                            $(window).resize(function() {
                                highlightsCompResize();
                            });
                        });

                        $(window).bind("load", function() {
                            highlightsCompResize();

                        });

                        function highlightsCompResize() {

                            var maxMultiCardOuterHeight = 0,
                                notMulticard = false;
                            $(".multiHighlights_card .highlights-card").each(function(idx, ele) {

                                var outerHeight = $(this).children("a").find("img").height() + $(this).children("div").height() + 30;
                                if (outerHeight > maxMultiCardOuterHeight) {
                                    maxMultiCardOuterHeight = outerHeight;
                                }
                                notMulticard = true;
                            });
                            $(".multiHighlights_card .highlights-card").height(maxMultiCardOuterHeight);

                            if ($(window).width() > 768) {
                                $(".highlight_component .highlights-card-group div div.col-lg-6 > div .highlights-card").removeAttr("style");
                                $(".highlight_component .highlights-card-group div div.col-lg-12 > div .highlights-card").removeAttr("style");
                                $(".highlight_component .highlights-card-group div div.col-lg-3 > div .highlights-card").removeAttr("style");

                                setTimeout(function() {
                                    var maxOuterHeight = 0,
                                        minBigCardHeight = 200,
                                        minSmallCardHeight = 125;
                                    $(".highlight_component .highlights-card-group div div.col-lg-6 > div .highlights-card").each(function(idx, ele) {
                                        var outerHeight = $(this).height();
                                        if (outerHeight > maxOuterHeight) {
                                            maxOuterHeight = outerHeight;
                                        }
                                    });
                                    if (maxOuterHeight > minSmallCardHeight)
                                        $(".highlight_component .highlights-card-group div div.col-lg-6 > div .highlights-card").height(maxOuterHeight);
                                    else
                                        $(".highlight_component .highlights-card-group div div.col-lg-6 > div .highlights-card").height(minSmallCardHeight);
                                    maxOuterHeight = 0;
                                    $(".highlight_component .highlights-card-group div div.col-lg-12 > div .highlights-card").each(function(idx, ele) {
                                        var outerHeight = $(this).height();
                                        if (outerHeight > maxOuterHeight) {
                                            maxOuterHeight = outerHeight;
                                        }
                                    });
                           
                                    $(".highlight_component .highlights-card-group div div.col-lg-3 > div .highlights-card").each(function(idx, ele) {
                                        var outerHeight = $(this).height();
                                        if (outerHeight > maxOuterHeight) {
                                            maxOuterHeight = outerHeight;
                                        }
                                    });
                                    //debugger;
                                    if (maxOuterHeight > minSmallCardHeight)
                                        $(".highlight_component .highlights-card-group div div.col-lg-3 > div .highlights-card").height(maxOuterHeight);
                                    else
                                        $(".highlight_component .highlights-card-group div div.col-lg-3 > div .highlights-card").height(minSmallCardHeight);
                                }, 1000);
                            } else {
                                $(".highlight_component .highlights-card-group div div.col-lg-6 > div .highlights-card").removeAttr("style");
                                $(".highlight_component .highlights-card-group div div.col-lg-12 > div .highlights-card").removeAttr("style");
                                $(".highlight_component .highlights-card-group div div.col-lg-3 > div .highlights-card").removeAttr("style");
                            }

                        }
// End  highlights components

 







$(".mega-menu-dropdown input[type=text],.mega-menu-dropdown input[type=search]").focusin(function() {
    $('head').append('<style class="dynamic-style">.showIt {display: block!important;opacity:1!important;visibility: visible!important;}</style>');
    $(this).closest(".mega-menu-dropdown").addClass("showIt");
}).focusout(function() {
    $(this).closest(".mega-menu-dropdown").removeClass("showIt");
    $(".dynamic-style").remove();
});
jQuery(document).ready(function() {
    $(".mega-menu").hover(function() {
        $(".dropdown-toggle", this).addClass("activeMegaMenu"), $(".mega-menu-dropdown", this).stop().show()
    }, function() {
        if ($("#mega-menu-global-search .mega-menu-dropdown").find(".search-input-field-1").is(":focus")) {
            return 0
        }
        $(".dropdown-toggle", this).removeClass("activeMegaMenu"), $(".mega-menu-dropdown", this).stop().hide()
    });
    $(".dropdown-menu.mega-menu-dropdown").prepend('<span class="close-this-megamenu">X</span>');
    $(document).on("click", ".close-this-megamenu", function(c) {
        $(this).closest(".mega-menu-dropdown").hide()
    })
});
// jQuery(document).ready(function() {
//     if ($(window).width() >= 991) {}
//     $(".tt-menu").find("li.tt-suggestion").removeAttr("style");
//     $(".dropdown-toggle.arrow-down.search-submit-icon").click(function(b) {
//         if (!$("#search11").val().length > 0) {
//             $(".tt-menu").find("li.tt-suggestion").removeAttr("style")
//         }
//         $(".tt-menu").toggleClass("show-tt-menu")
//     });
//     $("#search11").keyup(function() {
//         var b = $(this).val().length;
//         if (b > 0) {
//             if (!$(".tt-menu").hasClass("show-tt-menu")) {
//                 $(".tt-menu").addClass("show-tt-menu")
//             }
//         } else {
//             $(".tt-menu").removeClass("show-tt-menu")
//         }
//         return true
//     });
//     $("#search11").on("keydown keyup keypress", function(c) {
//         var b = c.keyCode || c.which;
//         if (c.keyCode == 13) {
//             c.preventDefault();
//             return false
//         }
//     })
// });
$(".mega-menu > a").on("click touchend", function() {
    var b = $(this);
    var c = b.attr("href");
    window.location = c
});

$(document).ready(function() {
    $("#search11").keyup(function() {
        var value = $(this).val();

        $(".dropdown-menu>li span .firstLevel").each(function() {
 var length = value.length;
            var substring = $(this).text().toLowerCase().substring(0, length);
            if (value == substring) {
                $(this).parent().parent().show();
            } else {
                $(this).parent().parent().hide();
            }
        });
    });
    $("#search11").on("keydown keyup keypress",function(e){
    var keyCode = e.keyCode || e.which;
    if(e.keyCode == 13) {
      e.preventDefault();
      return false;
    }
  });
});
    $(document).ready(function() {
    $("#country-search-1").keyup(function() {
        var value = $(this).val();

        $(".dropdown-menu>li span a").each(function() {
 var length = value.length;
            var substring = $(this).text().toLowerCase().substring(0, length);
            if (value == substring) {
                $(this).parent().parent().show();
            } else {
                $(this).parent().parent().hide();
            }
        });
    });
    $("#country-search-1").on("keydown keyup keypress",function(e){
    var keyCode = e.keyCode || e.which;
    if(e.keyCode == 13) {
      e.preventDefault();
      return false;
    }
  });
});



jQuery( document ).ready( function( $ ) {
  
    $( '.nav' ).on( 'mouseenter focus', '.menu-level-0 > .menu-item-link', function( e ) {
            var el = $( this );
        el.toggleClass( 'has-focus' );
            // Show sub-menu
            el.parents( '.menu-item' ).attr( 'aria-expanded', 'true' );
        }).on( 'mouseleave blur', '.menu-level-0 > .menu-item-link', function( e ) {
            var el = $( this );
        el.toggleClass( 'has-focus' );
            // Only hide sub-menu after a short delay, so links get a chance to catch focus from tabbing
            setTimeout( function() {
                if ( el.siblings( '.mega-menu-dropdown' ).attr( 'data-has-focus' ) !== 'true' ) {
                    el.parents( '.menu-item' ).attr( 'aria-expanded', 'false' );
                }
            }, 300 );
        }).on( 'mouseenter focusin', '.mega-menu-dropdown', function( e ) {
            var el = $( this );
            el.attr( 'data-has-focus', 'true' );
        }).on( 'mouseleave focusout', '.mega-menu-dropdown', function( e ) {
            var el = $( this );
            setTimeout( function() {
                // Check if anything else has picked up focus (i.e. next link in sub-menu)
                if ( el.find( ':focus' ).length === 0 ) {
                    el.attr( 'data-has-focus', 'false' );                       
                    // Hide sub-menu on the way out if parent link doesn't have focus now
            if ( el.siblings( '.menu-item-link.has-focus' ).length === 0 ) {
                        el.parents( '.menu-level-0' ).attr( 'aria-expanded', 'false' );
          }
        }
            }, 300 );
        });
});
jQuery(document).ready(function() {
if ($(window).width() >= 991) {}
    $(".tt-menu").find("li.tt-suggestion").removeAttr("style");
    $(".menu-item-link.arrow-down.search-submit-icon").click(function(b) {
        if (!$("#search11").val().length > 0) {
            $(".tt-menu").find("li.tt-suggestion").removeAttr("style")
        }
        $(".tt-menu").toggleClass("show-tt-menu")
    });
    $("#search11").keyup(function() {
        var b = $(this).val().length;
        if (b > 0) {
            if (!$(".tt-menu").hasClass("show-tt-menu")) {
                $(".tt-menu").addClass("show-tt-menu")
            }
        } else {
            $(".tt-menu").removeClass("show-tt-menu")
        }
        return true
    });
    $("#search11").on("keydown keyup keypress", function(c) {
        var b = c.keyCode || c.which;
        if (c.keyCode == 13) {
            c.preventDefault();
            return false
        }
    })
});

$("#dropdown-tab li a").click(function(e){
        $(this).closest(".open").find(".filter-option").text($(this).text());
        var cIndex = $( "#dropdown-tab li a" ).index(this);

        $(".dropdown-tabshow").each(function(){
            $(this).hide();
        });
        $(".dropdown-tabindex"+cIndex).show();
        $(".dropdown-tabindex"+cIndex).css("visibility", "visible");
        $(".dropdown-tabindex"+cIndex).css("height", "auto");
        $(".dropdown-tabindex"+cIndex).css("opacity", "1");
         $(".dropdown-tabindex"+cIndex).addClass("activediv");
    });


// $( "select#select-tab" ).change(function () {
//     var str = "";
//     debugger;
//     $( "select option:selected" ).each(function() {
//       str += $( ""this"" ).html() + " ";
//     });
//     $( "div.dropdown-tabshow" ).html( str );
//   })
//   .change();


// $("#select-tab").on('change', function () {
//         var cIndex = $( "#select-tab option" ).index(this);

//         $(".select-tabshow").each(function(){
//             $(this).hide();
//         });
//         $(".select-tabindex"+cIndex).show();
//         $(".select-tabindex"+cIndex).css("visibility", "visible");
//         $(".select-tabindex"+cIndex).css("height", "auto");
//         $(".select-tabindex"+cIndex).css("opacity", "1");
//          $(".select-tabindex"+cIndex).addClass("activediv");
//     });

$('#select-tab').change(function () {
     var selectedValue = $(this).val();
    $('#globalKeyIndicatorBarChart').html(selectedValue);

 });

var screenWidth = 600;
// Equal hight for card
if ($(window).width() > screenWidth) {
    function equalHeight(group) {
        tallest = 0;
        var mySelecter = group.selector;
        $(mySelecter).closest(".gridlayout ").each(function(index, thisGroup) {
            var selectedContainer = $(thisGroup).find(mySelecter);
            selectedContainer.each(function() {
                thisHeight = $(this).height();
                if (thisHeight > tallest) {
                    tallest = thisHeight;
                }
            });
            selectedContainer.height(tallest);
        });
    }
    $(window).load(function() {
       

        // equalHeight($(".card-v1-section .indepth-card-wrapper"));
        // equalHeight($(".card-v2-section .indepth-card-wrapper"));
        // equalHeight($(".card-v3-section .indepth-card-wrapper"));
        // equalHeight($(".card-v4-section .indepth-card-wrapper"));
        // equalHeight($(".research_auto_pull .card-v3-section .card-wrapper"));
        // equalHeight($("._loop_indepth_card_wrapper"));
        // equalHeight($(".showcase-card-wrapper"));
        equalHeight($(".card-wb-number-wrapper"));
        equalHeight($(".redesign_indepth"));
        // equalHeight($(".col-md-3.col-sm-6.col-lg-3.col-xs-6"));
        //  equalHeight($(".card-v4-inverse-wrapper"));

         
    });
}


var screenWidth = 991;
// Equal hight for card
if ($(window).width() > screenWidth) {
    function equalHeight(group) {
        tallest = 0;
        var mySelecter = group.selector;
        $(mySelecter).closest(".gridlayout ").each(function(index, thisGroup) {
            var selectedContainer = $(thisGroup).find(mySelecter);
            selectedContainer.each(function() {
                thisHeight = $(this).height();
                if (thisHeight > tallest) {
                    tallest = thisHeight;
                }
            });
            selectedContainer.height(tallest);
        });
    }
    $(window).load(function() {
        equalHeight($("._loop_card_header_main_footer"));
         
    });
}
  
function embedControl() {
    if ($(window).width() > 991) {
        if ($('.embedcode').find("iframe").length > 0)
            $('.embedcode').find(".embed-responsive-16by9").removeClass("embed-responsive");
        else {
            if (!$('.embedcode').find(".embed-responsive-16by9").hasClass("embed-responsive"))
                $('.embedcode').find(".embed-responsive-16by9").addClass("embed-responsive");
            
        }
    }
}



// social sharing toggle
    $(document).ready(function(){
    $("#plus").click(function(){
      $("#plus-drop").toggle();
    if($(this).hasClass("plus-btn")){
     $(this).removeClass("plus-btn");
     $(this).addClass("minus-btn");
    } else{
      $(this).addClass("plus-btn");
    $(this).removeClass("minus-btn");
     }
    });
});

//embed-video
    $(document).ready(function(){

    $(".embed-image").click(function(e){

        var iframe = $(this).parent().find('iframe');
        var videoObject = $(this).parent().find('.embed-video');

        if(iframe.length>=1){

            var srcVal = iframe[0].src;
            var imageObject = $(this).parent().children(':first-child');
            var playIcon = $(this).parent().find('._loop_play_icon');

            if(imageObject.length>=1){
                imageObject.hide();
               if(playIcon.length>=1){
                    playIcon.hide();
                }
                videoObject.show();
            }

            if (srcVal.indexOf("youtube") >= 0 ){

                if (srcVal.indexOf("?") >= 0){
                    iframe[0].src =iframe[0].src +'&autoplay=1';
                }else if (srcVal.indexOf("?") == -1){
                    iframe[0].src =iframe[0].src +'?autoplay=1';
                }

            }
        }

    });

});

$(document).ready(function(){

    $(".embed-image").click(function(e){

        var object = $(this).parent().find('object');
        var videoObject = $(this).parent().find('.embed-video');
        var textcontent = $(this).parent().prev();

        if(object.length>=1){

            if(textcontent.attr('class').indexOf('featuredcard')>-1){

                textcontent.hide();
                
            }

            var srcVal = object[0].data;
            var imageObject = $(this).parent().children(':first-child');
            var playIcon = $(this).parent().find('._loop_play_icon');

            if(imageObject.length>=1){
                imageObject.hide();
               if(playIcon.length>=1){
                    playIcon.hide();
                }
                videoObject.show();
            }

            if (srcVal.indexOf("kaltura") >= 0 ){

                if (srcVal.indexOf("?") >= 0){
                    object[0].data =object[0].data +'&autoplay=1';
                }else if (srcVal.indexOf("?") == -1){
                    object[0].data =object[0].data +'?autoplay=1';
                }

            }
        }
    equalHeight($("._loop_indepth_card_wrapper"));
    });

});

// begin table arrow toggle
$(".c14v1-body table th").click(function(e){
$(this).toggleClass("desc");
})
// end table arrow toggle
// begin Left Nav toggle
  function toggleclass(element,elemMore){ 
    $(element).toggle();      
    if($(element).is(":visible")){
      $(elemMore).html('<i class="fa fa-angle-up"></i>');
    }else{
      $(elemMore).html('<i class="fa fa-angle-down"></i>');
    }
  }
// end Left Nav toggle
// begin Language Toggler Begin 
    $(document).ready(function() {
        $("#lang-click").click(function() {

            $("#lang-drop").toggle();
        });
    });

    $(document).on('click', function(e) {
        if ($(e.target).closest("#lang-click").length === 0) {
            $("#lang-drop").hide();
        }
    });
        $(document).on('click', function(e) {
        if ($(e.target).closest(".lang-switch-desktop").length === 0) {
            $("#more-language").hide();
        }
    });
// end Language Toggler 

// social sharing toggle


    // social sharing toggle
    $(document).ready(function(){
    $("#download").click(function(){
      $("#download-drop").toggle();
    if($(this).hasClass("click-download")){
     $(this).removeClass("click-download");
     $(this).addClass("close-download");
    } else{
      $(this).addClass("click-download");
    $(this).removeClass("close-download");
     }
    });
});
    $("#download").on('click', function(e) {
    if ($(e.target).closest("fa-plus")) {
        $(".fa-plus").toggleClass('fa-minus');
    }
});

    $(document).ready(function(){
    $("#plus").click(function(){
      $("#plus-drop").toggle();
    if($(this).hasClass("plus-btn")){
     $(this).removeClass("plus-btn");
     $(this).addClass("minus-btn");
    } else{
      $(this).addClass("plus-btn");
    $(this).removeClass("minus-btn");
     }
    });
});
// begin More then 5 language toogle
  function toggleMore(element,elemMore){ 
    $(element).toggle();      
    if($(element).is(":visible")){
      $(elemMore).html('<i class="icon icon-angle-down"></i>');
    }else{
      $(elemMore).html('<i class="icon icon-angle-down"></i>');
    }
  }

// end More then 5 language toogle
// begin reginal-list icon toggle
    $(document).ready(function(){     

        $("div.regional-list div#accordion").each(function(){            
            $(this).find("div").find('.collapsed').on('click',function(){ 
                var cssClass =  $(this).find("i").attr('class');                
                if(cssClass.indexOf("fa-chevron-down") != -1)
                { 
                    $(this).find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");                    
                }
                else
                {                    
                    $(this).find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");                                       
                }
            });            
        });        
    });
// end reginal-list icon toggle

// begin Show More + //
  function toggleMore(element,elemMore){ 
    $(element).toggle();      
    if($(element).is(":visible")){
      $(elemMore).html('See Less -');
    }else{
      $(elemMore).html('See More +');
    }
  }
  function toggle(element,elemMore){ 
    $(element).toggle();      
  }

// end Show More + //



//begin Delete item
$(".delete-item").click(function(){

$(this).parent("li").remove();

});
//end Delete item

    $(document).ready(function() {
        $("#collpase-section").click(function() {
            $("#collpase-open").slideToggle();

        });

    });
    $("#collpase-section").on('click', function(e) {
    if ($(e.target).closest("fa-minus")) {
        $(".fa-minus").toggleClass('fa-plus');
    }
});

$(document).ready(function() {
    $('#list').click(function(event){event.preventDefault();$('#photo-list .photo-item').addClass('photo-group-item');
if ($(event).closest(".photo-list-item")) {
        $(".photo-list-item ").removeClass('photogallery-card');
    }
  });

    $('#grid').click(function(event){event.preventDefault();$('#photo-list .photo-item').removeClass('photo-group-item');
      $('#photo-list .photo-item').addClass('grid-group-item photogallery-card-item');
      if ($(event).closest(".photo-list-item")) {
        $(".photo-list-item ").addClass('photogallery-card');
    }
    });
});
$(document).ready(function(){
    $(".show-all-btn").click(function(){
        $("#economy-list").toggle();
    });
});

 // begin Sidebar - nav toggle
$("#menu-toggle-2").click(function(e) {
   e.preventDefault();
   $("#wrapper").toggleClass("toggled-2");
});
$("#menu-toggle-2").on('click', function(e) {
    if ($(e.target).closest("toggled-2")) {
        $(".col-lg-3").toggleClass('left-section');
        $(".col-lg-9").toggleClass('right-section');
    }
});
// end Sidebar - nav toggle

// begin slider id 
$(document).ready(function(){
var isFirst = true, numLi = 1;
    $("#sidebar-wrapper .sidebar-list").each(function() {  
        var list = $(this);
        list.attr("start", numLi);
        var storenumLi = numLi;
        numLi = numLi + list.find(".sidebar-list-item").length;
        
            $(this).find(".sidebar-link").attr("href", $(this).find(".sidebar-link").attr("href")+storenumLi);
            $(this).find(".collapse").attr("id",$(this).find(".collapse").attr("id")+storenumLi);
      
    });
});
// end slider id 
// begin faq-accordion id 
$(document).ready(function(){
var isFirst = true, numLi = 1;
    $(".faq-accordion ol").each(function() {  
        var list = $(this);
        list.attr("start", numLi);
        var storenumLi = numLi;
        numLi = numLi + list.find("li").length;
        $(this).find("li").each(function(){
            $(this).find("a").attr("href", $(this).find("a").attr("href")+storenumLi);
            $(this).find(".panel-collapse").attr("id",$(this).find(".panel-collapse").attr("id")+storenumLi);
        });
    });
});
// end faq-accordion id 
// begin accordion id 
$(document).ready(function(){
var isFirst = true, numdiv = 1;
   $(".accordion-wrapper").each(function() {  
       var list = $(this);
       list.attr("start", numdiv);
       var storenumdiv = numdiv;
       numdiv = numdiv + list.find(".accordion-btn").length;
       
           $(this).find(".accordion-btn").attr("href", $(this).find(".accordion-btn").attr("href")+storenumdiv);
           $(this).find(".collapse").attr("id",$(this).find(".collapse").attr("id")+storenumdiv);
     
   });
});
// end accordion id 

$(document).ready(function(){
var isFirst = true, numdiv = 1;
   $(".wbl_accordian").each(function() {  
       var list = $(this);
       list.attr("start", numdiv);
       var storenumdiv = numdiv;
       numdiv = numdiv + list.find(".panel-group").length;
       
           $(this).find(".panel-group").attr("id", $(this).find(".panel-group").attr("id")+storenumdiv);
           $(this).find(".accordion-btn").attr("data-parent",$(this).find(".accordion-btn").attr("data-parent")+storenumdiv);
   });
});

$(document).ready(function(){
var isFirst = true, numdiv = 1;
   $(".regions_menu ul li.panel").each(function() {  
       var list = $(this);
       list.attr("start", numdiv);
       var storenumdiv = numdiv;
       numdiv = numdiv + list.find(".regions_menu_list").length;
       
           $(this).find(".regions_menu_list").attr("href", $(this).find(".regions_menu_list").attr("href")+storenumdiv);
           $(this).find(".collapse").attr("id",$(this).find(".collapse").attr("id")+storenumdiv);
     
   });
});

$(document).ready(function(){
var isFirst = true, numdiv = 1;
   $(".image-gallery-tooltip").each(function() {  
       var list = $(this);
       list.attr("start", numdiv);
       var storenumdiv = numdiv;
       numdiv = numdiv + list.find(".img-tooltip").length;
       
           $(this).find(".img-tooltip").attr("id", $(this).find(".img-tooltip").attr("id")+storenumdiv);
     $(this).find("#tooltip").attr("id",$(this).find("#tooltip").attr("id")+storenumdiv);
   });
});

$('.toggle').click(function() {
  
    var $this = $(this);
  
    if ($this.prev().hasClass('show')) {
        $this.prev().removeClass('show');   
    } else {
        $this.prev().slideToggle('show');
    }
});

// $('.toggle').click(function() {
  
//     var $this = $(this);
  
//     if ($this.prev().hasClass('show')) {
//         $this.prev().removeClass('show');
//         //$this.next().slideUp(350);
//     } else {
//        // $this.parent().parent().closest('.inner').removeClass('show');
//         //$this.parent().parent().closest('.inner').slideUp(350);
//         $this.prev().slideToggle('show');
//         //$this.next().slideToggle(500);
//     }
// });


/*START: Tab click event handler*/
    $(document).on("click", "tab-nav ul li", function(e) {
        $(this).closest("tab").find("._loop_tab_active").removeClass("_loop_tab_active");
        $(this).find("a").addClass("_loop_tab_active");
        $(this).closest("tab").find("tab-content ul._loop_tab_content_list>li").eq($(this).index()).addClass("_loop_tab_active");
    });
    //     $(document).on("click", "tab-nav ul li", function(e) {
    //     $(this).closest("tab").find("._loop_subtab_active").removeClass("_loop_subtab_active");
    //     $(this).find("a").addClass("_loop_subtab_active");
    //     $(this).closest("tab").find("tab-content ul._loop_subtab_content_list>li").eq($(this).index()).addClass("_loop_subtab_active");
    // });
    /*END: Tab click event handler*/

var screenWidth = 600;
    /*START: Scrollable tabs controller*/
    if ($(window).width() > screenWidth) {
    var hidWidth;
    var scrollBarWidths = 0;

    var widthOfList = function() {
        var itemsWidth = 0;
        $('._loop_list li').each(function() {
            var itemWidth = $(this).outerWidth();
            itemsWidth += itemWidth;
        });
        return itemsWidth;
    };
    var getLeftPosi = function() {
        return $('._loop_list').position().left;
    };

    var widthOfRightHidden = function() {
        return (($('._loop_wrapper').outerWidth()) - widthOfList() - getLeftPosi()) - scrollBarWidths;
    };
    var reAdjust = function() {
        if (($('._loop_wrapper').outerWidth()) < widthOfList()) {
            $('._loop_scroller-right').show();
        } else {
            $('._loop_scroller-right').hide();
        }

        if (getLeftPosi() < 0) {
            $('._loop_scroller-left').show();
        } else {
            $('.item').animate({
                left: "-=" + getLeftPosi() + "px"
            }, 'slow');
            $('._loop_scroller-left').hide();
        }
    }

    reAdjust();

    $(window).on('resize', function(e) {
        reAdjust();
    });

    $('._loop_scroller-right').click(function() {
        
        $('._loop_scroller-left').fadeIn('slow');

        var scrollWidth = $('._loop_wrapper').outerWidth() - 100;

        if (scrollWidth >= Math.abs(widthOfRightHidden()))
            scrollWidth = Math.abs(widthOfRightHidden()) + 75;


        if (widthOfRightHidden() <= 0) {
            scrollWidth = -Math.abs(scrollWidth);
        } else {
            $('._loop_scroller-right').fadeOut('slow');
            return false;
        }
        $('._loop_list').animate({
            left: "+=" + scrollWidth + "px"
        }, 'slow', function() {});



    });

    $('._loop_scroller-left').click(function() {
        
        $('._loop_scroller-right').fadeIn('slow');
        var scrollWidth = $('._loop_wrapper').outerWidth() - 100;

        if (Math.abs($("._loop_list").position().left) >= (scrollWidth))
            scrollWidth = $("._loop_list").position().left
        else
            scrollWidth = $("._loop_list").position().left;
        if ($("._loop_list").position().left >= scrollWidth)
            $('._loop_scroller-left').fadeOut('slow');

        $('._loop_list').animate({
            left: "-=" + scrollWidth + "px"
        }, 'slow', function() {

        });
    });
}
 


// @codekit-prepend "campaign.js"
// @codekit-prepend "slick.js"
// @codekit-prepend "slick-config.js"
// @codekit-prepend "StackBoxBlur.js"
// @codekit-prepend "StackBoxBlurWrapper.js"
// @codekit-prepend "dropdown.js"
// @codekit-prepend "highlight.js"
// @codekit-prepend "megamenu.js"
// @codekit-prepend "data-swipe.js"
// @codekit-prepend "card.js"
// @codekit-prepend "embed-video.js"

// @codekit-prepend "language-toggle.js"
// @codekit-prepend "id.js"
// @codekit-prepend "tabs.js"