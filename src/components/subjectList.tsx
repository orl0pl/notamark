import { WithId } from "mongodb";
import {SubjectCard} from "./card";
import { Subject } from "../../lib/types";




// function getSubjectsFromDB({subjects}:InferGetServerSidePropsType<typeof getServerSideProps>){
//     return subjects
// }

export default function SubjectList ({subjects, selectedId}: {subjects: WithId<Subject>[], selectedId?: string})  {
    return (
        <>
        {subjects?.map((subject, i) => {
            return (
                <SubjectCard
                    key={i}
                    hrefId={subject._id.toString()}
                    lessonsCount={subject.lessons.length}
                    subjectName={subject.name}
                    selected={(selectedId === subject._id.toString()) && true}
                />
            );
        })}
        </>
    )
}