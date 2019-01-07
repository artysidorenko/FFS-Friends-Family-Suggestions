// FFS SUGGESTIONS WEBPAGE - CLIENT SIDE TOPIC PAGE SCRIPT

/* eslint-disable */

/*************************/
// EVENT CYCLE: add description
/*************************/



window.onload = function()  {
  var postBtn = document.getElementById('post-button');
  postBtn.addEventListener('click', function()  {
    var postAuthor = 1;
    var postText = document.getElementById('post-text');
    postData(postAuthor, postText.value);
  });
};

document.addEventListener('DOMContentLoaded', function () {
  var suggestionId = window.location.search.substring(1).split('=');
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200){
      console.log(xhr.responseText);
      var data = JSON.parse(xhr.responseText);
      populateTopicInfo(data);
      fetchCommentData(suggestionId[1]);
    }
  }
  xhr.open('GET', '/details/' + suggestionId[1], true);
  xhr.send();
});

var fetchCommentData = function(topicId) {
  var xhr2 = new XMLHttpRequest();
  xhr2.onreadystatechange = function() {
    if (xhr2.readyState === 4 && xhr2.status === 200) {
      var data = JSON.parse(xhr2.responseText);
      console.log(data);
      var commentsPanel = document.getElementById('comments-panel');
      commentsPanel.innerHTML = '<h4>User Comments:</h4>';
      data.forEach(function(comment) {
        populateComments(comment);
      });
    }
  }
  xhr2.open('GET', '/comments/' + topicId, true);
  xhr2.send();
}

var postData = function(author, comment) {
  var suggestionId = window.location.search.substring(1).split('=');
  var xhr3 = new XMLHttpRequest();
  var payload = [author, comment];
  xhr3.onreadystatechange = function()  {
    location.reload(true);
  }
  xhr3.open('POST', '/postcomment/' + suggestionId[1], true);
  xhr3.send(JSON.stringify(payload));
};

var populateTopicInfo = function(data)  {
  var pageTitle = document.getElementById('nav-span');
  pageTitle.textContent += data.name;
  var topicInfo = document.getElementById('topic-name');
  topicInfo.textContent = data.name;
  var topicAuthor = document.getElementById('topic-author');
  topicAuthor.textContent = data.first_name + ' ' + data.surname;
  var topicRating = document.getElementById('topic-rating');
  topicRating.textContent = data.rating + '/10';
  var topicReview = document.getElementById('topic-review');
  topicReview.textContent = data.text_content;
};

var populateComments = function(comment) {
  var commentsPanel = document.getElementById('comments-panel');
  var commentBox = document.createElement('article');
  commentsPanel.appendChild(commentBox);
  var commentAuthor = document.createElement('u');
  commentAuthor.textContent = 'From: ' + comment.first_name;
  commentBox.appendChild(commentAuthor);
  var commentMsg = document.createElement('p');
  commentMsg.textContent = comment.text_content;
  commentBox.appendChild(commentMsg);
}

/* eslint-enable */
