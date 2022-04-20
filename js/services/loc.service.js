import { localStrg } from './local-storage-service.js'
import { mapService } from './map.service.js'
import { utilService } from './utils.service.js'

export const locService = {
  getLocs,
  getLocById,
  deleteLocById,
  addLocation,
}

const KEY = 'locationDB'
const gLocations = localStrg.load(KEY) || []


function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!gLocations || gLocations.length === 0) {
        _addLocations()
        mapService.addMarkers()
        resolve(gLocations)
      } // else is not need Here only to go easy on the eyes....
      else resolve(gLocations)
    }, 500)
  })
}

function addLocation(loc) {
  gLocations.push(loc)
  localStrg.save(KEY, gLocations)
}

function getLocById(locId) {
  return gLocations.find((loc) => loc.id === locId)
}

function deleteLocById(locId) {
  const locIdx = gLocations.findIndex((loc) => loc.id === locId)
  gLocations.splice(locIdx, 1)
  localStrg.save(KEY, gLocations)
  
  mapService.deleteMarkerById(locId)
}

function _addLocations() {
  return [
    addLocation({ id: utilService.makeId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384 }),
    addLocation({ id: utilService.makeId(), name: 'promiana', lat: 30.576532406720688, lng: 34.7612316710435 }),
    addLocation({ id: utilService.makeId(), name: 'DodaSha', lat: 32.00971417288501, lng: 34.78175231006968 }),
    addLocation({ id: utilService.makeId(), name: 'WaWa', lat: 31.00971417288501, lng: 34.78175231006968 }),
  ]
}
