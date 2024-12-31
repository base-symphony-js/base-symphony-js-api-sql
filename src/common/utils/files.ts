import type { ILanguages } from '@languages'
import path from 'path'
import fs from 'fs'

export const getHTMLFile = (
  currentPath: string,
  lng: ILanguages,
  template: string,
) => {
  const languagesDir = path.resolve(currentPath, 'languages')
  const filePath = path.join(languagesDir, `${lng}/${template}.html`)
  const html = fs.readFileSync(filePath, 'utf8')
  return html
}
