/*
 Template Name: Color Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3 & 4
 Version: 4.1.0
 Author: Sean Ngu
 Website: http://www.seantheme.com/color-admin-v4.1/admin/
 ----------------------------
 APPS CONTENT TABLE
 ----------------------------
 
 <!-- ======== GLOBAL SCRIPT SETTING ======== -->
 01. Handle Scrollbar
 02. Handle Sidebar - Menu
 03. Handle Sidebar - Mobile View Toggle
 04. Handle Sidebar - Minify / Expand
 05. Handle Page Load - Fade in
 09. Handle Scroll to Top Button Activation
 
 <!-- ======== Added in V1.6 ======== -->
 16. Handle IE Full Height Page Compatibility - added in V1.6
 17. Handle Unlimited Nav Tabs - added in V1.6
 
 <!-- ======== Added in V4.0 ======== -->
 23. Handle Check Bootstrap Version - added in V4.0
 24. Handle Page Scroll Class - added in V4.0
 25. Handle Toggle Navbar Profile - added in V4.0
 26. Handle Sidebar Scroll Memory - added in V4.0
 27. Handle Sidebar Minify Sub Menu - added in V4.0
 28. Handle Ajax Mode - added in V4.0
 29. Handle Float Navbar Search - added in V4.0
 
 <!-- ======== APPLICATION SETTING ======== -->
 Application Controller
 */



/* 01. Handle Scrollbar
 ------------------------------------------------ */
var handleSlimScroll = function () {
    "use strict";
    $('[data-scrollbar=true]').each(function () {
        generateSlimScroll($(this));
    });
};
var generateSlimScroll = function (element) {
    if ($(element).attr('data-init')) {
        return;
    }
    var dataHeight = $(element).attr('data-height');
    dataHeight = (!dataHeight) ? $(element).height() : dataHeight;

    var scrollBarOption = {
        height: dataHeight
    };
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $(element).css('height', dataHeight);
        $(element).css('overflow-x', 'scroll');
    } else {
        $(element).slimScroll(scrollBarOption);
    }
    $(element).attr('data-init', true);
    $('.slimScrollBar').hide();
};


/* 02. Handle Sidebar - Menu
 ------------------------------------------------ */
var handleSidebarMenu = function () {
    "use strict";

    var expandTime = ($('.sidebar').attr('data-disable-slide-animation')) ? 0 : 250;
    $('.sidebar .nav > .has-sub > a').click(function () {
        var target = $(this).next('.sub-menu');
        var otherMenu = $('.sidebar .nav > li.has-sub > .sub-menu').not(target);

        if ($('.page-sidebar-minified').length === 0) {
            $(otherMenu).closest('li').addClass('closing');
            $(otherMenu).slideUp(expandTime, function () {
                $(otherMenu).closest('li').addClass('closed').removeClass('expand closing');
            });
            if ($(target).is(':visible')) {
                $(target).closest('li').addClass('closing').removeClass('expand');
            } else {
                $(target).closest('li').addClass('expanding').removeClass('closed');
            }
            $(target).slideToggle(expandTime, function () {
                var targetLi = $(this).closest('li');
                if (!$(target).is(':visible')) {
                    $(targetLi).addClass('closed');
                    $(targetLi).removeClass('expand');
                } else {
                    $(targetLi).addClass('expand');
                    $(targetLi).removeClass('closed');
                }
                $(targetLi).removeClass('expanding closing');
            });
        }
    });
    $('.sidebar .nav > .has-sub .sub-menu li.has-sub > a').click(function () {
        if ($('.page-sidebar-minified').length === 0) {
            var target = $(this).next('.sub-menu');
            if ($(target).is(':visible')) {
                $(target).closest('li').addClass('closing').removeClass('expand');
            } else {
                $(target).closest('li').addClass('expanding').removeClass('closed');
            }
            $(target).slideToggle(expandTime, function () {
                var targetLi = $(this).closest('li');
                if (!$(target).is(':visible')) {
                    $(targetLi).addClass('closed');
                    $(targetLi).removeClass('expand');
                } else {
                    $(targetLi).addClass('expand');
                    $(targetLi).removeClass('closed');
                }
                $(targetLi).removeClass('expanding closing');
            });
        }
    });
};


