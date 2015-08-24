var Modules = (function(self){ return self; }(Modules || {}));
$(function() {

  if ($('select').length) {

    $('select').styler();

  };



  $('.fileup').click(function(){

    $('.fileup-hidden').trigger('click');

  });



  $('.fileup-hidden').on('change', function (event, files, label) {

    var file_name = this.value.replace(/\\/g, '/').replace(/.*\//, '')

    $('.fileup').val(file_name);

  });

  if($('.accordion__lk').length){
    new Modules.Accordion({
        $lk: $('.accordion__lk'),
        parent: '.accordion__it',
        cnt: '.accordion__cnt'
      });
  }



});