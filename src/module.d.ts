export interface Config {
    readonly rootURL: string;
    readonly cachePath: string; // cache folder
    readonly output: string; // output file name
}

export interface MatchGroups {
    readonly [key: string]: string;
}

export interface LinkedData<T = any> {
    readonly name: string;
    readonly url: string;
    readonly data?: T;
}

export interface CountryData {
    readonly code2: string; // alpha-2 code
    readonly code3: string; // alpha-3 code
    readonly code: string; // numeric code
    readonly flag: string; // link of flag image or base64 data of flag image
}

export interface CountryModel {
    readonly name: string;
    readonly code2: string;
    readonly code3: string;
    readonly code: string;
    readonly flag: string; //base64
}