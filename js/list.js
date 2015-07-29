jQuery(document).ready(function() {
    var cities = [];
    $.getJSON("json/jsonCities.js")
    .done(function(data) {
        $.each(data, function(i, item) {
            cities.push(item);
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
            list += '<li class="col-sm-4"><a class="item ' + $i + ' ' + $b + '"><span class="cityName">' + item.name + '</span><span class="outbound">' + item.outbound + '</span><span class="inbound">' + item.inbound + '</span></a></li>';
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
        $('.typeahead[data-point="ounboundPoint"]')
        .removeAttr('disabled')
        .typeahead({
            source: cities.filter(function (item) {
                return item.outbound != 0;
            }).map(function(item) {
                return item.name;
            }),
            autoSelect: false
        });
        $('.typeahead[data-point="inboundPoint"]')
        .removeAttr('disabled')
        .typeahead({
            source: cities.filter(function (item) {
                return item.inbound != 0;
            }).map(function(item) {
                return item.name;
            }),
            autoSelect: false
        });
        $('#cityList').siblings('.loader').hide();
    });

    $.getJSON("json/jsonValues.js")
    .done(function(data) {
        var list = '';
        var groups = {};
        $.each(data, function(i, group) {
            groups[group.NAME] = true;
            group.ELEMENTS.map(function (item) {
                list += '<li class="col-sm-4 ' + group.NAME.replace(/\/|\\|\s/g, '-') + '"><span class="item" data-id="' + item.id + '"><span class="cityName">' + item.name + '</span>' +
                    '<span class="count" data-volume="' + item.volume + '">' +
                    '<a href="javascript:void(0);" onclick="updateVolume(this, 1);">+</a> ' +
                    '<input readonly name="goods['+ item.id +']" type="text" value="0">' +
                    ' <a href="javascript:void(0);" onclick="updateVolume(this, -1);">-</a>' +
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

    window.updateVolume = function(el, cnt) {
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
    };

    $('#cityList').on('click', '.item', function(e) {
        var cityPoint = $(this).parents('.hiddenCont').attr('id');
        var itemValue = $('.cityName', this).text();
        $('[data-point="' + cityPoint + '"]').val(itemValue);
        $('.hiddenCont')
        .slideUp()
        .attr('id', cityPoint)
        ;
        $('.dropdown-arr').removeClass('active');
    });

    $('.dropdown-arr, .fake-input').on('click', function(e) {
        var $el = $(this).parents('.control-wrap');
        e.preventDefault();

        if ($(this).hasClass('active')) {
            $('.hiddenCont')
            .slideUp();
            $(this).removeClass('active');
            return false;
        }

        $('.dropdown-arr').removeClass('active');
        $(this).addClass('active');
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

    $('#goodsList').on('click', '.item .cityName', function(){
        var $parentBlock = $(this).parents('.item');
        var $input = $('input', $parentBlock);
        if($(this).parents('.item').hasClass('current') == false) {
            updateVolume($input, 1);
            $(this).parents('.item').addClass('current');
        }
        else {
            $(this).parents('.item').removeClass('current');
            updateVolume($input, -parseInt($input.val()));
        }
    });

    $('[data-toggle="resetCheck"]').on('click', function(){
        $('#goodsList .item.current').each(function(){
            $(this).removeClass('current');
            var $input = $('input', this);
            updateVolume($input, -parseInt($input.val()));
        });
    });
});
