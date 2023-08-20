import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import connectToDatabase from "../../mongodb";
import { WithId } from "mongodb";
import SubjectCard from "./card";
import { Subject } from "@/pages/api/subjects";
var config: { DB_CONN_STRING?: string } = {};
require("dotenv").config({ path: "../../.env.local", processEnv: config });




// function getSubjectsFromDB({subjects}:InferGetServerSidePropsType<typeof getServerSideProps>){
//     return subjects
// }

export default function SubjectList ({subjects}: {subjects: WithId<Subject>[]})  {
    console.log(subjects)
    return (
        <>
        {subjects?.map((subject) => {
            return (
                <SubjectCard
                    key={parseInt(subject._id.toString())}
                    hrefId={parseInt(subject._id.toString())}
                    lastUpdateTime={"2023.08.17"}
                    lessonsCount={subject.lessons.length}
                    subjectName={subject.name}
                />
            );
        })}
        </>
    )
}