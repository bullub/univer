import { nanoid } from 'nanoid';
import { Environment } from '../Basics';
import { ObjectMatrix, ObjectMatrixPrimitiveType } from './ObjectMatrix';
import { Class, IKeyValue } from './Types';
import { ObjectArray, ObjectArrayPrimitiveType } from './ObjectArray';

const rmsPrefix = /^-ms-/;
const rDashAlpha = /-([a-z])/g;

const alphabets = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];

/**
 * Universal tool library
 */
export class Tools {
    static stringAt(index: number): string {
        let str = '';
        let idx = index;
        while (idx >= alphabets.length) {
            idx /= alphabets.length;
            idx -= 1;
            str += alphabets[idx % alphabets.length];
        }
        const last = index % alphabets.length;
        str += alphabets[last];
        return str;
    }

    static getEnvironment(): Environment {
        const { appVersion } = navigator;
        const system = this.getSystemType();
        return {
            app_version: appVersion,
            os: system,
            os_version: system,
            device_id: '',
            platform: 'web',
        };
    }

    static indexAt(code: string): number {
        let ret = 0;
        for (let i = 0; i < code.length - 1; i += 1) {
            const idx = code.charCodeAt(i) - 65;
            const expoNet = code.length - 1 - i;
            ret += alphabets.length ** expoNet + alphabets.length * idx;
        }
        ret += code.charCodeAt(code.length - 1) - 65;
        return ret;
    }

    static deleteBlank(value?: string) {
        if (Tools.isString(value)) {
            return value.replace(/\s/g, '');
        }
        return value;
    }

    static getSystemType(): string {
        const sUserAgent = navigator.userAgent;
        const isWin =
            navigator.platform === 'Win32' || navigator.platform === 'Windows';
        const isMac =
            navigator.platform === 'Mac68K' ||
            navigator.platform === 'MacPPC' ||
            navigator.platform === 'Macintosh' ||
            navigator.platform === 'MacIntel';
        if (isMac) return 'Mac';
        const isUnix = navigator.platform === 'X11' && !isWin && !isMac;
        if (isUnix) return 'Unix';
        const isLinux = String(navigator.platform).indexOf('Linux') > -1;
        if (isLinux) return 'Linux';
        if (isWin) {
            const isWin2K =
                sUserAgent.indexOf('Windows NT 5.0') > -1 ||
                sUserAgent.indexOf('Windows 2000') > -1;
            if (isWin2K) return 'Windows 2000';
            const isWinXP =
                sUserAgent.indexOf('Windows NT 5.1') > -1 ||
                sUserAgent.indexOf('Windows XP') > -1;
            if (isWinXP) return 'Windows XP';
            const isWin2003 =
                sUserAgent.indexOf('Windows NT 5.2') > -1 ||
                sUserAgent.indexOf('Windows 2003') > -1;
            if (isWin2003) return 'Windows 2003';
            const isWinVista =
                sUserAgent.indexOf('Windows NT 6.0') > -1 ||
                sUserAgent.indexOf('Windows Vista') > -1;
            if (isWinVista) return 'Windows Vista';
            const isWin7 =
                sUserAgent.indexOf('Windows NT 6.1') > -1 ||
                sUserAgent.indexOf('Windows 7') > -1;
            if (isWin7) return 'Windows 7';
            const isWin10 =
                sUserAgent.indexOf('Windows NT 10') > -1 ||
                sUserAgent.indexOf('Windows 10') > -1;
            if (isWin10) return 'Windows 10';
            const isWin11 =
                sUserAgent.indexOf('Windows NT 11') > -1 ||
                sUserAgent.indexOf('Windows 11') > -1;
            if (isWin11) return 'Windows 11';
        }
        return 'Unknown system';
    }

    static getBrowserType(): string {
        const userAgent = navigator.userAgent;
        const isOpera = userAgent.indexOf('Opera') > -1;
        const isIE =
            userAgent.indexOf('compatible') > -1 &&
            userAgent.indexOf('MSIE') > -1 &&
            !isOpera;
        const isIE11 =
            userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
        const isEdge = userAgent.indexOf('Edge') > -1;
        const isFF = userAgent.indexOf('Firefox') > -1;
        const isSafari =
            userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1;
        const isChrome =
            userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1;
        if (isIE) {
            const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
            reIE.test(userAgent);
            const fIEVersion = parseFloat(RegExp.$1);
            if (fIEVersion === 7) {
                return 'IE7';
            }
            if (fIEVersion === 8) {
                return 'IE8';
            }
            if (fIEVersion === 9) {
                return 'IE9';
            }
            if (fIEVersion === 10) {
                return 'IE10';
            }
            return '0';
        }
        if (isFF) {
            return 'FF';
        }
        if (isOpera) {
            return 'Opera';
        }
        if (isSafari) {
            return 'Safari';
        }
        if (isChrome) {
            return 'Chrome';
        }
        if (isEdge) {
            return 'Edge';
        }
        if (isIE11) {
            return 'IE11';
        }
        return 'Unknown browser';
    }

