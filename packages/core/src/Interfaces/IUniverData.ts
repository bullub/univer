import { LocaleType } from '../Enum';

export interface IUniverData {
    locale: LocaleType;
    id: string;
}

/**
 * Toolbar Observer generic interface, convenient for plug-ins to define their own types
 */
export interface UIObserver<T = string> {
    /**
     * fontSize, fontFamily,color...
     */
    name: string;

    /**
     * fontSize:number, fontFamily:string ...
     */
    value?: T;
}
