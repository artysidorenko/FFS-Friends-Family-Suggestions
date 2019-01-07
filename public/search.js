// FFS SUGGESTIONS WEBPAGE - CLIENT SIDE SEARCH PAGE SCRIPT

/* eslint-disable */

(function() {


  window.onload = function()  {
    var searchBtn = document.getElementById('search-submit');
    searchBtn.addEventListener('click', function() {
      submitSearch();
    });
  }

})();

var submitSearch = function () {
  var xhr = new XMLHttpRequest();
  var searchTitle = document.getElementById('search-title').value;
  var searchAuthor = document.getElementById('search-author').value;
  var url = '/searchResults?title=' + searchTitle + '&author=' + searchAuthor;
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      console.log(data);
        var resultsPanel = document.getElementById('results-panel');
        resultsPanel.innerHTML = '';
      if (data.length == 0) {
        var noResults = document.createElement('h4');
        noResults.textContent = 'Query returned zero matches';
        resultsPanel.appendChild(noResults);
      } else if (data[0].inputError) {
        var invalidSearch = document.createElement('h4');
        invalidSearch.textContent = data[0].inputError;
        resultsPanel.appendChild(invalidSearch);
      } else {
        var resultsHeading = document.createElement('h4');
        resultsHeading.textContent = 'Search Results';
        resultsPanel.appendChild(resultsHeading);
        data.forEach(function(item) {
          addSearchHitToDOM(item.id, item.name, item.first_name, item.rating, item.text_content);
        });
      }
    }
  }
  xhr.open('GET', url, true);
  xhr.send();
}

var addSearchHitToDOM = function(subjectId, subject, author, rating, review)  {

  var resultsPanel = document.getElementById('results-panel');

  var resultWrapper = document.createElement('a');
  resultWrapper.href = '/topic?id=' + subjectId;
  resultsPanel.appendChild(resultWrapper);

  var resultTable = document.createElement('table');
  resultTable.classList.add('result-box');
  resultWrapper.appendChild(resultTable);

  var topRow = document.createElement('tr');
  resultTable.appendChild(topRow);

  var topicCell = document.createElement('td');
  var topicLabel = document.createElement('strong');
  topicLabel.textContent = 'Topic: ';
  topicCell.appendChild(topicLabel);
  topicCell.innerHTML += subject;
  topRow.appendChild(topicCell);

  var authorCell = document.createElement('td');
  var authorLabel = document.createElement('strong');
  authorLabel.textContent = 'Author: ';
  authorCell.appendChild(authorLabel);
  authorCell.innerHTML += author;
  topRow.appendChild(authorCell);

  var ratingCell = document.createElement('td');
  var ratingLabel = document.createElement('strong');
  ratingLabel.textContent = 'Rating: ';
  ratingCell.appendChild(ratingLabel);
  ratingCell.innerHTML += rating;
  topRow.appendChild(ratingCell);

  var botRow = document.createElement('tr');
  resultTable.appendChild(botRow);

  var summaryCell = document.createElement('td');
  summaryCell.colSpan = '3';
  var summaryLabel = document.createElement('strong');
  summaryLabel.textContent = 'Review: ';
  summaryCell.appendChild(summaryLabel);
  summaryCell.innerHTML += review.slice(0, 20) + '..';
  botRow.appendChild(summaryCell);

}

/* eslint-enable */