    static generateRandomId(n: number = 21): string {
        return nanoid(n);
    }

    static getClassName(instance: object): string {
        return instance.constructor.name;
    }

    static deepMerge(target: any, ...sources: any[]): any {
        sources.forEach((item) => item && deepItem(item));

        function deepArray(array: any[], to: any[]) {
            array.forEach((value, key) => {
                if (Tools.isArray(value)) {
                    const origin = to[key] ?? [];
                    to[key] = origin;
                    deepArray(value, origin);
                    return;
                }
                if (Tools.isObject(value)) {
                    const origin = to[key] ?? {};
                    to[key] = origin;
                    deepObject(value, origin);
                    return;
                }
                to[key] = value;
            });
        }

        function deepObject(object: any, to: any) {
            Object.keys(object).forEach((key) => {
                const value = object[key];
                if (Tools.isObject(value)) {
                    const origin = to[key] ?? {};
                    to[key] = origin;
                    deepObject(value, origin);
                    return;
                }
                if (Tools.isArray(value)) {
                    const origin = to[key] ?? [];
                    to[key] = origin;
                    deepArray(value, origin);
                    return;
                }
                to[key] = value;
            });
        }

        function deepItem(item: any) {
            Object.keys(item).forEach((key) => {
                const value = item[key];
                if (Tools.isArray(value)) {
                    const origin = target[key] ?? [];
                    target[key] = origin;
                    deepArray(value, origin);
                    return;
                }
                if (Tools.isObject(value)) {
                    const origin = target[key] ?? {};
                    target[key] = origin;
                    deepObject(value, origin);
                    return;
                }
                target[key] = value;
            });
        }

        return target;
    }

    static numberFixed(value: number, digit: number): number {
        return Number(Number(value).toFixed(digit));
    }

    static diffValue(one: any, tow: any) {
        function diffValue(oneValue: any, towValue: any) {
            const oneType = Tools.getValueType(oneValue);
            const towType = Tools.getValueType(towValue);
            if (oneType !== towType) {
                return false;
            }
            if (Tools.isArray(oneValue)) {
                return diffArrays(oneValue, towValue);
            }
            if (Tools.isObject(oneValue)) {
                return diffObject(oneValue as Object, towValue);
            }
            if (Tools.isDate(oneValue)) {
                return (oneValue as Date).getTime() === towValue.getTime();
            }
            if (Tools.isRegExp(oneValue)) {
                return (
                    (oneValue as unknown as string).toString() ===
                    towValue.toString()
                );
            }
            return oneValue === towValue;
        }

        function diffArrays(oneArray: any[], towArray: any[]) {
            if (one.length !== tow.length) {
                return false;
            }
            for (let i = 0, len = oneArray.length; i < len; i++) {
                const oneValue = oneArray[i];
                const towValue = towArray[i];
                if (!diffValue(oneValue, towValue)) {
                    return false;
                }
            }
            return true;
        }

        function diffObject(oneObject: IKeyValue, towObject: IKeyValue) {
            const oneKeys = Object.keys(oneObject);
            const towKeys = Object.keys(towObject);
            if (oneKeys.length !== towKeys.length) {
                return false;
            }
            for (const key of oneKeys) {
                if (!towKeys.includes(key)) {
                    return false;
                }
                const oneValue = oneObject[key];
                const towValue = towObject[key];
                if (!diffValue(oneValue, towValue)) {
                    return false;
                }
            }
            return true;
        }

        return diffValue(one, tow);
    }

