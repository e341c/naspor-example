const path = require("path")
const fs = require("fs")

function saveFile(file, pathPublic) {
    try {
        const tempPath = file.filepath

        let ext = file.mimetype.split("/")
        ext = ext[ext.length - 1]

        const targetPath = path.join("public", `/${pathPublic}`, `/${file.newFilename}.${ext}`)

        fs.rename(tempPath, targetPath, (err) => console.error(err))

        return targetPath
    } catch (error) {
        console.error(error)
        return
    }
}

function deleteFile(pathPublic) {
    const filePath = __basedir + pathPublic
    
    try {
        fs.stat(filePath, (err, stats) => {
            console.log(stats)
            if (err) {
                console.error(err)
                return null
            }
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err)
                    return null
                }
                return true
            })
            return true
        })
    } catch (error) {
        console.error(error)
        return
    }
}

function updateFile(file, pathPublic, targetPath) {
    deleteFile(pathPublic)
    const path = saveFile(file, targetPath)
    return path
}

module.exports = {
    saveFile,
    deleteFile,
    updateFile
}