/* 03. Handle Sidebar - Mobile View Toggle
 ------------------------------------------------ */
var handleMobileSidebarToggle = function () {
    var sidebarProgress = false;

    $('.sidebar').bind('click touchstart', function (e) {
        if ($(e.target).closest('.sidebar').length !== 0) {
            sidebarProgress = true;
        } else {
            sidebarProgress = false;
            e.stopPropagation();
        }
    });

    $(document).bind('click touchstart', function (e) {
        if ($(e.target).closest('.sidebar').length === 0) {
            sidebarProgress = false;
        }
        if ($(e.target).closest('#float-sub-menu').length !== 0) {
            sidebarProgress = true;
        }

        if (!e.isPropagationStopped() && sidebarProgress !== true) {
            if ($('#page-container').hasClass('page-sidebar-toggled')) {
                sidebarProgress = true;
                $('#page-container').removeClass('page-sidebar-toggled');
            }
            if ($(window).width() <= 767) {
                if ($('#page-container').hasClass('page-right-sidebar-toggled')) {
                    sidebarProgress = true;
                    $('#page-container').removeClass('page-right-sidebar-toggled');
                }
            }
        }
    });

    $('[data-click=right-sidebar-toggled]').click(function (e) {
        e.stopPropagation();
        var targetContainer = '#page-container';
        var targetClass = 'page-right-sidebar-collapsed';
        targetClass = ($(window).width() < 979) ? 'page-right-sidebar-toggled' : targetClass;
        if ($(targetContainer).hasClass(targetClass)) {
            $(targetContainer).removeClass(targetClass);
        } else if (sidebarProgress !== true) {
            $(targetContainer).addClass(targetClass);
        } else {
            sidebarProgress = false;
        }
        if ($(window).width() < 480) {
            $('#page-container').removeClass('page-sidebar-toggled');
        }
        $(window).trigger('resize');
    });

    $('[data-click=sidebar-toggled]').click(function (e) {
        e.stopPropagation();
        var sidebarClass = 'page-sidebar-toggled';
        var targetContainer = '#page-container';

        if ($(targetContainer).hasClass(sidebarClass)) {
            $(targetContainer).removeClass(sidebarClass);
        } else if (sidebarProgress !== true) {
            $(targetContainer).addClass(sidebarClass);
        } else {
            sidebarProgress = false;
        }
        if ($(window).width() < 480) {
            $('#page-container').removeClass('page-right-sidebar-toggled');
        }
    });
};


/* 04. Handle Sidebar - Minify / Expand
 ------------------------------------------------ */
var handleSidebarMinify = function () {
    $(document).on('click', '[data-click=sidebar-minify]', function (e) {
        e.preventDefault();
        var sidebarClass = 'page-sidebar-minified';
        var targetContainer = '#page-container';

        if ($(targetContainer).hasClass(sidebarClass)) {
            $(targetContainer).removeClass(sidebarClass);
        } else {
            $(targetContainer).addClass(sidebarClass);

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                $('#sidebar [data-scrollbar="true"]').css('margin-top', '0');
                $('#sidebar [data-scrollbar="true"]').css('overflow-x', 'scroll');
            }
        }
        $(window).trigger('resize');
    });
};


/* 05. Handle Page Load - Fade in
 ------------------------------------------------ */
var handlePageContentView = function () {
    "use strict";

    var hideClass = '';
    var showClass = '';
    var removeClass = '';
    var bootstrapVersion = handleCheckBootstrapVersion();

    if (bootstrapVersion >= 3 && bootstrapVersion < 4) {
        hideClass = 'hide';
        showClass = 'in';
    } else if (bootstrapVersion >= 4 && bootstrapVersion < 5) {
        hideClass = 'd-none';
        showClass = 'show';
    }
    $(window).on('load', function () {
        $.when($('#page-loader').addClass(hideClass)).done(function () {
            $('#page-container').addClass(showClass);
        });
    });
};

