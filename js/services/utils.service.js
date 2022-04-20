'use strict'

export const utilService= {
  getRandomIntInclusive,
  getRandomColor,
  makeId
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function copyMat(mat) {
  var newMat = []
  for (var i = 0; i < mat.length; i++) {
    newMat[i] = []
    for (var j = 0; j < mat[0].length; j++) {
      newMat[i][j] = mat[i][j]
    }
  }
  return newMat
}

let gNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
function drawNum() {
  //NOTICE: WE NEED GLOBAL NUMBERS ARRAY - gNumbers
  const idx = getRanndomIntInclusive(0, numbers.length - 1)
  return numbers.splice(idx, 1)[0]
}

function getNeighbors(mat, idxI, idxJ) {
  var neightbors = []
  for (var i = idxI - 1; i <= idxI + 1; i++) {
    if (i < 0 || i > mat.length -1) continue

    for (var j = idxJ - 1; j <= idxJ + 1; j++) {
      if (i === idxI && j === idxJ) continue
      if (j < 0 || j > mat[i].length - 1) continue

      neightbors.push(mat[i][j])
    }
  }

  return neightbors
}

//** TIMER */

function pad(val) {
  let valString = val + ''
  if (valString.length < 2) return '0' + valString
  return valString
}

// gStartTime = Date.now()
function timer() {
  //NOTICE: WE NEED GLOBAL START TIME - gStartTime
  var timeDiff = Date.now() - gStartTime
  //   var currTime = new Date(timeDiff)

  //   return currTime //shows in milliseconds

  //OR
  currTime = new Date(timeDiff)
  var timeStr = pad(currTime.getMinutes()) //pad make it 01, 02 and so on
  timeStr += ':' + pad(currTime.getSeconds())
  return timeStr
}

function makeId(length = 6) {
  let txt = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

function makeLorem(size = 100) {
  var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn'];
  var txt = '';
  while (size > 0) {
      size--;
      txt += words[Math.floor(Math.random() * words.length)] + ' ';
  }
  return txt;
}

/* Local Storage */

function saveToStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}
