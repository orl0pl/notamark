export interface Data {
    persons:  Person[];
    subjects: Subject[];
}

export interface Person {
    id:   number;
    name: string;
}

export interface Subject {
    id:      number;
    name:    string;
    infos:   Info[];
    lessons: Lesson[];
}

export interface Info {
    id:                 number;
    name:               string;
    description:        string;
    descriptionHistory: DescriptionHistory[];
    addedBy?:           number;
    updateDate?:        number;
}

export interface DescriptionHistory {
    description: string;
    updateDate:  number;
    addedBy:     number;
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
    realDate?:      string;
    updateDate?:    number;
    madeBy?:        number;
}

export interface ContentHistory {
    content:    string;
    updateDate: number;
    addedBy:    number;
}