/* 09. Handle Scroll to Top Button Activation
 ------------------------------------------------ */
var handleScrollToTopButton = function () {
    "use strict";
    var bootstrapVersion = handleCheckBootstrapVersion();
    var showClass = '';

    if (bootstrapVersion >= 3 && bootstrapVersion < 4) {
        showClass = 'in';
    } else if (bootstrapVersion >= 4 && bootstrapVersion < 5) {
        showClass = 'show';
    }
    $(document).scroll(function () {
        var totalScroll = $(document).scrollTop();

        if (totalScroll >= 200) {
            $('[data-click=scroll-top]').addClass(showClass);
        } else {
            $('[data-click=scroll-top]').removeClass(showClass);
        }
    });

    $('[data-click=scroll-top]').click(function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("body").offset().top
        }, 500);
    });
};

/* 16. Handle IE Full Height Page Compatibility - added in V1.6
 ------------------------------------------------ */
var handleIEFullHeightContent = function () {
    var userAgent = window.navigator.userAgent;
    var msie = userAgent.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        $('.vertical-box-row [data-scrollbar="true"][data-height="100%"]').each(function () {
            var targetRow = $(this).closest('.vertical-box-row');
            var targetHeight = $(targetRow).height();
            $(targetRow).find('.vertical-box-cell').height(targetHeight);
        });
    }
};


/* 17. Handle Unlimited Nav Tabs - added in V1.6
 ------------------------------------------------ */
