import { IsNullOrUndefined, IsUndefined } from "./StringUtils";

//TODO: Move it to shared Repo
export function Copy<T, D>(target: T, source: any, key: keyof T, destinationType: null | (new (data: any) => D) = null, defaultValue?: any) {
    if (source) {
        if (source && !IsUndefined(source[key])) {
            if (destinationType) {
                target[key] = IsNullOrUndefined(source[key]) ? source[key] : new destinationType(source[key]) as any;
            } else if (source[key] !== undefined) {
                target[key] = source[key];
            }
        } else if (defaultValue !== undefined) {
            target[key] = defaultValue;
        }
    }

}