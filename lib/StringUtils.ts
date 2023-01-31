//TODO: Move it to shared Repo

// import {locale,parseNumber} from "globalize";
export function StringIsNullOrEmpty(obj:string){
    return !(obj && obj.length >0);
}

export function IsNullOrUndefined(val: string | boolean | number){
    return val === null || val === undefined;
}

export function IsUndefined(val: string | boolean | number){
    return  val === undefined;
}

export function convertToBoolean(input: string): boolean | undefined {
    try {
        if (typeof input === 'boolean') return input;
        if (input)
            return JSON.parse((input ? input.toLowerCase() : false).toString());

        //TODO: incase of array we can check the length as well ?

        return input ? true : false;//truthy value in case of anything else
    }
    catch (e) {
        return undefined;
    }
}

export function parseNumberFromString(locale,value:string):number{
   
    try {


        if (value) {
            if (typeof (value) == "string")
                return parseNumberInternal(value, locale || 'en-US')
            if (typeof (value) == "number")
                return value;
        }
    } catch (error) {
        console.error(error)

    }
    return 0;

}

function parseNumberInternal(value, locales:string) {
    const example = Intl.NumberFormat(locales).format(1.1);
    const cleanPattern = new RegExp(`[^-+0-9${ example.charAt( 1 ) }]`, 'g');
    const cleaned = value.replace(cleanPattern, '');
    const normalized = cleaned.replace(example.charAt(1), '.');
  
    return parseFloat(normalized);
  }
  