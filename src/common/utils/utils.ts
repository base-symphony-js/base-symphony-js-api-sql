import type { IDataResponse, ITranslation } from '@interfaces'

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const CustomError = (keyMsg: keyof ITranslation, code: number) => {
  const error: any = new Error(keyMsg as string)
  error.code = code
  error.name = 'CustomError'
  return error
}

export const getErrorResponse = (
  t: ITranslation,
  error: any,
): IDataResponse => {
  const name = error.name
  const message: keyof ITranslation = error.message
  return {
    statusCode: typeof error.code === 'number' ? error.code : 500,
    message: name === 'CustomError' ? t[message] : t.RES_SERVER_ERROR,
    data:
      name === 'CustomError'
        ? null
        : {
            name: error.name,
            message: error.message,
          },
  }
}
