'use strict';
const myApiKey = "w7M56mXGA96et4g2WyUYD5l7AJIBVdYF";
const baseUrl = "https://app.ticketmaster.com/discovery/v2/events/";

//gets paramaters from getEvents func & transforms the key & value (from user) to a string format & sent back to getEvents
function formatQueryPara(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//func displays positive/negative msgs. Append
function displayResults(responseJson) {
  const eventResults = $('#event-results');
  const eventNoResults = $('#event-noresults');

  // clears the result div, error message if there is one present
  eventResults.empty();
  $('#js-error-message').empty();

  // returned response is not Json or response is Json but it doesn't contain object _embedded
  //remove any type of result page if any 1st before displaying response
  const noResults = !responseJson || (responseJson && !responseJson._embedded);
  if (noResults) {
    eventResults.addClass('hidden');
    eventNoResults.removeClass('noresult-hidden');
    eventNoResults.html('No results found');
    resetButton();
    return;
  }
  //if the response has no events, display No result
  //remove any type of result page if any 1st before displaying response
  const { events = [] } = responseJson._embedded;
  if (!events.length) {
    eventResults.addClass('hidden');
    eventNoResults.removeClass('noresult-hidden');
    eventNoResults.html('No results found');
    resetButton();
    return;
  }
  $('#event-noresults').addClass('noresult-hidden');
  eventResults.removeClass('hidden');

  //displays response
  const embeddedEvents = responseJson._embedded.events;
  for (let i = 0; i < responseJson._embedded.events.length; i++) {
    eventResults.append(`
    
    
        <li class="search-results-li">
            <div class="float-item-details">
                <div class="event-item-date-image">
                    <span>${$.format.date(new Date(embeddedEvents[i].dates.start.localDate), "E MMM d")}</span>
                    <img
                        src="${embeddedEvents[i].images[0].url}">
                </div>

                <div class="item-details">
                    <div class="item-header">
                        ${embeddedEvents[i].name}
                    </div>

                    <div class="item-MixInfo">
                        <span>
                            <time>
                                <span>${embeddedEvents[i].dates.start.localTime}</span>
                            </time>
                            -
                            <span class="item-venue-name">
                                ${embeddedEvents[i]._embedded.venues[0].name}
                                ,
                                ${embeddedEvents[i]._embedded.venues[0].address.line1},
                                ${embeddedEvents[i]._embedded.venues[0].city.name}
                            </span>
                        </span>
                    </div>
                    <div class="item-purchase">
                        <a href="${embeddedEvents[i].url}" target="_blank">Purchase event ticket</a>
                    </div>
                </div>
            </div>
        </li>`

    )
  };
  resetButton();
}

//func 
function getEvents(userSearchTerm, userSearchTermCity, maxResults = 10) {
  const params = {
    classificationName: userSearchTerm,
    city: userSearchTermCity,
    size: maxResults,
    apikey: myApiKey
  };
  //func formatQueryPara is called, the params are returned as a URL string which is added to website url + endpoint
  //which will be used to fetch from the API
  const queryString = formatQueryPara(params);
  const appUrl = baseUrl + '?' + queryString;
  console.log(appUrl);

  fetch(appUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(displayResults)
    .catch(err => {
      $('#event-results').addClass('hidden');
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      resetButton();
    });

}
//func creates the reset btn action
function resetButton() {
  $('#reset-btn').on('click', function () {
    $('#event-results').addClass('hidden');
    $('#event-noresults').addClass('noresult-hidden');
    $('#js-error-message').empty();

  });
}
//func captures 3 differnt input from user and sends to getEvents func
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const searchTermCity = $('#js-search-term-city').val();
    const maxResults = $('#js-max-results').val();

    getEvents(searchTerm, searchTermCity, maxResults);
  });
}

$(function () {
  watchForm();
  console.log('doc ready');
})