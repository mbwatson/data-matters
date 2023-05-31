const fs = require('fs')
const path = require('path')

function emptyDirectory(dirPath) {
  const dirContents = fs.readdirSync(dirPath)

  dirContents.forEach(fileOrDirPath => {
    try {
      const fullPath = path.join(dirPath, fileOrDirPath)
      const stat = fs.statSync(fullPath)
      // if we have a sub directory...
      if (stat.isDirectory()) {
        if (fs.readdirSync(fullPath).length) emptyDirectory(fullPath)
        // note: can also delete the directory with fs.rmdirSync(fullPath);
      } else {
        // it's a file.
        fs.unlinkSync(fullPath)
      }
    } catch (error) {
      console.error(error.message)
    }
  })
}

function formatDate(dateObject) {
  const mm =
    dateObject.getMonth() < 9
      ? `0${dateObject.getMonth() + 1}`
      : dateObject.getMonth() + 1
  const dd =
    dateObject.getDate() < 10
      ? `0${dateObject.getDate()}`
      : dateObject.getDate()
  const yyyy = dateObject.getFullYear()
  return `${yyyy}-${mm}-${dd}`
}

function hasDistinctElements(arr) {
  return arr.length === new Set(arr).size
}

module.exports = {
  emptyDirectory,
  formatDate,
  hasDistinctElements,
}
