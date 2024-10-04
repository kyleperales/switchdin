export interface ITranslateService {
  translate(key: string, defaultText?: string): string;
}

export interface IStringTable {[key: string]: string}

export interface ILocale {
  [key: string]: IStringTable;
}