var handleUnlimitedTabsRender = function () {

    // function handle tab overflow scroll width 
    function handleTabOverflowScrollWidth(obj, animationSpeed) {
        var targetElm = 'li.active';

        if ($(obj).find('li').first().hasClass('nav-item')) {
            targetElm = $(obj).find('.nav-item .active').closest('li');
        }
        var targetCss = ($('body').hasClass('rtl-mode')) ? 'margin-right' : 'margin-left';
        var marginLeft = parseInt($(obj).css(targetCss));
        var viewWidth = $(obj).width();
        var prevWidth = $(obj).find(targetElm).width();
        var speed = (animationSpeed > -1) ? animationSpeed : 150;
        var fullWidth = 0;

        $(obj).find(targetElm).prevAll().each(function () {
            prevWidth += $(this).width();
        });

        $(obj).find('li').each(function () {
            fullWidth += $(this).width();
        });

        if (prevWidth >= viewWidth) {
            var finalScrollWidth = prevWidth - viewWidth;
            if (fullWidth != prevWidth) {
                finalScrollWidth += 40;
            }
            if ($('body').hasClass('rtl-mode')) {
                $(obj).find('.nav.nav-tabs').animate({marginRight: '-' + finalScrollWidth + 'px'}, speed);
            } else {
                $(obj).find('.nav.nav-tabs').animate({marginLeft: '-' + finalScrollWidth + 'px'}, speed);
            }
        }

        if (prevWidth != fullWidth && fullWidth >= viewWidth) {
            $(obj).addClass('overflow-right');
        } else {
            $(obj).removeClass('overflow-right');
        }

        if (prevWidth >= viewWidth && fullWidth >= viewWidth) {
            $(obj).addClass('overflow-left');
        } else {
            $(obj).removeClass('overflow-left');
        }
    }

    // function handle tab button action - next / prev
    function handleTabButtonAction(element, direction) {
        var obj = $(element).closest('.tab-overflow');
        var targetCss = ($('body').hasClass('rtl-mode')) ? 'margin-right' : 'margin-left';
        var marginLeft = parseInt($(obj).find('.nav.nav-tabs').css(targetCss));
        var containerWidth = $(obj).width();
        var totalWidth = 0;
        var finalScrollWidth = 0;

        $(obj).find('li').each(function () {
            if (!$(this).hasClass('next-button') && !$(this).hasClass('prev-button')) {
                totalWidth += $(this).width();
            }
        });

        switch (direction) {
            case 'next':
                var widthLeft = totalWidth + marginLeft - containerWidth;
                if (widthLeft <= containerWidth) {
                    finalScrollWidth = widthLeft - marginLeft;
                    setTimeout(function () {
                        $(obj).removeClass('overflow-right');
                    }, 150);
                } else {
                    finalScrollWidth = containerWidth - marginLeft - 80;
                }

                if (finalScrollWidth !== 0) {
                    if (!$('body').hasClass('rtl-mode')) {
                        $(obj).find('.nav.nav-tabs').animate({marginLeft: '-' + finalScrollWidth + 'px'}, 150, function () {
                            $(obj).addClass('overflow-left');
                        });
                    } else {
                        $(obj).find('.nav.nav-tabs').animate({marginRight: '-' + finalScrollWidth + 'px'}, 150, function () {
                            $(obj).addClass('overflow-left');
                        });
                    }
                }
                break;
            case 'prev':
                var widthLeft = -marginLeft;

                if (widthLeft <= containerWidth) {
                    $(obj).removeClass('overflow-left');
                    finalScrollWidth = 0;
                } else {
                    finalScrollWidth = widthLeft - containerWidth + 80;
                }
                if (!$('body').hasClass('rtl-mode')) {
                    $(obj).find('.nav.nav-tabs').animate({marginLeft: '-' + finalScrollWidth + 'px'}, 150, function () {
                        $(obj).addClass('overflow-right');
                    });
                } else {
                    $(obj).find('.nav.nav-tabs').animate({marginRight: '-' + finalScrollWidth + 'px'}, 150, function () {
                        $(obj).addClass('overflow-right');
                    });
                }
                break;
        }
    }

    // handle page load active tab focus
    function handlePageLoadTabFocus() {
        $('.tab-overflow').each(function () {
            handleTabOverflowScrollWidth(this, 0);
        });
    }

    // handle tab next button click action
    $('[data-click="next-tab"]').click(function (e) {
        e.preventDefault();
        handleTabButtonAction(this, 'next');
    });

    // handle tab prev button click action
    $('[data-click="prev-tab"]').click(function (e) {
        e.preventDefault();
        handleTabButtonAction(this, 'prev');

    });

    // handle unlimited tabs responsive setting
    $(window).resize(function () {
        $('.tab-overflow .nav.nav-tabs').removeAttr('style');
        handlePageLoadTabFocus();
    });

    handlePageLoadTabFocus();
};

/* 25. Handle Toggle Navbar Profile - added in V4.0
 ------------------------------------------------ */
var handleToggleNavProfile = function () {
    var expandTime = ($('.sidebar').attr('data-disable-slide-animation')) ? 0 : 250;

    $('[data-toggle="nav-profile"]').click(function (e) {
        e.preventDefault();

        var targetLi = $(this).closest('li');
        var targetProfile = $('.sidebar .nav.nav-profile');
        var targetClass = 'active';
        var targetExpandingClass = 'expanding';
        var targetExpandClass = 'expand';
        var targetClosingClass = 'closing';
        var targetClosedClass = 'closed';

        if ($(targetProfile).is(':visible')) {
            $(targetLi).removeClass(targetClass);
            $(targetProfile).removeClass(targetClosingClass);
        } else {
            $(targetLi).addClass(targetClass);
            $(targetProfile).addClass(targetExpandingClass);
        }
        $(targetProfile).slideToggle(expandTime, function () {
            if (!$(targetProfile).is(':visible')) {
                $(targetProfile).addClass(targetClosedClass);
                $(targetProfile).removeClass(targetExpandClass);
            } else {
                $(targetProfile).addClass(targetExpandClass);
                $(targetProfile).removeClass(targetClosedClass);
            }
            $(targetProfile).removeClass(targetExpandingClass + ' ' + targetClosingClass);
        });
    });
};


