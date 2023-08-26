// To parse this data:
//
//   import { Convert, DataBase } from "./file";
//
//   const dataBase = Convert.toDataBase(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface DataBase {
    persons:  Person[];
    subjects: Subject[];
}

export interface Person {
    id:          number;
    name:        string;
    password:    string;
    roles:       Role[];
    preferences: Preferences;
}

export interface Preferences {
    language: string;
    dark:     boolean;
}

export type Role = "user" | "editor" | "admin";

interface Subject {
    id:      number;
    name:    string;
    infos:   Info[];
    lessons: Lesson[];
}

export interface Info {
    id:         number;
    content:    string;
    addedBy:    number;
    updateDate: number;
}

export interface Lesson {
    id:            number;
    topic:         string;
    realStartDate: string;
    updateDate:    number;
    addedBy:       number;
    notes:         Note[];
    exercises:     Exercise[];
}

export interface Exercise {
    id:         number;
    reference:  string;
    updateDate: number;
    addedBy:    number;
    solution:   null | string;
}

export interface Note {
    id:             number;
    content:        string;
    contentHistory: ContentHistory[];
    realDate:       string;
    updateDate:     number;
    addedBy:        number;
}

export interface ContentHistory {
    content:    string;
    updateDate: number;
    addedBy:    number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toDataBase(json: string): DataBase {
        return cast(JSON.parse(json), r("DataBase"));
    }

    public static dataBaseToJson(value: DataBase): string {
        return JSON.stringify(uncast(value, r("DataBase")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "DataBase": o([
        { json: "persons", js: "persons", typ: a(r("Person")) },
        { json: "subjects", js: "subjects", typ: a(r("Subject")) },
    ], false),
    "Person": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "password", js: "password", typ: "" },
        { json: "roles", js: "roles", typ: a(r("Role")) },
        { json: "preferences", js: "preferences", typ: r("Preferences") },
    ], false),
    "Preferences": o([
        { json: "language", js: "language", typ: "" },
        { json: "dark", js: "dark", typ: true },
    ], false),
    "Subject": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "infos", js: "infos", typ: a(r("Info")) },
        { json: "lessons", js: "lessons", typ: a(r("Lesson")) },
    ], false),
    "Info": o([
        { json: "id", js: "id", typ: 0 },
        { json: "content", js: "content", typ: "" },
        { json: "addedBy", js: "addedBy", typ: 0 },
        { json: "updateDate", js: "updateDate", typ: 0 },
    ], false),
    "Lesson": o([
        { json: "id", js: "id", typ: 0 },
        { json: "topic", js: "topic", typ: "" },
        { json: "realStartDate", js: "realStartDate", typ: "" },
        { json: "updateDate", js: "updateDate", typ: 0 },
        { json: "addedBy", js: "addedBy", typ: 0 },
        { json: "notes", js: "notes", typ: a(r("Note")) },
        { json: "exercises", js: "exercises", typ: a(r("Exercise")) },
    ], false),
    "Exercise": o([
        { json: "id", js: "id", typ: 0 },
        { json: "reference", js: "reference", typ: "" },
        { json: "updateDate", js: "updateDate", typ: 3.14 },
        { json: "addedBy", js: "addedBy", typ: 0 },
        { json: "solution", js: "solution", typ: u(null, "") },
    ], false),
    "Note": o([
        { json: "id", js: "id", typ: 0 },
        { json: "content", js: "content", typ: "" },
        { json: "contentHistory", js: "contentHistory", typ: a(r("ContentHistory")) },
        { json: "realDate", js: "realDate", typ: "" },
        { json: "updateDate", js: "updateDate", typ: 3.14 },
        { json: "addedBy", js: "addedBy", typ: 0 },
    ], false),
    "ContentHistory": o([
        { json: "content", js: "content", typ: "" },
        { json: "updateDate", js: "updateDate", typ: 3.14 },
        { json: "addedBy", js: "addedBy", typ: 0 },
    ], false),
    "Role": [
        "admin",
        "editor",
        "user",
    ],
};
