import { Inject, Injectable, Optional } from '@angular/core'
import { SUPPORTED_LOCALES } from './models/supported_locales'
import { IStringTable, ITranslateService } from './models/translator'

@Injectable({ providedIn: 'root' })
export class TranslateService implements ITranslateService {

  constructor(@Optional() @Inject('locale') locale: string){
    this.stringTable = this.selectStringTable(locale)
  }

  stringTable: IStringTable

  public translate(key: string, defaultText: string, params?: { [key: string]: any }): string
  public translate(key: string, params?: { [key: string]: any }): string
  public translate(key: string, paramsOrDefaultText?: string | { [key: string]: any }, defaultTextParams?: { [key: string]: any }): string {
    const defaultText = typeof paramsOrDefaultText === 'string' ? paramsOrDefaultText : ''
    const params = typeof paramsOrDefaultText === 'object' ? paramsOrDefaultText : defaultTextParams
    let template = this.stringTable[key]

    if (!template) {
      return defaultText
    }

    if (params) {
      for (const key in params) {
        template = template.replace(`{${key}}`, params[key])
      }
    }

    return template
  }

  private selectStringTable(locale: string): IStringTable {
    if (locale in SUPPORTED_LOCALES) {
      return SUPPORTED_LOCALES[locale]
    }

    return SUPPORTED_LOCALES['en']
  }
}