/* 26. Handle Sidebar Scroll Memory - added in V4.0
 ------------------------------------------------ */
var handleSidebarScrollMemory = function () {
    if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        $('.sidebar [data-scrollbar="true"]').slimScroll().bind('slimscrolling', function (e, pos) {
            localStorage.setItem('sidebarScrollPosition', pos + 'px');
        });

        var defaultScroll = localStorage.getItem('sidebarScrollPosition');
        if (defaultScroll) {
            $('.sidebar [data-scrollbar="true"]').slimScroll({scrollTo: defaultScroll});
        }
    }
};


/* 27. Handle Sidebar Minify Sub Menu - added in V4.0
 ------------------------------------------------ */
var floatSubMenuTimeout;
var targetFloatMenu;
var handleMouseoverFloatSubMenu = function (elm) {
    clearTimeout(floatSubMenuTimeout);
};
var handleMouseoutFloatSubMenu = function (elm) {
    floatSubMenuTimeout = setTimeout(function () {
        $('#float-sub-menu').remove();
    }, 150);
};
var handleSidebarMinifyFloatMenu = function () {
    $(document).on('click', '#float-sub-menu li.has-sub > a', function (e) {
        var target = $(this).next('.sub-menu');
        var targetLi = $(target).closest('li');
        var close = false;
        var expand = false;
        if ($(target).is(':visible')) {
            $(targetLi).addClass('closing');
            close = true;
        } else {
            $(targetLi).addClass('expanding');
            expand = true;
        }
        $(target).slideToggle({
            duration: 250,
            progress: function () {
                var targetMenu = $('#float-sub-menu');
                var targetHeight = $(targetMenu).height();
                var targetOffset = $(targetMenu).offset();
                var targetOriTop = $(targetMenu).attr('data-offset-top');
                var targetMenuTop = $(targetMenu).attr('data-menu-offset-top');
                var targetTop = targetOffset.top - $(window).scrollTop();
                var windowHeight = $(window).height();
                if (close) {
                    if (targetTop > targetOriTop) {
                        targetTop = (targetTop > targetOriTop) ? targetOriTop : targetTop;
                        $('#float-sub-menu').css({'top': targetTop + 'px', 'bottom': 'auto'});
                        $('#float-sub-menu-arrow').css({'top': '20px', 'bottom': 'auto'});
                        $('#float-sub-menu-line').css({'top': '20px', 'bottom': 'auto'});
                    }
                }
                if (expand) {
                    if ((windowHeight - targetTop) < targetHeight) {
                        var arrowBottom = (windowHeight - targetMenuTop) - 22;
                        $('#float-sub-menu').css({'top': 'auto', 'bottom': 0});
                        $('#float-sub-menu-arrow').css({'top': 'auto', 'bottom': arrowBottom + 'px'});
                        $('#float-sub-menu-line').css({'top': '20px', 'bottom': arrowBottom + 'px'});
                    }
                }
            },
            complete: function () {
                if ($(target).is(':visible')) {
                    $(targetLi).addClass('expand');
                } else {
                    $(targetLi).addClass('closed');
                }
                $(targetLi).removeClass('closing expanding');
            }
        });
    });
    $('.sidebar .nav > li.has-sub > a').hover(function () {
        if ($('#page-container').hasClass('page-sidebar-minified')) {
            clearTimeout(floatSubMenuTimeout);

            var targetMenu = $(this).closest('li').find('.sub-menu').first();
            if (targetFloatMenu == this && $('#float-sub-menu').length !== 0) {
                return;
            } else {
                targetFloatMenu = this;
            }
            var targetMenuHtml = $(targetMenu).html();
            if (targetMenuHtml) {
                var sidebarOffset = $('#sidebar').offset();
                var sidebarX = (!$('#page-container').hasClass('page-with-right-sidebar')) ? (sidebarOffset.left + 60) : ($(window).width() - sidebarOffset.left);
                var targetHeight = $(targetMenu).height();
                var targetOffset = $(this).offset();
                var targetTop = targetOffset.top - $(window).scrollTop();
                var targetLeft = (!$('#page-container').hasClass('page-with-right-sidebar')) ? sidebarX : 'auto';
                var targetRight = (!$('#page-container').hasClass('page-with-right-sidebar')) ? 'auto' : sidebarX;
                var windowHeight = $(window).height();

                if ($('#float-sub-menu').length === 0) {
                    targetMenuHtml = '' +
                            '<div class="float-sub-menu-container" id="float-sub-menu" data-offset-top="' + targetTop + '" data-menu-offset-top="' + targetTop + '" onmouseover="handleMouseoverFloatSubMenu(this)" onmouseout="handleMouseoutFloatSubMenu(this)">' +
                            '	<div class="float-sub-menu-arrow" id="float-sub-menu-arrow"></div>' +
                            '	<div class="float-sub-menu-line" id="float-sub-menu-line"></div>' +
                            '	<ul class="float-sub-menu">' + targetMenuHtml + '</ul>' +
                            '</div>';
                    $('#page-container').append(targetMenuHtml);
                } else {
                    $('#float-sub-menu').attr('data-offset-top', targetTop);
                    $('#float-sub-menu').attr('data-menu-offset-top', targetTop);
                    $('.float-sub-menu').html(targetMenuHtml);
                }

                if ((windowHeight - targetTop) > targetHeight) {
                    $('#float-sub-menu').css({
                        'top': targetTop,
                        'left': targetLeft,
                        'bottom': 'auto',
                        'right': targetRight
                    });
                    $('#float-sub-menu-arrow').css({'top': '20px', 'bottom': 'auto'});
                    $('#float-sub-menu-line').css({'top': '20px', 'bottom': 'auto'});
                } else {
                    $('#float-sub-menu').css({
                        'bottom': 0,
                        'top': 'auto',
                        'left': targetLeft,
                        'right': targetRight
                    });
                    var arrowBottom = (windowHeight - targetTop) - 21;
                    $('#float-sub-menu-arrow').css({'top': 'auto', 'bottom': arrowBottom + 'px'});
                    $('#float-sub-menu-line').css({'top': '20px', 'bottom': arrowBottom + 'px'});
                }
            } else {
                $('#float-sub-menu').remove();
                targetFloatMenu = '';
            }
        }
    }, function () {
        if ($('#page-container').hasClass('page-sidebar-minified')) {
            floatSubMenuTimeout = setTimeout(function () {
                $('#float-sub-menu').remove();
                targetFloatMenu = '';
            }, 250);
        }
    });
};


