'use strict';
const myApiKey = "w7M56mXGA96et4g2WyUYD5l7AJIBVdYF";
const baseUrl = "https://app.ticketmaster.com/discovery/v2/events/";


function formatQueryPara(params){
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  const eventResults = $('#event-results');
  eventResults.removeClass('hidden');
  eventResults.empty();
  $('#js-error-message').empty();
  
  const noResults = !responseJson || (responseJson && !responseJson._embedded);
  if (noResults) {
    eventResults.html('No Results');
    return;
  }
  const {events = []}  = responseJson._embedded;
  if (!events.length) {
    eventResults.html('No Results');
    return;
  }

  const embeddedEvents = responseJson._embedded.events;
  for (let i=0; i<responseJson._embedded.events.length; i++) {
    eventResults.append(`
      <ol>
        <li><h3>${embeddedEvents[i].name}</h3>
            <img src="${embeddedEvents[i].images[0].url}">
            <p><a href="${embeddedEvents[i].url}" target="_blank">Purchase event ticket</a></p>
            <p>${embeddedEvents[i]._embedded.venues[0].address.line1}</P>
            <p>${embeddedEvents[i]._embedded.venues[0].city.name}</p>
            <p>${embeddedEvents[i].dates.start.localDate}</p>
            <p>${embeddedEvents[i].dates.start.localTime}</p>
        </li>
      </ol>`
    )};
  // alternative 
  //const eventNames = events.map(x => x.name).join();
  // eventResults.html(eventNames);
}


function getEvents(userSearchTerm, userSearchTermCity, maxResults=10){
  
    const params = {
        classificationName: userSearchTerm,
        city: userSearchTermCity,
        size: maxResults,
        apikey: myApiKey
    };
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
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });

}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const searchTermCity = $('#js-search-term-city').val();
        const maxResults = $('#js-max-results').val();
                 
        getEvents(searchTerm, searchTermCity, maxResults);
    });  
}

$(function() {
    watchForm();
    console.log('doc ready');
})