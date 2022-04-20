import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

//DONE: Enter your API Key
// DONE : render map to page to page
// DONE : OnUserClick New Location Pickd  // location lat lng createdAt updatedAt
// DONE : SAVE TO gLocations STORAGE {id, name,lat, lng, weather, createdAt, updatedAt}
// DONE : LOCATION TABLE
// DONE:  GO / DELETE
// DONE : onGoToMyLocation() Ori
// DONE : SAVE TO LOCAL STORAGE {gLocations }  Alex
// DONE : onCopyLink() {(lat)/(lng)}
// DONE : onUserSearchCity() Alex
// TODO : BONUSES then(Weather)
// TODO : MarkerByDesign !!!!!
// TODO : UI shall look nice and responsive

window.app = {
  onInit,
  onGetUserPos,
  onPanTo,
  onCopyLoc,
  onDeleteLoc,
  onUserSearch,
  //  onMapClick
}

function onInit() {
  mapService
    .initMap()
    .then((map) => map.addListener('dblclick', onMapClick))
    .then(() => {
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      })

      mapService.addMarkers()
      renderLocations()
      const { lat, lng } = params

      if (lat && lng) {
        mapService.addMarker({ lat: +lat, lng: +lng }, false)
        mapService.panTo(lat, lng)
      } else {
        mapService.goToFirstLocation()
      }
    })
    .catch(() => console.log('Error: cannot init map'))
}

function onMapClick(ev) {
  mapService.mapClick(ev).then(renderLocations)
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      mapService.panTo(pos.coords.latitude, pos.coords.longitude)
    })
    .catch((err) => {
      alert("couldn't get your location.\nmake sure you allow google maps")
    })
}

function renderLocations() {
  locService.getLocs().then((locations) => {
    const strHtml = locations.map(
      (loc) => `
        <article>
          <p>${loc.name}</p>
          <button class="icon-btn go" onclick="app.onPanTo('${loc.id}')">Go</button>
          <button class="icon-btn copy" onclick="app.onCopyLoc('${loc.id}')"><img src="img/icons/copy.png" alt="Delete" title="Copy location URL"></button>
          <button class="icon-btn trash" onclick="app.onDeleteLoc('${loc.id}')"><img src="img/icons/trash.png" alt="Delete" title="Delete location"></button>
        </article>
      `
    )

    document.querySelector('.locations-table').innerHTML = strHtml.join('')
  })
}

function onPanTo(locId) {
  mapService.panToByLocId(locId)
}

function onDeleteLoc(locId) {
  locService.deleteLocById(locId)
  renderLocations()
}

function onCopyLoc(locId) {
  const loc = locService.getLocById(locId)
  const url = `https://alexyakovlevca.github.io/travel-tip?lat=${loc.lat}&lng=${loc.lng}`
  navigator.clipboard.writeText(url)
}

function onUserSearch(ev) {
  ev.preventDefault()
  var input = document.querySelector('.input-search')
  if (!input.value) return

  mapService.searchOnMap(input.value)
  input.value = ''
  renderLocations()
}