/* 28. Handle Ajax Mode - added in V4.0
 ------------------------------------------------ */
var CLEAR_OPTION = '';
var handleAjaxMode = function (setting) {
    var emptyHtml = (setting.emptyHtml) ? setting.emptyHtml : '<div class="p-t-40 p-b-40 text-center f-s-20 content"><i class="fa fa-warning fa-lg text-muted m-r-5"></i> <span class="f-w-600 text-inverse">Error 404! Page not found.</span></div>';
    var defaultUrl = (setting.ajaxDefaultUrl) ? setting.ajaxDefaultUrl : '';
    defaultUrl = (window.location.hash) ? window.location.hash : defaultUrl;

    if (defaultUrl === '') {
        $('#content').html(emptyHtml);
    } else {
        renderAjax(defaultUrl, '', true);
    }

    function clearElement() {
        $('.jvectormap-label, .jvector-label, .AutoFill_border ,#gritter-notice-wrapper, .ui-autocomplete, .colorpicker, .FixedHeader_Header, .FixedHeader_Cloned .lightboxOverlay, .lightbox, .introjs-hints, .nvtooltip, #float-sub-menu').remove();
        if ($.fn.DataTable) {
            $('.dataTable').DataTable().destroy();
        }
        if ($('#page-container').hasClass('page-sidebar-toggled')) {
            $('#page-container').removeClass('page-sidebar-toggled');
        }
    }

    function checkSidebarActive(url) {
        var targetElm = '#sidebar [data-toggle="ajax"][href="' + url + '"]';
        if ($(targetElm).length !== 0) {
            $('#sidebar li').removeClass('active');
            $(targetElm).closest('li').addClass('active');
            $(targetElm).parents().addClass('active');
        }
    }

    function checkPushState(url) {
        var targetUrl = url.replace('#', '');
        var targetUserAgent = window.navigator.userAgent;
        var isIE = targetUserAgent.indexOf('MSIE ');

        if (isIE && (isIE > 0 && isIE < 9)) {
            window.location.href = targetUrl;
        } else {
            history.pushState('', '', '#' + targetUrl);
        }
    }

    function checkClearOption() {
        if (CLEAR_OPTION) {
            App.clearPageOption(CLEAR_OPTION);
            CLEAR_OPTION = '';
        }
    }

    function checkLoading(load) {
        if (!load) {
            if ($('#page-content-loader').length === 0) {
                $('body').addClass('page-content-loading');
                $('#content').append('<div id="page-content-loader"><span class="spinner"></span></div>');
            }
        } else {
            $('#page-content-loader').remove();
            $('body').removeClass('page-content-loading');
        }
    }

    function renderAjax(url, elm, disablePushState) {
        Pace.restart();

        checkLoading(false);
        clearElement();
        checkSidebarActive(url);
        checkClearOption();
        if (!disablePushState) {
            checkPushState(url);
        }

        var targetContainer = '#content';
        var targetUrl = url.replace('#', '');
        var targetType = (setting.ajaxType) ? setting.ajaxType : 'GET';
        var targetDataType = (setting.ajaxDataType) ? setting.ajaxDataType : 'html';
        if (elm) {
            targetDataType = ($(elm).attr('data-type')) ? $(elm).attr('data-type') : targetDataType;
            targetDataDataType = ($(elm).attr('data-data-type')) ? $(elm).attr('data-data-type') : targetDataType;
        }

        $.ajax({
            url: targetUrl,
            type: targetType,
            dataType: targetDataType,
            success: function (data) {
                $(targetContainer).html(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $(targetContainer).html(emptyHtml);
            }
        }).done(function () {
            checkLoading(true);
            $('html, body').animate({scrollTop: 0}, 0);
            App.initComponent();
        });
    }

    $(window).on('hashchange', function () {
        if (window.location.hash) {
            renderAjax(window.location.hash, '', true);
        }
    });

    $(document).on('click', '[data-toggle="ajax"]', function (e) {
        e.preventDefault();
        renderAjax($(this).attr('href'), this);
    });
};
var handleSetPageOption = function (option) {
    if (option.pageContentFullHeight) {
        $('#page-container').addClass('page-content-full-height');
    }
    if (option.pageSidebarLight) {
        $('#page-container').addClass('page-with-light-sidebar');
    }
    if (option.pageSidebarRight) {
        $('#page-container').addClass('page-with-right-sidebar');
    }
    if (option.pageSidebarWide) {
        $('#page-container').addClass('page-with-wide-sidebar');
    }
    if (option.pageSidebarMinified) {
        $('#page-container').addClass('page-sidebar-minified');
    }
    if (option.pageSidebarTransparent) {
        $('#sidebar').addClass('sidebar-transparent');
    }
    if (option.pageContentFullWidth) {
        $('#content').addClass('content-full-width');
    }
    if (option.pageContentInverseMode) {
        $('#content').addClass('content-inverse-mode');
    }
    if (option.pageBoxedLayout) {
        $('body').addClass('boxed-layout');
    }
    if (option.clearOptionOnLeave) {
        CLEAR_OPTION = option;
    }
};
var handleClearPageOption = function (option) {
    if (option.pageContentFullHeight) {
        $('#page-container').removeClass('page-content-full-height');
    }
    if (option.pageSidebarLight) {
        $('#page-container').removeClass('page-with-light-sidebar');
    }
    if (option.pageSidebarRight) {
        $('#page-container').removeClass('page-with-right-sidebar');
    }
    if (option.pageSidebarWide) {
        $('#page-container').removeClass('page-with-wide-sidebar');
    }
    if (option.pageSidebarMinified) {
        $('#page-container').removeClass('page-sidebar-minified');
    }
    if (option.pageSidebarTransparent) {
        $('#sidebar').removeClass('sidebar-transparent');
    }
    if (option.pageContentFullWidth) {
        $('#content').removeClass('content-full-width');
    }
    if (option.pageContentInverseMode) {
        $('#content').removeClass('content-inverse-mode');
    }
    if (option.pageBoxedLayout) {
        $('body').removeClass('boxed-layout');
    }
};


/* 29. Handle Float Navbar Search - added in V4.0
 ------------------------------------------------ */
var handleToggleNavbarSearch = function () {
    $('[data-toggle="navbar-search"]').click(function (e) {
        e.preventDefault();
        $('.header').addClass('header-search-toggled');
    });

    $('[data-dismiss="navbar-search"]').click(function (e) {
        e.preventDefault();
        $('.header').removeClass('header-search-toggled');
    });
};


/* Application Controller
 ------------------------------------------------ */
var App = function () {
    "use strict";

    var setting;

    return {
        //main function
        init: function (option) {
            if (option) {
                setting = option;
            }
            this.initLocalStorage();
            this.initSidebar();
            this.initTopMenu();
            this.initComponent();
            this.initThemePanel();
            this.initPageLoad();
            $(window).trigger('load');

            if (setting && setting.ajaxMode) {
                this.initAjax();
            }
        },
        initSidebar: function () {
            handleSidebarMenu();
            handleMobileSidebarToggle();
            handleSidebarMinify();
            handleSidebarMinifyFloatMenu();
            handleToggleNavProfile();
            handleToggleNavbarSearch();

            if (!setting || (setting && !setting.disableSidebarScrollMemory)) {
                handleSidebarScrollMemory();
            }
        },
        initSidebarSelection: function () {
            handleClearSidebarSelection();
        },
        initSidebarMobileSelection: function () {
            handleClearSidebarMobileSelection();
        },
        initTopMenu: function () {
            handleUnlimitedTopMenuRender();
            handleTopMenuSubMenu();
            handleMobileTopMenuSubMenu();
            handleTopMenuMobileToggle();
        },
        initPageLoad: function () {
            handlePageContentView();
        },
        initComponent: function () {
            if (!setting || (setting && !setting.disableDraggablePanel)) {
                handleDraggablePanel();
            }
            handleIEFullHeightContent();
            handleSlimScroll();
            handleUnlimitedTabsRender();
            handlePanelAction();
            handelTooltipPopoverActivation();
            handleScrollToTopButton();
            handleAfterPageLoadAddClass();
            handlePageScrollClass();
        },
        initLocalStorage: function () {
            handleLocalStorage();
        },
        initThemePanel: function () {
            handleThemePageStructureControl();
            handleThemePanelExpand();
            handleResetLocalStorage();
        },
        initAjax: function () {
            handleAjaxMode(setting);
            $.ajaxSetup({
                cache: true
            });
        },
        setPageTitle: function (pageTitle) {
            document.title = pageTitle;
        },
        setPageOption: function (option) {
            handleSetPageOption(option);
        },
        clearPageOption: function (option) {
            handleClearPageOption(option);
        },
        restartGlobalFunction: function () {
            this.initLocalStorage();
            this.initTopMenu();
            this.initComponent();
        },
        scrollTop: function () {
            $('html, body').animate({
                scrollTop: $('body').offset().top
            }, 0);
        }
    };
}();