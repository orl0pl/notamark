import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import connectToDatabase from "../../mongodb";
import { WithId } from "mongodb";
import SubjectCard from "./card";
import { Subject } from "@/pages/api/subjects";
import { ObjectId } from "mongoose";
var config: { DB_CONN_STRING?: string } = {};
require("dotenv").config({ path: "../../.env.local", processEnv: config });




// function getSubjectsFromDB({subjects}:InferGetServerSidePropsType<typeof getServerSideProps>){
//     return subjects
// }

export default function SubjectList ({subjects, selectedId}: {subjects: WithId<Subject>[], selectedId?: string})  {
    console.log(subjects)
    return (
        <>
        {subjects?.map((subject, i) => {
            return (
                <SubjectCard
                    key={i}
                    hrefId={subject._id.toString()}
                    lastUpdateTime={"2023.08.17"}
                    lessonsCount={subject.lessons.length}
                    subjectName={subject.name}
                    selected={(selectedId === subject._id.toString()) && true}
                />
            );
        })}
        </>
    )
}