    static deepClone(value: any): any {
        if (!this.isDefine(value)) {
            return value;
        }
        if (this.isRegExp(value)) {
            return new RegExp(value);
        }
        if (this.isDate(value)) {
            return new Date(value);
        }
        if (this.isArray(value)) {
            const clone: any[] = [];
            value.forEach((item, index) => {
                clone[index] = Tools.deepClone(item);
            });
            return clone;
        }
        if (this.isObject(value)) {
            const clone: IKeyValue = {};
            Object.keys(value as IKeyValue).forEach((key) => {
                const item = (value as IKeyValue)[key];
                clone[key] = Tools.deepClone(item);
            });
            Object.setPrototypeOf(clone, Object.getPrototypeOf(value));
            return clone;
        }
        return value;
    }

    static getLanguage(): string {
        const defaultValue = 'en-US';
        if (globalThis.navigator) {
            return (
                (navigator.languages && navigator.languages[0]) ||
                navigator.language ||
                defaultValue
            );
        }
        return defaultValue;
    }

    static getValueType(value: any): string {
        return Object.prototype.toString.apply(value);
    }

    static isDefine<T>(value?: T | void): value is T {
        return value !== undefined && value !== null;
    }

    static isBlank(value: any): boolean {
        if (!this.isDefine(value)) {
            return true;
        }
        if (this.isString(value)) {
            return value.trim() === '';
        }
        return false;
    }

    static isAssignableFrom<T>(object: any, clazz: Class<T>): object is T {
        return object instanceof clazz;
    }

    static isBoolean(value?: any): value is boolean {
        return this.getValueType(value) === '[object Boolean]';
    }

    static isPlainObject(value: any): value is object {
        if (!this.isDefine(value)) {
            return false;
        }
        return Object.getPrototypeOf(value) === Object.getPrototypeOf({});
    }

    static isFunction(value?: any): value is boolean {
        return this.getValueType(value) === '[object Function]';
    }

    static isDate(value?: Date): value is Date {
        return this.getValueType(value) === '[object Date]';
    }

    static isRegExp(value?: any): value is RegExp {
        return this.getValueType(value) === '[object RegExp]';
    }

    static isArray<T>(value?: any): value is T[] {
        return this.getValueType(value) === '[object Array]';
    }

    static isString(value?: any): value is string {
        return this.getValueType(value) === '[object String]';
    }

    static isNumber(value?: any): value is number {
        return this.getValueType(value) === '[object Number]';
    }

