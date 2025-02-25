type AnyObject = {
    [key: number | string]: AnyObject | AnyObject[] | Array<[number | string]> | any;
};

export function deepCompare(arg1: AnyObject, arg2: AnyObject): boolean {
    if (
        Object.prototype.toString.call(arg1) === Object.prototype.toString.call(arg2)
    ) {
        if (
            Object.prototype.toString.call(arg1) === '[object Object]' ||
            Object.prototype.toString.call(arg1) === '[object Array]'
        ) {
            if (Object.keys(arg1).length !== Object.keys(arg2).length) {
                return false;
            }
            return Object.keys(arg1).every((key) =>
                deepCompare(arg1[key] as AnyObject, arg2[key] as AnyObject)
            );
        }
        return arg1 === arg2;
    }
    return false;
}
