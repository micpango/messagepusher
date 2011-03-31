var messageListLength;
var currentMessage;
var currentMessageId = 0;
var intervalId = 0;
var messageArray;
var isNewMessage = false;

var NEWMESSAGETIME = 25000;
var OLDMESSAGETIME = 15000;
var ONEHOUR_IN_MS = 3600000;


var server = new Pusher('', 'test_channel');
server.bind('new_message', function(data) {
  var length = messageArray.unshift(data);
  if (length === 10) {
    messageArray.splice(length - 1, 1);
  }
  clearInterval(intervalId);
  isNewMessage = true;
  populateMessageArea(data, true, true);
  intervalId = setInterval(function() {
    showMessage(messageArray);
  }, NEWMESSAGETIME);
});

function showMessage(data) {
  if (isNewMessage) {
    clearInterval(intervalId);
    intervalId = setInterval(function() {
      showMessage(messageArray);
    }, OLDMESSAGETIME);
    isNewMessage = false;
  }
  messageListLength = (data.length >= 10) ? 10 - 1 : data.length - 1;
  currentMessage = data[currentMessageId];
  if (currentMessageId === messageListLength) {
    currentMessageId = 0;
    if (messageListLength === 0) {
      clearInterval(intervalId);
    }
  } else {
    currentMessageId++;
  }

  populateMessageArea(currentMessage, true, false);
}

function populateMessageArea(data, shouldFadeOut, isFresh) {
  var isFresh = checkIfFreshNews(data.dateCreated);
  if (shouldFadeOut) {
    $('#messagearea').fadeOut("fast", function() {
      $('#messagearea').html("<p><span class='title'>" + data.title + "</span>" + (isFresh ? "<span class='news'>NYHET</span>" : "") + "</p><p>" + markdownToHtml(data.content) + "</p><br/><span class='info'>Posted " + getFormattedDate(data.dateCreated) + " by " + data.user + "</span>");
    });
    $('#messagearea').fadeIn("fast");
  } else {
    $('#messagearea').html("<p><span class='title'>" + data.title + "</span>" + (isFresh ? "<span class='news'>NYHET</span>" : "") + "</p><p>" + markdownToHtml(data.content) + "</p><br/><span class='info'>Posted " + getFormattedDate(data.dateCreated) + " by " + data.user + "</span>");
  }
}

function markdownToHtml(markdown) {
  return new Showdown.converter().makeHtml(markdown);
}

function checkIfFreshNews(date) {
  var timeDifference = new Date().getTime() - new Date(date).getTime();
  if (timeDifference > ONEHOUR_IN_MS) {
    return false;
  }
  return true;
}

function getFormattedDate(date) {

  var m_names = new Array("januar", "februar", "mars",
            "april", "mai", "juni", "juli", "august", "september",
            "oktober", "november", "desember");

  var d = new Date(date);
  return d.getDate() + ". " + m_names[d.getMonth()] + ", " + d.getFullYear() + " " + d.getHours() + ":" + getFullMinutes(d.getMinutes());
}

function getFullMinutes(minutes) {
  if (minutes > 9) {
    return minutes;
  } else {
    return "0" + minutes;
  }
}

$(document).ready(function() {

  $.getJSON("./messages",
    function(data) {
      if (data[0]) {
        populateMessageArea(data[0], false, false);
        messageArray = data;

        if(data[1]) {
          currentMessageId = 1;
        }

        intervalId = setInterval(function() {
          showMessage(messageArray);
        }, OLDMESSAGETIME);
      } else {
        $('#messagearea').html("<h1>No messages in DB!</h1>");
        messageArray = new Array();
      }
  });
});