/**
 * Created by JZ on 2015/11/23.
 * JZSlider ver. 0.902.04
 */
(function ($) {
    function slide_ini(target, opt) {
        var slide_num = target.find('.slide').length,
            slide_now = 0, slide_next = 0,
            position_left_s = '100%',
            position_left_e = '-100%',
            _isDot = false,
            target_id = 'jzslider_' + Math.floor(new Date()),
            slide_start, dire;
        //Default values
        var settings = {
            slide_speed: 500,//滑動速度
            stay_time: 5000,//執行間隔
            autoslide: true,//自動播放
            dire_ctr: false,//左右控制開關
            dot_ctr: false,//圓點控制開關
            cycling: true,//循環or停在最後一張
            mouseover_pause: true,//mouseover暫停
            debug: false//debug mode
        };
        $.extend(settings, opt);
        //initialize
        target.find('.slide').wrapAll('<div class="slide_sec"><div class="slidewrap"></div></div>');
        target.find('.slide').eq(0).siblings('.slide').css({display: 'none', position: 'absolute'});
        target.addClass('slidebox');
        target.find('.slidewrap').attr('id', target_id);
        if (settings.debug == true) {
            if ($('#jsliderdebug').index() < 0) {
                $('body').append('<div id="jsliderdebug">debug mode: on</div>')
            }
        }
        if (settings.dot_ctr == true) {
            target.append('<div class="slide_btn_wrap"></div>');
            for (k = 0; k < slide_num; k++) {
                target.find('.slide_btn_wrap').append('<div class="slide_btn"></div>');
            }
            target.find('.slide_btn').bind('click', slide_choose);
            target.find('.slide_btn').eq(slide_next).addClass('btn_active');
        }
        if (settings.dire_ctr == true) {
            target.find('.slide_sec').append('<div class="slide_btn_side slide_btn_left"></div><div class="slide_btn_side slide_btn_right"></div>');
            target.find('.slide_btn_side').bind('click', slide_change_dire);
        }
        if (settings.autoslide == true) {
            if (slide_num > 1) {
                auto_slide();
                if (settings.mouseover_pause == true) {
                    if (settings.debug == true) {
                        document.getElementById('jsliderdebug').innerHTML = 'mouseover_pause on';
                    }
                    target.find('.slide').bind('mouseenter', function () {
                        clearTimeout(slide_start)
                    });
                    target.find('.slide').bind('mouseleave', function () {
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
                        $(this).eq(slide_next).addClass('btn_active').siblings().removeClass('btn_active');
                    }
                    if (settings.debug == true) {
                        document.getElementById('jsliderdebug').innerHTML = 'slide_now = ' + slide_now + '\nslide_next = ' + slide_next
                    }
                }
            }
        }

        //上一張或下一張
        function slide_change_dire() {
            if (slide_num > 1) {
                if (!target.find('.slide').is(':animated')) {
                    var $this = $(this);
                    var selec_dire = ($this.attr('class').indexOf('slide_btn_left') > 0) ? 0 : 1;
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
                        if (settings.debug == true) {
                            document.getElementById('jsliderdebug').innerHTML = 'slide_now = ' + slide_now + '\nslide_next = ' + slide_next + '\ndire = ' + dire
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
                        if (settings.debug == true) {
                            document.getElementById('jsliderdebug').innerHTML = 'slide_now = ' + slide_now + '\nslide_next = ' + slide_next + '\ndire = ' + dire
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
            }, settings.stay_time)
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
            target.find('.slide').eq(slide_next).css({top: 0, left: position_left_s, display: 'block'}).animate({left: '0'}, settings.slide_speed);
            target.find('.slide').eq(slide_now).animate({left: position_left_e}, settings.slide_speed, function () {
                target.find('.slide').eq(slide_now).css({display: 'none', position: 'absolute'});
                target.find('.slide').eq(slide_next).css({position: 'relative'});
                slide_now = slide_next;
                if (settings.debug == true) {
                    $('#jsliderdebug').html('slide_now = ' + slide_now + '\nslide_next = ' + slide_next);
                    //$('#jsliderdebug').html('t_prev = ' + t_prev + ',\nt_now = ' + t_now + ',\nt_next = ' + t_next)
                }
            });

            if (settings.dot_ctr == true) {
                target.find('.slide_btn').eq(slide_next).addClass('btn_active').siblings().removeClass('btn_active');
            }
            if (settings.autoslide == true) {
                clearTimeout(slide_start);
                auto_slide();
            }
            _isDot = false;
            if (settings.debug == true) {
                $('#jsliderdebug').html('slide_now = ' + slide_now + '\nslide_next = ' + slide_next);
                //$('#jsliderdebug').html('t_prev = ' + t_prev + ',\nt_now = ' + t_now + ',\nt_next = ' + t_next)
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
            if (settings.autoslide == true) {
                if(slide_start){
                    clearTimeout(slide_start);
                }
            }
            if (settings.debug == true) {
                console.log('start');
            }
        }

        function sc_m(e) {
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
            if (settings.debug == true) {
                $('#jsliderdebug').html(t_e);
                //$('#jsliderdebug').html('t_e = ' + t_e + '\nt_now = ' + t_now + '\nt_next = ' + t_next);
            }
        }

        function sc_e(e) {
            // e.preventDefault();
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
            target.find('.slide').eq(t_next).animate({left: (end_pos + '%')}, settings.slide_speed * 0.5);
            target.find('.slide').eq(t_now).animate({left: 0}, settings.slide_speed * 0.5, function () {
                target.find('.slide').eq(t_now).siblings('.slide').css({display: 'none', position: 'absolute'});
                add_touchEvent();
                if (settings.autoslide == true) {
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
            target.find('.slide_btn').eq(t_next).addClass('btn_active').siblings().removeClass('btn_active');
            target.find('.slide').eq(t_next).animate({left: 0}, settings.slide_speed * 0.5, function () {
                target.find('.slide').eq(t_next).css('position', 'relative').siblings('.slide').css({display: 'none', position: 'absolute'});
                add_touchEvent();
                if (settings.autoslide == true) {
                    auto_slide();
                }
                freeze = false;
            });
            target.find('.slide').eq(t_now).animate({left: (end_pos + '%')}, settings.slide_speed * 0.5);
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
