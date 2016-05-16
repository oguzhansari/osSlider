/*
** OĞUZHAN SARI
** UPDATE : 030720150850-O28728
** UPDATE : 040720151022-O28728 // istenilen elemente özel classataması yapıldı. os_AddClassElements
** UPDATE : 280920151644-O28728 // halffloat adı verilen özellik eklendi. slide'lar 3 parça gözüküyor. ortadaki aktif slide tam boy sol da ve sağda sıradaki slide'lar yarım boy.
** UPDATE : 290920151328-O28728 // next - prev Increase -Decrease iptal edildi. function next - prev yerinin aldı.
** UPDATE : 081020151046 // element tanımlama işlemlerinden kaynaklanan diğer slider ile olan çakışma problemi giderildi.
** UPDATE : 041220151532 destroy - init - rebuild - arrayrebuild fonksiyonları ile geliştirildi.
*/

(function ($) {
    $.os_LiteSlider = function (el, options) {
        var os_LiteSlider = $(el);
        os_LiteSlider.vars = $.extend({}, $.os_LiteSlider.defaults, options);
        $.data(el, "os_LiteSlider", os_LiteSlider);
        os_LiteSlidermethods = {
            initx: function () {
                console.log("initx");
                var OS = os_LiteSlider.vars;
                return $(this).each(function () {
                    var t = os_LiteSlider;
                    var hf_W = parseInt($(window).width() / 2);
                    $(window).resize(function () {
                        hf_W = parseInt($(window).width() / 2);
                    });
                    if (t.hasClass('osActiveSlider')) { return false; }
                    t.addClass('osActiveSlider');
                    function animFalse() { animation = false; };
                    function animTrue() { animation = true; };
                    t.addClass(OS.os_Theme);

                    $(OS.os_Contents, t).children('*[data-view="true"]').each(function (index) {
                        var ct = $(this);
                        var imgSrc = ct.attr('data-src');
                        ct.wrap('<div class="' + (OS.os_Content).replace("#", "").replace(".", "") + '"></div>');
                        var tW = "100%";
                        if (OS.os_SlideType == "halffloat") {
                            tW = hf_W;
                            ct.parent(OS.os_Content).css({ "width": tW });
                            ct.css({ "background": "url(" + imgSrc + ") no-repeat center center", "background-size": "cover" });
                        } else {
                            ct.parent(OS.os_Content).css({ "background": "url(" + imgSrc + ") no-repeat center center", "width": tW, "background-size": "cover" });
                        }
                        $(this).css({ 'display': 'block' });
                    });

                    $(OS.os_Contents, t).children('*[data-view="false"]').each(function () {
                        $(this).css({ 'display': 'none' });
                    });

                    if (OS.os_SlideType == "halffloat") {
                        $(OS.os_Contents, t).addClass("hf");
                        tW = $(window).width() / 2;
                        hfW = $(OS.os_Contents + " " + OS.os_Content, t).length * tW;
                        $(OS.os_Contents, t).wrapInner('<div class="halffloat" style="position: absolute; width: ' + hfW + 'px; left: ' + (tW / 2) + 'px"></div>');
                        $(window).resize(function () {
                            halffloat_resize();
                        });
                    }

                    function halffloat_resize() {
                        tW = $(window).width() / 2;
                        hfW = $(OS.os_Contents + " " + OS.os_Content, t).length * tW;
                        $('.halffloat', t).css({ "width": hfW + "px" });
                        $(OS.os_Content, t).css({ "width": hf_W + "px" });
                        AID = $('.os_LS_Points li .point.active', t).data("vdls-slide");
                        var cIndex = parseInt($('#ContentID_' + AID, t).index());
                        var left = "-" + ((hf_W * cIndex) - (hf_W / 2)) + "px";
                        if (cIndex == 0) {
                            left = (hf_W / 2);
                        }
                        $('.halffloat', t).css({ "left": left });
                    }

                    var os_Contents_Count = $(OS.os_Contents + " " + OS.os_Content, t).length - 1;
                    var os_currentID = 0;
                    var nextID = os_currentID + 1;
                    var prevID = os_Contents_Count;
                    var ActiveID = 0;
                    t.append('<nav class="os_LS_Points"><ul></ul></nav>');
                    console.log(OS.os_NP_ButtonDisplay);
                    if (OS.os_NP_ButtonDisplay) {
                        t.prepend('<a class="' + OS.os_ButtonPrev.substring(1, OS.os_ButtonPrev.length) + '">' + OS.os_ButtonPrev_Text + '</a><a class="' + OS.os_ButtonNext.substring(1, OS.os_ButtonNext.length) + '">' + OS.os_ButtonNext_Text + '</a>');
                    }
                    for (var i = 0; i <= os_Contents_Count; i++) {
                        if (OS.os_PointDisplay == true) {
                            $('.os_LS_Points ul', t).append('<li><a class="point"></a></li>');
                            $('.os_LS_Points ul li:eq(0) .point', t).addClass('active');
                            $('.os_LS_Points ul li:eq(' + i + ') .point', t).attr("data-vdls-Slide", i);
                        }
                        $(OS.os_Contents + ' ' + OS.os_Content + ':eq(' + i + ')', t).attr("id", "ContentID_" + i);
                        if (OS.os_SlideType != "halffloat") {
                            $(OS.os_Contents + ' ' + OS.os_Content, t).css("display", "none");
                        }
                        $('#ContentID_0', t).addClass('activeSlide').css("display", "block");
                    }
                    if (os_Contents_Count > 0) {
                        $('#ContentID_' + os_currentID, t).fadeIn();
                        $(OS.os_ButtonNext, t).attr("data-vdls-Slide", nextID);
                        $(OS.os_ButtonPrev, t).attr("data-vdls-Slide", prevID);
                    } else {
                        $(OS.os_ButtonNext, t).remove();
                        $(OS.os_ButtonPrev, t).remove();
                        $('.os_LS_Points', t).remove();
                    }

                    /*function anim(_element) {_element.stop().fadeIn();}*/

                    function os_currentID_Increase() {
                        if (parseInt(os_currentID) + 1 <= os_Contents_Count) {
                            os_currentID = parseInt(os_currentID) + 1
                        } else {
                            os_currentID = 0
                        }
                        return os_currentID
                    }
                    function os_currentID_Decrease() {
                        if (parseInt(os_currentID) - 1 >= 0) {
                            os_currentID = parseInt(os_currentID) - 1
                        } else {
                            os_currentID = os_Contents_Count
                        }
                        return os_currentID
                    }
                    function next(a) {
                        if (parseInt(a) >= os_Contents_Count) {
                            n = 0;
                        } else {
                            n = parseInt(a) + 1;
                        }
                        return n;
                    }
                    function prev(a) {
                        if (parseInt(a) <= 0) {
                            n = os_Contents_Count;
                        } else {
                            n = parseInt(a) - 1;
                        }
                        return n;
                    }

                    $(OS.os_ButtonNext, t).click(function () {
                        $('.os_LS_Points li .point[data-vdls-slide="' + $(this).attr('data-vdls-slide') + '"]', t).trigger('click');
                        return false;
                    });
                    $(OS.os_ButtonPrev, t).click(function () {
                        $('.os_LS_Points li .point[data-vdls-slide="' + $(this).attr('data-vdls-slide') + '"]', t).trigger('click');
                        return false;
                    });

                    $('.os_LS_Points li .point').click(function () {
                        var lit = $(this);
                        removeAddClassElement();
                        if (!lit.hasClass("active")) {
                            os_currentID = lit.attr("data-vdls-Slide");
                            animateFunc(os_currentID);
                            $('.os_LS_Points li .point', t).removeClass("active");
                            lit.addClass("active");
                            ActiveID = lit.data("vdls-slide");
                            $(OS.os_ButtonNext, t).attr("data-vdls-Slide", next(os_currentID));
                            $(OS.os_ButtonPrev, t).attr("data-vdls-Slide", prev(os_currentID));
                        }
                        return false;
                    });

                    function animateFunc(vdSlideID) {
                        if (OS.os_SlideType == "halffloat") {
                            var cIndex = parseInt($('#ContentID_' + vdSlideID, t).index());
                            var left = "-" + ((hf_W * cIndex) - (hf_W / 2)) + "px";
                            if (cIndex == 0) {
                                left = (hf_W / 2);
                            }
                            $('.halffloat', t).css({ "left": left });
                            $(OS.os_Contents + ' ' + OS.os_Content, t).removeClass('activeSlide');
                            $('#ContentID_' + vdSlideID, t).addClass('activeSlide');
                        } else {
                            $(OS.os_Contents + ' ' + OS.os_Content, t).stop().fadeOut(OS.os_AnimateSpeed);
                            $('#ContentID_' + vdSlideID, t).fadeIn(OS.os_AnimateSpeed);
                        }
                        AddClassElement(vdSlideID);
                    }
                    function AddClassElement(vdSlideID) {
                        var eC1 = $('#ContentID_' + ActiveID, t);
                        var e1 = $('.' + OS.os_AnimateFadeOutElement, eC1);
                        var w1 = e1.width();
                        var eC2 = $('#ContentID_' + vdSlideID, t);
                        var e2 = $('.' + OS.os_AnimateFadeOutElement, eC2);
                        var w2 = e2.width();

                        e1.css({ 'left': 0 + "px", 'opacity': 1 }).animate({ 'left': -w1 + "px", 'opacity': 0 }, OS.os_AnimateFadeOutElementSpeed);
                        e2.css({ 'left': w2 + "px", 'opacity': 0 }).animate({ 'left': 0 + "px", 'opacity': 1 }, OS.os_AnimateFadeOutElementSpeed);

                        if (OS.os_AddClassElements != null) {
                            setTimeout(function () {
                                var e = OS.os_AddClassElements.length;
                                for (var i = 0; i < e; i++) {
                                    var xC = $('#ContentID_' + vdSlideID, t);
                                    $('.' + OS.os_AddClassElements[i][0], xC).addClass(OS.os_AddClassElements[i][1]);
                                }
                                setTimeout(function () {
                                    for (var i = 0; i < e; i++) {
                                        var xC = $('#ContentID_' + vdSlideID, t);
                                        $('.' + OS.os_AddClassElements[i][0], xC).removeClass(OS.os_AddClassElements[i][1]);
                                    }
                                }, ((OS.os_AutoPlayDuration / 100) * 80));
                            }, OS.os_AnimateSpeed);
                        }
                    }
                    function removeAddClassElement() {
                        if (OS.os_AddClassElements != null) {
                            var e = OS.os_AddClassElements.length;
                            setTimeout(function () {
                                for (var i = 0; i < e; i++) {
                                    var xC = $('#ContentID_' + ActiveID, t);
                                    $('.' + OS.os_AddClassElements[i][0], xC).removeClass(OS.os_AddClassElements[i][1]);
                                }
                            }, 100);
                        }
                    }
                    AddClassElement(0);
                    if (OS.os_AutoPlay == true) {
                        var autoPlay = setInterval(function () {
                            os_currentID_Increase();
                            $('.os_LS_Points li .point', t).removeClass("active");
                            $('.os_LS_Points li:nth-child(' + (os_currentID + 1) + ') .point', t).trigger('click');
                            $('.os_LS_Points li:nth-child(' + (os_currentID + 1) + ') .point', t).addClass("active");
                            $(OS.os_ButtonNext, t).attr("data-vdls-Slide", next(os_currentID));
                            $(OS.os_ButtonPrev, t).attr("data-vdls-Slide", prev(os_currentID));
                        }, OS.os_AutoPlayDuration);
                        function AutoPlayStartStop(element) {
                            $(element).mouseover(function () {
                                clearInterval(autoPlay);
                            }).mouseout(function () {
                                autoPlay = setInterval(function () {
                                    os_currentID_Increase();
                                    $('.os_LS_Points li .point', t).removeClass("active");
                                    $('.os_LS_Points li:nth-child(' + (os_currentID + 1) + ') .point', t).trigger('click');
                                    $('.os_LS_Points li:nth-child(' + (os_currentID + 1) + ') .point', t).addClass("active");
                                    $(OS.os_ButtonNext, t).attr("data-vdls-Slide", next(os_currentID));
                                    $(OS.os_ButtonPrev, t).attr("data-vdls-Slide", prev(os_currentID));
                                }, OS.os_AutoPlayDuration);
                            })
                        }
                        AutoPlayStartStop(OS.os_ButtonNext);
                        AutoPlayStartStop(OS.os_ButtonPrev);
                        AutoPlayStartStop(".os_LS_Points li");
                    }
                });
            }
        }
        os_LiteSlider.destroy = function () {
            var o = os_LiteSlider.vars;
            var t = os_LiteSlider;
            var imgElement = $(o.os_Contents, t);
            $(o.os_Contents + " *").each(function (index) {
                if ($(this).parent().is(o.os_Content)) {
                    $(this).unwrap();
                }
            });
            $("*", imgElement).each(function (index) {
                $(this).attr("data-view", "true");
            });
            $('.os_LS_Points', t).remove();
            $(o.os_ButtonNext, t).remove();
            $(o.os_ButtonPrev, t).remove();
            $(t).removeClass(o.os_Theme);
            $(t).removeClass("osActiveSlider");
            $("*", t).off("click");
            return true;
        }
        os_LiteSlider.rebuild = function () {
            var o = os_LiteSlider.vars;
            var t = os_LiteSlider;
            if ($(o.os_Content).length > 0) {
                os_LiteSlider.destroy();
            }
            os_LiteSlidermethods.initx();
        }
        os_LiteSlider.arrayrebuild = function (value) {
            if (os_LiteSlider.destroy()) {
                var o = os_LiteSlider.vars;
                var t = os_LiteSlider;
                var imgElement = $(o.os_Contents, t);
                var arrayVal = parseInt(value);
                $(">", imgElement).each(function (index) {
                    var tt = $(this);
                    var split = tt.attr('data-array-options').split(",");
                    var splitLen = split.length;
                    if (tt.attr('data-array-options') == "" || tt.attr('data-array-options') == undefined) {
                        splitLen = 0;
                    }
                    var array = [];
                    if (splitLen != 0) {
                        for (var i = 0; i < splitLen; i++) {
                            array.push(parseInt(split[i]));
                        }
                    }
                    if (array.indexOf(arrayVal) > -1 || array.length == 0) {
                        tt.attr("data-view", "true");
                    } else {
                        tt.attr("data-view", "false");
                    }
                });
                os_LiteSlidermethods.initx();
            }
        }
        os_LiteSlider.initxreplay = function () {
            //os_LiteSlidermethods.initx();
        }
        os_LiteSlidermethods.initx();
    }
    $.os_LiteSlider.defaults = {
        os_ButtonNext: '.os_LS_Next',
        os_ButtonPrev: '.os_LS_Prev',
        os_ButtonNext_Text: '>',
        os_ButtonPrev_Text: '<',
        os_PointDisplay: true,
        os_NP_ButtonDisplay: false,
        os_Contents: '.os_LS_Content',
        os_Content: '.os_Content',
        os_animation: false,
        os_AutoPlay: true,
        os_AutoPlayDuration: 5500,
        os_AnimateSpeed: 1000,
        os_Theme: "vdT_LiteSlider",
        os_Slide: false,
        os_AddClassElements: null, // jSon format [["element1", "active"], ["element2", "animate"]]
        os_AnimateFadeOutElement: null,
        os_AnimateFadeOutElementSpeed: 1000,
        os_SlideType: null, // halffloat or null
    }
    $.fn.os_LiteSlider = function (options, opt) {
        if (options === undefined) { options = {}; } // object değer girilmemişse boş object tanımlıyoruz.
        if (typeof options === "object") {
            return this.each(function () {
                options = $.extend({}, options, { BottomMenuID: codeGenerator(20) });
                var $this = $(this);
                if ($this.data('os_LiteSlider') === undefined) {
                    new $.os_LiteSlider(this, options);
                }
            });
        } else {
            var $os_LiteSlider = $(this).data('os_LiteSlider');
            if (typeof opt === "object") {
                var arrayValue = opt.arrayValue;
            }
            switch (options) {
                case "destroy": $os_LiteSlider.destroy(); break;
                case "rebuild": $os_LiteSlider.rebuild(); break;
                case "arrayrebuild": $os_LiteSlider.arrayrebuild(arrayValue); break;
                default: $os_LiteSlider.destroy();
            }
        }
    }
})(jQuery);
function codeGenerator(t) { void 0 == t && (t = 10); for (var o = "", n = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", s = 0; t > s; s++) o += n.charAt(Math.floor(Math.random() * n.length)); return o }