import { Request, Response } from "express";
import { data } from "../server";
import { Exercise, Note } from "../db/converter";
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
    }

    var results: ResultsInterface[] = [];
    data.subjects.forEach((subject, subjectId) => {
        subject.lessons.forEach((lesson, lessonId) => {
            if(lesson.topic.toLowerCase().includes(query.toLowerCase())) {
                lesson.notes.forEach((note, noteId) => {
                    results.push({
                        result: note,
                        idTree: [subjectId, lessonId, noteId],
                        score: 3,
                    });
                })
            }
            lesson.notes.forEach((note, noteId) => {
                if(note.content.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        result: note,
                        idTree: [subjectId, lessonId, noteId],
                        score: 10,
                    });
                }
                if(note.realDate.includes(query)){
                    results.push({
                        result: note,
                        idTree: [subjectId, lessonId, noteId],
                        score: 8,
                    });
                }
                note.contentHistory.forEach((history, historyId) => {
                    if (
                        history.content.toLowerCase().includes(query.toLowerCase())
                    ) {
                        results.push({
                            result: history as Note,
                            idTree: [subjectId, lessonId, noteId, historyId],
                            score: 8,
                        });
                    }
                });
            });
            lesson.exercises.forEach((exercise, exerciseId) => {
                if(exercise.solution?.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        result: exercise,
                        idTree: [subjectId, lessonId, exerciseId],
                        score: 10,
                    });
                }
                else if(exercise.reference?.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        result: exercise,
                        idTree: [subjectId, lessonId, exerciseId],
                        score: 8,
                    });
                }
            })
        });
    });
    return results;
}

export function searchRoute(req: Request<{}, {}, {}, { q: string }>, res: Response) {
    res.send(searchText(req.query.q));
}
export function searchPOSTRoute(req: Request, res: Response) {
    res.send("search");
}
