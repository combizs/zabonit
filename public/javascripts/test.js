$(document).ready(function (){
  var url = 'comments';
  var regex = /(<([^>]+)>)/ig;

  var fetchUrl = function(domain) {
    if(domain){
      var jsonData = {'url': $('input.url').val()};
      $.ajax({
        url: 'http://127.0.0.1:3000/website',
        data: jsonData,
        dataType: 'json',
        success: function(data) {
          var content = data.content;
          content = content.replace(regex, '').replace(/\\n/g, ' ').replace('/\\t/g','');
          $('#targetdiv').empty().append(content).data('id', data.id);
          $('#showComments').text('');

          jsonData = {'website': data.id};
          $.ajax({
            url: 'http://127.0.0.1:3000/comment',
            data: jsonData,
            dataType: 'json',
            success: function(data){
              for(var i = 0; i < data.comments.length; i++){
                $('#showComments').prepend('<div id=\'comment_'+data.comments[i].id+'\' class=\'commentary\'>'+data.comments[i].content+'</div>');
                $('#comment_'+data.comments[i].id).data('data', {'start': data.comments[i].start, 'end': data.comments[i].end});
              }
            },
            error: function(err) {
              console.log("Did not load anything");
            }
          });
        },
        error: function(data) {
          console.log(data);
        }
      });
    }
    // else {
    //   $('input.url').addClass('error');
    // }
  };

  // $('button.submit').on('click', function(event) {
  //   fetchUrl($('input.url').val());
  // });

  $('input.url').on('keyup', function(event) {
    var key = event.keyCode;

    if (key === 13) {
      fetchUrl($('input.url').val());
    }
    return false;
  });
  
  $('#writeComment').on('keyup', function(event) {
    var key = event.keyCode;

    if (key === 13) {
      writeComment($('#writeComment').val());
      $('#writeComment').val('');
    }
    return false;
  });
  var writeComment = function(comment) {
    if(comment){
      var selected = '';
      
      //need to write blank content to data of writeComment
      if($('#writeComment').data().data.content) {
        selected = $('#writeComment').data().data.content;
      }

      var jsonData = {
        content: $('#writeComment').val(),
        parent: 0,
        selected: selected,
        website: $('#targetdiv').data().id,
        start: $('#writeComment').data().data.start,
        end: $('#writeComment').data().data.end
      }
      $.ajax({
        url: 'http://127.0.0.1:3000/comment',
        dataType: 'json',
        data: jsonData,
        type: 'POST',
        success: function(data){
          $('#showComments').prepend('<div id=\'comment_'+data.id+'\' class=\'commentary\'>'+data.comment+'</div>');
          $('#comment_'+data.id).data('data', {'start': data.start, 'end': data.end});
          $('.remove').trigger('click');
        },
        error: function() {
          console.log("ERR");
        }
      });
    }
    else {
      console.error('add css to highlight input box and add message');
    }
  };

  // $('button.comment').on('click', function() {
  //   writeComment($('#writeComment').val());
  //   $('#writeComment').val('');
  // });
  var startid = '';
  var endid = '';
  $('#targetdiv').on('mousedown', function(e){
    if($(event.target).hasClass('fetch')) {
      startid = e.target.id;
    }
  });

  $(document).on('click', '.remove', function(e){
    e.preventDefault();
    $('#writeComment').data('data', {'content':'', 'start': 0, 'end': 0});
    $('.comm').remove();
  });

  $(document).on('mouseover', '.commentary', function(){
    getHighlight($(this).data().data.start, $(this).data().data.end);
    if($(this).data().data.start !== $(this).data().data.end) {
      $('#targetdiv').css({'color':'#ccc'});
    }
  });

  $(document).on('mouseout', '.commentary', function(){
    $('#targetdiv').html($('#targetdiv').text().replace(regex, ''));
    $('#targetdiv').css({'color':'#000'});
  });

  $('#targetdiv').on('mouseup', function(e){
    if($(event.target).hasClass('fetch')){
      endid = e.target.id; 
    }
    if(startid === endid) {
      getSelectionHtml(e.pageX, e.pageY);
      startid = '';
      endid = '';
    }
  });

  var getHighlight = function(tStart, tEnd) {
    var getHtml1 = $('#targetdiv').html().replace(regex, '').substring(0, (tStart))+'<a href=\'#\' class=\'addComment\'><span>';
    var getHtml2 = $('#targetdiv').html().replace(regex, '').substring(tStart, (tEnd));
    var getHtml3 = '</span></a>'+$('#targetdiv').html().replace(regex, '').substring(tEnd);
    
    $('#targetdiv').html(getHtml1+getHtml2+getHtml3);
  }

  var getSelectionHtml = function(x, y) {
    var html = '';
    if (typeof !window.getSelection) {
      var sel = window.getSelection();
      if (sel.rangeCount) {
        var container = document.createElement('div');
        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        html = container.innerHTML;
      }
    }
    else if (typeof !document.selection) {
      if (document.selection.type == 'Text') {
        html = document.selection.createRange().textContent;       
      }
    }

    var mainDiv = document.getElementById('targetdiv');
    var sel = getSelectionCharOffsetsWithin(mainDiv);

    if(sel.end !== sel.start) {

      var getHtml1 = $('#targetdiv').html().replace(regex, '').substring(0, (sel.start))+'<a href=\'#\' class=\'addComment\'><span>';
      var getHtml2 = $('#targetdiv').html().replace(regex, '').substring(sel.start, (sel.end));
      var getHtml3 = '</span></a>'+$('#targetdiv').html().replace(regex, '').substring(sel.end);

      $('#targetdiv').html(getHtml1+getHtml2+getHtml3).css({'color':'#ccc'});
      var $w = $('#targetdiv a');
      // $('#addComment').remove();
      
      $('.comm').remove();
      // $('body').append('<div id=\'addComment\' style=\'top:'+Math.floor(y-48)+'px; left:'+Math.floor((x - 24))+'px\'></div>');
      $('#writeComment').data('data', {'content':getHtml2, 'start':sel.start, 'end':sel.end});
      $('#hold').html('<div class=comm><a class=\'remove\' href=\'#\'><span class=\'remove\'>X</span>'+getHtml2+'</a></div>');
    }
  }
  $('body').on('click', function() {
    $('#targetdiv').html($('#targetdiv').text().replace(regex, ''));
    $('#targetdiv').css({'color':'#000'});
    // $('#addComment').remove();
  });

  var getSelectionCharOffsetsWithin = function(element) {
    var start = 0, end = 0;
    var sel, range, priorRange;

    if (typeof !window.getSelection) {
      range = window.getSelection().getRangeAt(0);
      priorRange = range.cloneRange();
      priorRange.selectNodeContents(element);
      priorRange.setEnd(range.startContainer, range.startOffset);
      start = priorRange.toString().length;
      end = start + range.toString().length;
    }

    else if (typeof !document.selection && (sel = document.selection).type != 'Control') {
      range = sel.createRange();
      priorRange = document.body.createTextRange();
      priorRange.moveToElementText(element);
      priorRange.setEndPoint('EndToStart', range);
      start = priorRange.text.length;
      end = start + range.text.length;
    }

    return {
      start: start,
      end: end
    };
  }

});
