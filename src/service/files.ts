import fileUpload from 'express-fileupload'

type UploadedFile = fileUpload.UploadedFile

class FileService {
  async getMediaPath (files): Promise<Array<string>> {
    const mediaPaths: Array<string> = []

    const saveFiles = (files) => {
      const path: string = process.env.FILE_PATH + files.md5 + '.' + files.name.split('.').pop()
      mediaPaths.push(path)
      files.mv(path)
    }

    if (isSingleFile(files)) {
      saveFiles(files)
    }

    if (isFileArray(files)) {
      files.forEach(file => saveFiles(file))
    }

    return mediaPaths
  }
}

function isSingleFile (file: UploadedFile | UploadedFile[]): file is UploadedFile {
  return typeof file === 'object' && (file as UploadedFile).name !== undefined
}

function isFileArray (file: UploadedFile | UploadedFile[]): file is UploadedFile[] {
  return Array.isArray(file)
}

export default new FileService()
