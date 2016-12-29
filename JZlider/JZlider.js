/*************************************
 ***  Created by JZ on 2015/11/23  ***
 ***  JZlider ver.0.9.12.29        ***
 ************************************/

(function ($) {
    function slide_ini(target, opt) {
        var slide_num = target.find('.slide').length,
            slide_now = 0, slide_next = 0,
            position_left_s = '100%',
            position_left_e = '-100%',
            _isDot = false,
            target_id = 'JZlider' + Math.floor(new Date()) + Math.floor(Math.random() * 10000),
            slide_start, dire;
        //Default values
        var settings = {
            speed: 500,//滑動速度
            stayTime: 5000,//執行間隔
            autoPlay: true,//自動播放
            direCtr: false,//左右控制開關
            bullet: false,//圓點控制開關
            cycling: true,//循環or停在最後一張
            hoverPause: true,//mouseover暫停
            debug: false//debug mode
        };
        $.extend(settings, opt);
        //initialize
        target.addClass('JZlider').find('.slide').wrapAll('<div class="slide-box" id="' + target_id + '"><div class="slide-wrap"></div></div>');
        target.find('.slide').eq(0).siblings('.slide').css({display: 'none', position: 'absolute'});
        //##### debug #####
        if (settings.debug == true) {
            console.log('JZlider debug mode:');
        }
        if (settings.bullet == true) {
            target.append('<div class="bullet-wrap"></div>');
            for (var k = 0; k < slide_num; k++) {
                target.find('.bullet-wrap').append('<div class="bullet"></div>');
            }
            target.find('.bullet').bind('click', slide_choose);
            target.find('.bullet').eq(slide_next).addClass('active');
        }
        if (settings.direCtr == true) {
            target.find('.slide-box').append('<div class="JZlider-control left"></div><div class="JZlider-control right"></div>');
            target.find('.JZlider-control').bind('click', slide_change_dire);
        }
        if (settings.autoPlay == true) {
            if (slide_num > 1) {
                auto_slide();
                if (settings.hoverPause == true) {
                    //##### debug #####
                    if (settings.debug == true) {
                        console.log('hoverPause on');
                    }
                    target.find('.slide').hover(function () {
                        clearTimeout(slide_start);
                    }, function () {
                        auto_slide();
                    });
                }
            }
        }
        //圓點選張
        function slide_choose() {
            if (slide_num > 1) {
                if (!target.find('.slide').is(':animated')) {
                    slide_next = $(this).index();
                    if (slide_next != slide_now) {
                        if (slide_next > slide_now) {
                            dire = 'right';
                        } else {
                            dire = 'left';
                        }
                        _isDot = true;
                        slide_move();
                        $(this).eq(slide_next).addClass('active').siblings().removeClass('active');
                    }
                    //##### debug #####
                    if (settings.debug == true) {
                        console.log('slide_now = ' + slide_now + '\nslide_next = ' + slide_next);
                    }
                }
            }
        }

        //上一張或下一張
        function slide_change_dire() {
            if (slide_num > 1) {
                if (!target.find('.slide').is(':animated')) {
                    var $this = $(this);
                    var selec_dire = ($this.attr('class').indexOf('left') > 0) ? 0 : 1;
                    if (selec_dire == 1) {
                        if (slide_next == slide_num - 1) {
                            if (settings.cycling == true) {
                                slide_next = 0;
                            } else {
                                return false;
                            }
                        } else {
                            slide_next++;
                        }
                        dire = 'right';
                        //##### debug #####
                        if (settings.debug == true) {
                            console.log('slide_now = ' + slide_now + '\nslide_next = ' + slide_next + '\ndire = ' + dire);
                        }
                    } else if (selec_dire == 0) {
                        if (slide_next == 0) {
                            if (settings.cycling == true) {
                                slide_next = slide_num - 1;
                            } else {
                                return false;
                            }
                        } else {
                            slide_next--;
                        }
                        dire = 'left';
                        //##### debug #####
                        if (settings.debug == true) {
                            console.log('slide_now = ' + slide_now + '\nslide_next = ' + slide_next + '\ndire = ' + dire);
                        }
                    }
                    slide_move();
                }
            }
        }

        //自動播放(控制變數)
        function auto_slide() {
            slide_start = setTimeout(function () {
                dire = 'right';
                if (settings.cycling == true) {
                    if (slide_next == slide_num - 1) {
                        slide_next = 0;
                    } else {
                        slide_next++;
                    }
                    slide_move();
                } else {
                    if (slide_next != slide_num - 1) {
                        slide_next++;
                        slide_move();
                    }
                }
            }, settings.stayTime);
        }

        //位置控制
        function position_ctr() {
            if (dire == 'right') {//右邊進來
                position_left_s = '100%';
                position_left_e = '-100%';
            } else if (dire == 'left') {//左邊進來
                position_left_s = '-100%';
                position_left_e = '100%';
            }
        }

        //移動
        function slide_move() {
            position_ctr();
            target.find('.slide').eq(slide_next).css({
                top: 0,
                left: position_left_s,
                display: 'block'
            }).animate({left: '0'}, settings.speed);
            target.find('.slide').eq(slide_now).animate({left: position_left_e}, settings.speed, function () {
                target.find('.slide').eq(slide_now).css({display: 'none', position: 'absolute'});
                target.find('.slide').eq(slide_next).css({position: 'relative'});
                slide_now = slide_next;
                //##### debug #####
                if (settings.debug == true) {
                    console.log('slide_now = ' + slide_now + '\nslide_next = ' + slide_next);
                }
            });

            if (settings.bullet == true) {
                target.find('.bullet').eq(slide_next).addClass('active').siblings().removeClass('active');
            }
            if (settings.autoPlay == true) {
                clearTimeout(slide_start);
                auto_slide();
            }
            _isDot = false;
            //##### debug #####
            if (settings.debug == true) {
                console.log('slide_now = ' + slide_now + '\nslide_next = ' + slide_next);
            }
        }

        // 觸控功能
        var t_o, t_e,
            _target_id = document.getElementById(target_id),
            device_width = $(window).width(),
            t_now = null, t_next, freeze = false, touchStart = false;
        //觸控開關
        function add_touchEvent() {
            _target_id.addEventListener("touchstart", sc_s, false);
            _target_id.addEventListener("touchmove", sc_m, false);
            _target_id.addEventListener("touchend", sc_e, false);
        }

        function remove_touchEvent() {
            _target_id.removeEventListener("touchstart", sc_s, false);
            _target_id.removeEventListener("touchmove", sc_m, false);
            _target_id.removeEventListener("touchend", sc_e, false);
        }

        if (slide_num > 1) {
            add_touchEvent();
        }
        function sc_s(e) {
            t_e = 0;
            t_o = e.touches[0].pageX;
            if (freeze == false) {
                t_now = slide_now;
                touchStart = true;
            }
            if (settings.autoPlay == true) {
                if (slide_start) {
                    clearTimeout(slide_start);
                }
            }
            //##### debug #####
            if (settings.debug == true) {
                console.log('drag start');
            }
        }

        function sc_m(e) {
            //防止手機下滑重整頁面
            e.preventDefault();
            if (touchStart == true) {
                t_e = parseInt(Math.floor(100 * (e.touches[0].pageX - t_o) / device_width));
                if (t_e > 0) {//左邊進來
                    if (slide_now == 0) {
                        if (settings.cycling == true) {
                            t_next = slide_num - 1;
                        } else {
                            t_e = 0;
                            t_next = null;
                        }
                    } else {
                        t_next = t_now - 1;
                    }
                } else if (t_e < 0) {//右邊進來
                    if (slide_now == slide_num - 1) {
                        if (settings.cycling == true) {
                            t_next = 0;
                        } else {
                            t_e = 0;
                            t_next = null;
                        }
                    } else {
                        t_next = t_now + 1;
                    }
                }
                touch_move(t_e);
            }
            //##### debug #####
            if (settings.debug == true) {
                console.log(t_e);
            }
        }

        function sc_e(e) {
            if (touchStart == true) {
                if (t_e >= 20) {//左邊進來
                    dire = 'left';
                    t_end_next();
                } else if (t_e <= -20) {//右邊進來
                    dire = 'right';
                    t_end_next();
                } else if (t_e > 0 && t_e < 20) {//從左邊歸位
                    dire = 'right';
                    t_end_back();
                } else if (t_e < 0 && t_e > -20) {//從右邊歸位
                    dire = 'left';
                    t_end_back();
                } else if (t_e == 0) {
                    target.find('.slide').eq(t_now).css({left: 0}).siblings('.slide').css('display', 'none');
                }
            }
            touchStart = false;
        }

        function touch_move(t_e) {
            target.find('.slide').eq(t_now).css({top: 0, left: (t_e + '%')});
            if (t_next != null) {
                if (t_e > 0) {
                    target.find('.slide').eq(t_next).css({top: 0, left: (-100 + t_e + '%'), display: 'block'});
                } else {
                    target.find('.slide').eq(t_next).css({top: 0, left: (100 + t_e + '%'), display: 'block'});
                }
            }
        }

        function t_end_back() {
            var end_pos = (dire == 'left') ? 100 : -100;
            freeze = true;
            remove_touchEvent();
            target.find('.slide').eq(t_next).animate({left: (end_pos + '%')}, settings.speed * 0.5);
            target.find('.slide').eq(t_now).animate({left: 0}, settings.speed * 0.5, function () {
                target.find('.slide').eq(t_now).siblings('.slide').css({display: 'none', position: 'absolute'});
                add_touchEvent();
                if (settings.autoPlay == true) {
                    auto_slide();
                }
                freeze = false;
            });
        }

        function t_end_next() {
            var end_pos = (dire == 'left') ? 100 : -100;
            freeze = true;
            remove_touchEvent();
            slide_next = t_next;
            slide_now = slide_next;
            target.find('.bullet').eq(t_next).addClass('active').siblings().removeClass('active');
            target.find('.slide').eq(t_next).animate({left: 0}, settings.speed * 0.5, function () {
                target.find('.slide').eq(t_next).css('position', 'relative').siblings('.slide').css({
                    display: 'none',
                    position: 'absolute'
                });
                add_touchEvent();
                if (settings.autoPlay == true) {
                    auto_slide();
                }
                freeze = false;
            });
            target.find('.slide').eq(t_now).animate({left: (end_pos + '%')}, settings.speed * 0.5);
        }
    }

    $.fn.extend({
        JZlider: function (opt) {
            return this.each(function () {
                slide_ini($(this), opt);
            });
        }
    });
})(jQuery);
