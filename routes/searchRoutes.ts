import { Request, Response } from "express";
import { data, timeAgo } from "../server";
import { Exercise, Note } from "../db/converter";
import iconmapper from "../utils/iconmapper";
interface SearchOptions {
    ignoreSubjects: number[];
    ignoreLessonsInsideSubjects: number[][];
    ignorePersons: number[];
    ignoreNotes: boolean;
    ignoreExercises: boolean;
    ignoreTopics: boolean;
}
const deafultOptions = {
    ignoreSubjects: [],
    ignoreLessonsInsideSubjects: [],
    ignorePersons: [],
    ignoreNotes: false,
    ignoreExercises: false,
    ignoreTopics: false,
};
function searchText(query: string, options: SearchOptions = deafultOptions) {
    interface ResultsInterface {
        result: Note | Exercise;
        idTree: number[];
        score: number;
        type: 'note' | 'exercise';
    }

    var results: ResultsInterface[] = [];
    data.subjects.forEach((subject, subjectId) => {
        subject.lessons.forEach((lesson, lessonId) => {
            // lesson topic
            if(lesson.topic.toLowerCase().includes(query.toLowerCase())) {
                lesson.notes.forEach((note, noteId) => {
                    results.push({
                        result: note,
                        idTree: [subjectId, lessonId, noteId],
                        score: 3,
                        type: 'note',
                    });
                })
            }
            lesson.notes.forEach((note, noteId) => {
                // note content
                if(note.content.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        result: note,
                        idTree: [subjectId, lessonId, noteId],
                        score: 10,
                        type: 'note',
                    });
                }
                // note real date
                if(note.realDate.includes(query)){
                    results.push({
                        result: note,
                        idTree: [subjectId, lessonId, noteId],
                        score: 8,
                        type: 'note',
                    });
                }
                // note content history
                note.contentHistory.forEach((history, historyId) => {
                    if (
                        history.content.toLowerCase().includes(query.toLowerCase())
                    ) {
                        results.push({
                            result: {...history as Note, realDate: note.realDate},
                            idTree: [subjectId, lessonId, noteId, historyId],
                            score: 8,
                            type: 'note',
                        });
                    }
                });
            });
            lesson.exercises.forEach((exercise, exerciseId) => {
                // exercise content
                if(exercise.solution?.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        result: exercise,
                        idTree: [subjectId, lessonId, exerciseId],
                        score: 10,
                        type: 'exercise',
                    });
                }
                // exercise reference
                else if(exercise.reference?.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        result: exercise,
                        idTree: [subjectId, lessonId, exerciseId],
                        score: 8,
                        type: 'exercise',
                    });
                }
            })
        });
    });
    return results;
}

export function searchRoute(req: Request<{}, {}, {}, { q: string }>, res: Response) {
    //res.send(searchText(req.query.q));
    const query = req.query.q || '';
    res.render("search", {
        query: query,
        foundArray: searchText(query),
        account: req.account,
        url: '../../../../',
        mi: iconmapper,
        timeAgo: timeAgo,
        subjects: data.subjects,
        persons: data.persons,
    })
}
export function searchPOSTRoute(req: Request, res: Response) {
    res.send("search");
}
