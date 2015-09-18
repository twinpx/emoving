jQuery(document).ready(function() {
    var cities = [];
    $.getJSON("/json/jsonCities.js")
    //$.getJSON("http://emoving.2px.ru/json/jsonCities.js")
    .done(function(data) {
        var cities = data.map(function (it) {
            return it;
        });
        var outCities = cities.filter(function (item) {
                return item.outbound != 0;
            });

        var inCities = cities.filter(function (item) {
            return item.inbound != 0;
        });

        var list = '';
        cities.map(function(item) {

            var $i = '';
            var $b = '';
            if (item.outbound == '0') {
                $i = 'outbound-null';
            }
            if (item.inbound == '0') {
                $b = 'inbound-null';
            }
            list += '<li class="col-sm-4"><a data-id="'+item.id+'" class="item ' + $i + ' ' + $b + '"><span class="cityName">' + item.name + '</span><span class="outbound">' + item.outbound + '</span><span class="inbound">' + item.inbound + '</span></a></li>';
            return item;
        });
        $('#cityList')
        .append(list)
        .listnav({
            includeNums: false,
            includeAll: false,
            showCounts: false,
            preClick: function () {
                $('#cityList').siblings('.loader').show();
            },
            onClick: function () {
                $('#cityList').siblings('.loader').hide();
            }
        });
        $('.hiddenCont').on('click', '#cityList-nav a', function() {
            $('#cityList').scrollTop(0);
        });
        var commonTypeaheadOptions = {
            matcher: function (item) {
                return ~item.replace(/<span>\d+<\/span>/gi,'').toLowerCase().indexOf(this.query.toLowerCase());
            },
            highlighter: function (item) {
                var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                var num = item.match(/<span>(\d+)<\/span>/);
                return item.replace(/<span>\d+<\/span>/gi,'').replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                        return '<strong>' + match + '</strong>';
                    }) + (num&&num.length?('<span>'+num[1]+'</span>'):'');
            },
            onSelect: function (o) {
                var el = this.$element;
                setTimeout(function () {
                    el&&el.val(o.value).change();
                }, 10);
            },
            sorter: function(items){
                return items.sort(function(a, b){
                    if(a.sort < b.sort) return 1;
                    if(a.sort > b.sort) return -1;
                    return 0;
                });
            },
            autoSelect: false
        };
        $('.typeahead[data-point="ounboundPoint"]')
        .removeAttr('disabled')
        .typeahead($.extend({}, commonTypeaheadOptions, {
            source: outCities.map(function(item) {
                return {
                    id: item.name,
                    name : item.name + '<span>'+ item.outbound + '</span>',
                    sort: item.outbound
                };
            }),
            $element: $('.typeahead[data-point="ounboundPoint"]')
        }));
        $('.typeahead[data-point="inboundPoint"]')
        .removeAttr('disabled')
        .typeahead($.extend({}, commonTypeaheadOptions, {
            source: inCities.map(function(item) {
                return {
                    id: item.name,
                    name : item.name + '<span>'+ item.inbound + '</span>',
                    sort: item.inbound
                };
            }),
            $element: $('.typeahead[data-point="inboundPoint"]')
        }));
        $('#cityList').siblings('.loader').hide();
    });

    // $.getJSON("json/jsonValues.js")
    $.getJSON("/json/jsonValues.js")
    .done(function(data) {
        var list = '';
        var groups = {};
        $.each(data, function(i, group) {
            groups[group.NAME] = true;
            group.ELEMENTS.map(function (item) {
                list += '<li class="col-sm-4 ' + group.NAME.replace(/\/|\\|\s/g, '-') + '"><span class="item" data-id="' + item.id + '"><span class="cityName">' + item.name + '</span>' +
                    '<span class="count" data-volume="' + item.volume + '">' +
                    '<a href="javascript:void(0);" onclick="updateVolume(this, -1);" class="count_type_minus"></a> ' +
                    '<input readonly name="goods['+ item.id +']" type="text" value="0">' +
                    ' <a href="javascript:void(0);" onclick="updateVolume(this, +1);" class="count_type_plus"></a>' +
                    '</span>' +
                    '</span></li>';
            });
            return group;
        });

        var groupList = '<a class="all ln-selected">ALL</a>';
        $.each(groups, function(item) {
            groupList += '<a>' + item + '</a>';
        });
        var $list = $('#goodsList')
        .append(list);

        $('<div id="goodsList-nav" class="listNav ln-letters"/>').insertBefore($list);
        $('#goodsList-nav')
        .append(groupList)
        .on('click', 'a', function() {
            $('#goodsList-nav .ln-selected').removeClass('ln-selected');
            $(this).addClass('ln-selected');
            if ($(this).hasClass('all')) {
                $list.find('li').show();
            } else {
                $list.find('li').hide().filter('.' + $(this).text().replace(/\/|\\|\s/g,'-')).show();
            }
            $list.scrollTop(0);
        });
        $list.siblings('.loader').hide();
    });


    $('.search-filter button[type="submit"]').on('click', function(e){

        var val_1 = $('input[data-point="ounboundPoint"]').val();
        var val_2 = $('input[data-point="inboundPoint"]').val();

        var id_1 = '',
            id_2 = '';

        $.each($('a.item'), function(index, val) {
            
            if($.trim($(this).children('.cityName').text()) == $.trim(val_1))
                id_1 = $(this).data('id');
        });

        $.each($('a.item'), function(index, val) {

            if($.trim($(this).children('.cityName').text()) == $.trim(val_2))
                id_2 = $(this).data('id');
        });

        $('input[data-point="ounboundPoint_h"]').val(id_1)
        $('input[data-point="inboundPoint_h"]').val(id_2)

    });

    window.updateVolume = function(el, cnt){
        var $el = $(el).parent('.count');
        var count = $el.find('input[type=text]').val();
        var updateValue = parseInt(count) + cnt;
        if (updateValue == 0) {
            $el.parents('.item').removeClass('current');
        }
        if (updateValue < 0) {
            return false;
        }
        $el.find('input[type=text]').val(updateValue);
        var volume = parseFloat($('#volume').val()) || 0;
        $('#volume').val((volume + parseFloat($el.data('volume')) * cnt).toFixed(2));

        var name = $.trim($el.prev('.cityName').text());

        if(updateValue == 0)
            delete chose_obj[name];

        if(name in chose_obj){
            chose_obj[name] = parseInt(chose_obj[name]) + cnt;
        }

        addToFakeInput()
            
    };

    $('#cityList').on('click', '.item', function(e){
        var cityPoint = $(this).parents('.hiddenCont').attr('id');
        var itemValue = $('.cityName', this).text(),
            city_id = $(this).data('id');

        $('[data-point="' + cityPoint + '"]').val(itemValue);
        $('[data-point="' + cityPoint + '_h"]').val(city_id);
        $('.hiddenCont').slideUp().attr('id', cityPoint);

        $('.dropdown-arr').removeClass('active');

    });

    $('body').on('click', function(e){
        var e = e || event;
        var $input = $('.fake-input.active'),
            $drop_ico = $('.dropdown-arr.active');

        if(!$input.length)
            $input = $drop_ico.siblings('input')

        if($drop_ico.length && $('div[data-type="'+$input.data('type')+'"]').is(':visible')){

            if(e.target !== $input[0] && e.target !== $drop_ico[0] && e.target !== $('div[data-type="'+$input.data('type')+'"]')[0] && !$(e.target).closest('div[data-type="'+$input.data('type')+'"]').length){
           
                 if ($('.dropdown-arr, .fake-input').hasClass('active')) {
                    $('.hiddenCont')
                    .slideUp();
                    $('.dropdown-arr, .fake-input').removeClass('active');
                    return false;
                }
            }
        }
    })

    $('.dropdown-arr, .fake-input').on('click', function(e) {
        var $el = $(this).parents('.control-wrap');
        e.preventDefault();

            if ($(this).hasClass('active')) {
                $('.hiddenCont')
                .slideUp();
                $(this).removeClass('active');

                if($(this).hasClass('dropdown-arr') && !$(this).siblings('.dropdown-menu').length){
                    $('.fake-input').removeClass('active');
                }else if($(this).hasClass('.fake-input') && !$(this).siblings('.dropdown-menu').length){
                    $('.dropdown-arr').removeClass('active');
                }

                return false;
            }

            $('.dropdown-arr').removeClass('active');

             if($(this).hasClass('dropdown-arr') && !$(this).siblings('.dropdown-menu').length){
                    $('.fake-input').removeClass('active');
                }else if($(this).hasClass('.fake-input') && !$(this).siblings('.dropdown-menu').length){
                    $('.dropdown-arr').removeClass('active');
                }

            $(this).addClass('active');

             if($(this).hasClass('dropdown-arr') && !$(this).siblings('.dropdown-menu').length){
                $(this).siblings().addClass('active');
            }else if($(this).hasClass('fake-input') && !$(this).siblings('.dropdown-menu').length){
                $(this).siblings().addClass('active');
            }

            if ($('input', $el).data('type') == 'location') {
                var $cityPoint = $('input', $el).data('point');
                $('.hiddenCont')
                .slideUp()
                .filter('[data-type="location"]')
                .attr('id', $cityPoint)
                .slideDown();
            } else {
                $('.hiddenCont')
                .slideUp()
                .filter('[data-type="logguage"]')
                .slideDown();
            }
    });
    $('[data-toggle="closePopup"]').on('click', function(){
        $('.hiddenCont').slideUp(function(){
            $('.dropdown-arr').removeClass('active');
        });
    });

    /**
        var chose_obj = {};
        updateVolume
    */

    var chose_obj = {};

    $('#goodsList').on('click', '.item .cityName', function(){
        var $parentBlock = $(this).parents('.item');
        var $input = $('input', $parentBlock);
        if($(this).parents('.item').hasClass('current') == false) {
            updateVolume($input, 1);
            $(this).parents('.item').addClass('current');
            chose_obj[$.trim($(this).text())] = 1;

            addToFakeInput();
        }
        else {
            $(this).parents('.item').removeClass('current');
            updateVolume($input, -parseInt($input.val()));

            delete chose_obj[$.trim($(this).text())];

            addToFakeInput();
        }
    });


    function addToFakeInput(){
        var string = "";

        for (prop in chose_obj){
            if(!string)
                string = chose_obj[prop];
            else
                string += "+"+chose_obj[prop];
        }

        $('.fake-input[data-type="logguage"]').text(string);
    }

    $('[data-toggle="resetCheck"]').on('click', function(){
        $('#goodsList .item.current').each(function(){
            $(this).removeClass('current');
            var $input = $('input', this);
            updateVolume($input, -parseInt($input.val()));
            
        });

           if ($('.dropdown-arr, .fake-input').hasClass('active')) {
                $('.hiddenCont').slideUp();
                   $('.dropdown-arr, .fake-input').removeClass('active');
            }
    });

    $('.search-filter button[type="submit"]').on('click', function(e){
        var $in_1 = $('input[data-point="ounboundPoint"]'), 
            $in_2 = $('input[data-point="inboundPoint"]'),
            trigg_1 = false,
            trigg_2 = false,
            $obj = '';

        $.each($('.location__w .cityName'), function(index, val) {
            $obj = $(this);

            if($.trim($obj.text()) == $in_1.val())
                trigg_1 = true;

            if($.trim($obj.text()) == $in_2.val())
                trigg_2 = true;

            if(trigg_1 && trigg_2)
                return;
        });


        if(!trigg_1 && $in_1.val()){
            $in_1.addClass('input_error');
            if(!$('.error_type_hide').is(':visible'))
                $('.error_type_hide').show();

            e.preventDefault();
        }

        if(!trigg_2 && $in_2.val()){
            $in_2.addClass('input_error');
            if(!$('.error_type_hide').is(':visible'))
                $('.error_type_hide').show();

             e.preventDefault();
        }

    });

    $(document).on('focus', '.input_error', function(){
        if($('.input_error').length == 1)
            $('.error_type_hide').hide();

        $(this).removeClass('input_error');
    })

});