    static isStringNumber(value?: any): boolean {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    static isObject<T>(value?: any): value is T {
        return this.getValueType(value) === '[object Object]';
    }

    static isEmptyObject(value?: any): boolean {
        // eslint-disable-next-line no-unreachable-loop
        for (const key in value) {
            return false;
        }
        return true;
    }

    static isMobile(): boolean {
        let clientWidth = 0;
        let clientHeight = 0;
        if (document.body.clientWidth) {
            clientWidth = document.body.clientWidth;
        }
        if (document.body.clientHeight) {
            clientHeight = document.body.clientHeight;
        }
        return (
            this.isAndroid() ||
            this.isIPhone() ||
            this.isTablet() ||
            (clientWidth < 350 && clientHeight < 500)
        );
    }

    static isTablet(): boolean {
        return /ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(
            navigator.userAgent.toLowerCase()
        );
    }

    static isWeChat(): boolean {
        const userAgent = navigator.userAgent.toLowerCase();
        return String(userAgent.match(/MicroMessenger/i)) === 'micromessenger'
            ? !0
            : !1;
    }

    static isAndroid(): boolean {
        const userAgent = navigator.userAgent;
        return userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1;
    }

    static isIPhone(): boolean {
        return /iPhone/i.test(navigator.userAgent);
    }

    static isIEBrowser(): boolean {
        return this.getBrowserType().startsWith('IE');
    }

    static itCount(count: number): Function {
        return (callback: Function) => {
            for (let i = 0; i < count; i++) {
                callback && callback();
            }
        };
    }

    static hasLength(target: IArguments | any[] | string, length?: number): boolean {
        if (Tools.isDefine(target)) {
            if (Tools.isDefine(length)) {
                return target.length === length;
            }
            return target.length > 0;
        }
        return false;
    }

    static capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Used by camelCase as callback to replace()
    static fCamelCase(_all: any, letter: string) {
        return letter.toUpperCase();
    }

    // Convert dashed to camelCase; used by the css and data modules
    // Support: IE <=9 - 11, Edge 12 - 15
    // Microsoft forgot to hump their vendor prefix (#9572)
    static camelCase(str: string) {
        return str.replace(rmsPrefix, 'ms-').replace(rDashAlpha, this.fCamelCase);
    }

    /**
     * remove all null from object
     * @param obj
     * @returns
     */
    static removeNull(value: IKeyValue): object {
        if (this.isObject(value)) {
            const clone = {};
            Object.keys(value).forEach((key) => {
                const item = value[key];
                if (item == null) {
                    delete value[key];
                } else {
                    Tools.removeNull(item);
                }
            });
            return clone;
        }
        return value;
    }

    /**
     * Generate a two-dimensional array with the specified number of rows and columns, and fill in the values
     * @param rows row length
     * @param columns column length
     * @param value value to be set
     * @returns
     */
    static fillTwoDimensionalArray(
        rows: number,
        columns: number,
        value: any
    ): any[][] {
        return new Array(rows)
            .fill(value)
            .map((item) => new Array(columns).fill(value));
    }

    /**
     * Generate a two-dimensional array with the specified number of rows and columns, and fill in the values
     * @param rows row length
     * @param columns column length
     * @param value value to be set
     * @returns
     */
    static fillObjectMatrix<T>(
        rows: number,
        columns: number,
        value: T
    ): ObjectMatrixPrimitiveType<T> {
        const matrix = new ObjectMatrix<T>();
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                matrix.setValue(r, c, value);
            }
        }
        return matrix.getData();
    }

    static numToWord(x: number) {
        let s = '';
        while (x > 0) {
            let m = x % 26;
            m = m === 0 ? (m = 26) : m;
            s = String.fromCharCode(96 + m) + s;
            x = (x - m) / 26;
        }
        return s.toLocaleUpperCase();
    }

    /**
     *
     * Column subscript letter to number
     *
     * @privateRemarks
     * zh: 列下标  字母转数字
     *
     * @param a - Column subscript letter,e.g.,"A1"
     * @returns Column subscript number,e.g.,0
     *
     */

    static ABCatNum(a: string): number {
        if (a == null || a.length === 0) {
            return NaN;
        }

        const str = a.toLowerCase().split('');
        const al = str.length;
        let numOut = 0;
        let charnum = 0;
        for (let i = 0; i < al; i++) {
            charnum = str[i].charCodeAt(0) - 96;
            numOut += charnum * 26 ** (al - i - 1);
        }
        if (numOut === 0) {
            return NaN;
        }
        return numOut - 1;
    }

    /**
     * en: Column subscript number to letter
     *
     * zh: 列下标  数字转字母
     *
     * @param n Column subscript number,e.g.,0
     * @returns Column subscript letter,e.g.,"A1"
     */
    static chatAtABC(n: number): string {
        const ord_a = 'a'.charCodeAt(0);

        const ord_z = 'z'.charCodeAt(0);

        const len = ord_z - ord_a + 1;

        let s = '';

        while (n >= 0) {
            s = String.fromCharCode((n % len) + ord_a) + s;

            n = Math.floor(n / len) - 1;
        }

        return s.toUpperCase();
    }

    static randSort<T>(arr: T[]) {
        for (let i = 0, len = arr.length; i < len; i++) {
            const rand = parseInt((Math.random() * len).toString());
            const temp = arr[rand];
            arr[rand] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }

    /**
     * extend two objects
     * @param originJson
     * @param extendJson
     * @returns
     */
    static commonExtend<T>(originJson: IKeyValue, extendJson: IKeyValue): T {
        let resultJsonObject: IKeyValue = {};

        for (let attr in originJson) {
            resultJsonObject[attr] = originJson[attr];
        }

        for (let attr in extendJson) {
            // undefined is equivalent to no setting
            if (extendJson[attr] == null) {
                continue;
            }
            resultJsonObject[attr] = extendJson[attr];
        }

        return resultJsonObject as unknown as T;
    }

    static commonExtend1<T>(originJson: IKeyValue, extendJson: IKeyValue): T {
        for (let attr in originJson) {
            if (extendJson[attr] == null) {
                extendJson[attr] = originJson[attr];
            }
        }
        return extendJson as unknown as T;
    }

    static arrayToObject(array: IKeyValue[][]) {
        const obj: IKeyValue = {};
        array.forEach((row, i) => {
            obj[i] = {};
            row.forEach((column, j) => {
                obj[i][j] = column;
            });
        });
        return obj;
    }

    static createObjectArray<T>(
        array: ObjectArrayPrimitiveType<T> | ObjectArray<T>
    ): ObjectArray<T> {
        if (array instanceof ObjectArray) {
            return new ObjectArray<T>(array.toJSON());
        }
        return new ObjectArray<T>(array);
    }
}
