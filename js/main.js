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



});