$(function() {
  function file_too_big() {
    $('.status').hide().text("Umm, this is a little embarrasing.. That file is just too big for me...").fadeIn().fadeOut(5000);
  }
  function partify(){
    if ($('#wut').attr('src') === undefined) {return}
    if ($('#boring').get(0).files.length == 0) {return}
    if ($('#boring').get(0).files[0].size > 1024 * 128) {
      file_too_big();
      return;
    }
    $('.status').hide().text("Please hold...").fadeIn(0);
    var jform = new FormData();
    jform.append('boring', $('#boring').get(0).files[0]);
    jform.append('contrast', $('#contrast').val());
    jform.append('duration', (parseInt($('#duration').attr('max')) + parseInt($('#duration').attr('min'))) - $('#duration').val());
    jform.append('slack_resize', $('#slack_resize').is(':checked'));
    jform.append('such_a_square', $('#such_a_square').is(':checked'));
    $('.controls').fadeIn();

    if ($('#slack_resize').is(':checked')) {
      $('#wut').css('width', '');
    }
    else {
      $('#wut').css('width', '100%');
    }
    $.ajax({
      url: '/partify',
      type: 'POST',
      processData: false,
      contentType: false,
      xhr:function(){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        return xhr;
      },
      data: jform
    }).done(function(d){
      $('.status').hide();
      var url = window.URL || window.webkitURL;
      $('#wut').attr('src', url.createObjectURL(d));
      $('#wut').fadeIn();
    }).fail(function(xhr){
      if (xhr.status === 413) {file_too_big()}
      else if (xhr.status === 415) {
        $('.status').hide().text("What is this monstrosity? Try uploading an image instead!").fadeIn().fadeOut(5000);
      }
      else {
        console.log(xhr);
      }
    });
  };
  $('#contrast').change(function(){partify()});
  $('#duration').change(function(){partify()});
  $('#slack_resize').change(function(){partify()});
  $('#such_a_square').change(function(){
    if ($('#such_a_square').is(':checked')) {
      $('body').css('background-size', '0 0');
      $('#contrast').prop('disabled', true);
      $('#duration').prop('disabled', true);
    }
    else {
      $('body').css('background-size', 'auto');
      $('#contrast').prop('disabled', false);
      $('#duration').prop('disabled', false);
    }
    partify();
  });

  $('#boring').change(function(){partify()});
  $('#upload').click(function(){
    $('#wut').fadeOut(400,
      function() {$('#wut').attr('src', '')}
    );
    $('.controls').fadeOut();
    $('#boring').click();
  });
});
