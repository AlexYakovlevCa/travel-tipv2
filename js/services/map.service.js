import { locService } from './loc.service.js'
import { utilService } from './utils.service.js'
import { apiService } from '../api-keys/api.service.js'



export const mapService = {
  initMap,
  goToFirstLocation,
  addMarker,
  addMarkers,
  deleteMarkerById,
  panTo,
  panToByLocId,
  mapClick,
  searchOnMap,
}

let gMap = {}
const gMarkers = []

function initMap(lat = 32.0749831, lng = 34.9120554) {
  return _connectGoogleApi().then(() => {
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    })
    return gMap
  })
}

function goToFirstLocation() {
  locService.getLocs().then((locs) => panTo(locs[0].lat, locs[0].lng))
}

function addMarkers() {
  locService.getLocs().then((locs) => {
    locs.forEach((loc) => {
      addMarker({ lat: loc.lat, lng: loc.lng }, loc.name, true, loc.id)
    })
  })
}

function addMarker(loc, title, isSave, currId = null) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title,
  })
  if (isSave) gMarkers.push({ id: currId, marker })
  return marker
}

function getMarkerById(id) {
  return gMarkers.find((marker) => marker.id === id).marker
}

function deleteMarkerById(id) {
  const marker = getMarkerById(id)
  marker.setMap(null)

  const markerIdx = gMarkers.findIndex((marker) => marker.id === id)
  gMarkers.splice(markerIdx, 1)
}

function panTo(lat, lng) {
  const laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function panToByLocId(locId) {
  const { lat, lng } = locService.getLocById(locId)
  panTo(lat, lng)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()
  var elGoogleApi = document.createElement('script')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${apiService.getGoogleMapApi()}`
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject('Google script failed to load')
  })
}

function placeMarkerAndPanTo(loc) {
  const latLng = { lat: loc.lat, lng: loc.lng }
  panTo(latLng)
  addMarker(latLng, loc.name, true, loc.id)
}

function mapClick(ev) {
  let lat = ev.latLng.lat()
  let lng = ev.latLng.lng()
  let currId = utilService.makeId()

  return axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyA7svj7Pw0bEG5od8w7lW9Mu8zKhfCMDrA`
    )
    .then((res) => ({
      id: currId,
      name:
        res.data.results[0].address_components[3].long_name +
        ' ' +
        res.data.results[0].address_components[2].long_name,
      lat,
      lng,
    }))
    .then((location) => {
      placeMarkerAndPanTo(location)
      return location
    })
    .then(locService.addLocation)
}

function searchOnMap(address) {
  var geocoder = new google.maps.Geocoder()
  geocoder.geocode(
    {
      address,
    },
    function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var lat = results[0].geometry.location.lat()
        var lng = results[0].geometry.location.lng()
        let currId = utilService.makeId()
        panTo(lat, lng)
        addMarker({ lat, lng }, address, true, currId)
        locService.addLocation({ id: currId, lat, lng, name: address })
      } else {
        alert('Something got wrong ' + status)
      }
    }
  )
}
