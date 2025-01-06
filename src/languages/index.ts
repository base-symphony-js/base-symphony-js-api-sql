/*
 * Copyright (c) 2025 Luis Solano. All rights reserved.
 * Licensed under the MIT License. See the LICENSE file in the root of this repository for more information.
 */
import en from './en/translation.json'
import es from './es/translation.json'
import { AuthLanguages } from '@api/auth/languages'
import { ProfileLanguages } from '@api/profile/languages'
import { UsersLanguages } from '@api/security/users/languages'
import { RolesLanguages } from '@api/security/roles/languages'
import { PermissionsLanguages } from '@api/security/permissions/languages'
import { UtilsLanguages } from '@api/utils/languages'

const GeneralLanguages = { en, es }

export const translations = {
  en: {
    ...GeneralLanguages.en,
    ...AuthLanguages.en,
    ...ProfileLanguages.en,
    ...UsersLanguages.en,
    ...RolesLanguages.en,
    ...PermissionsLanguages.en,
    ...UtilsLanguages.en,
  },
  es: {
    ...GeneralLanguages.es,
    ...AuthLanguages.es,
    ...ProfileLanguages.es,
    ...UsersLanguages.es,
    ...RolesLanguages.es,
    ...PermissionsLanguages.es,
    ...UtilsLanguages.es,
  },
}

export type ITranslation = typeof translations.en
export type ILanguages = 'en' | 'es'
