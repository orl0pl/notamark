import { GetServerSideProps } from "next";
import connectToDatabase from "../../mongodb";
import { WithId } from "mongodb";
import SubjectCard from "./card";
var config: { DB_CONN_STRING?: string } = {};
require("dotenv").config({ path: "../../.env.local", processEnv: config });

interface Props {
	subjects: IRawSubject[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const { db } = await connectToDatabase(config["DB_CONN_STRING"] || "");
	const subjects: WithId<IRawSubject>[] = await db.collection<IRawSubject>("subjects").find().toArray();

	return {
		props: {
			subjects,
		},
	};
};

interface IRawSubject {
	//_id: string;
	name: string;
	lessons: Array<number>;
}

export default function SubjectList ({subjects}: {subjects?: WithId<IRawSubject>[]}) {
    return (
        <>
        {subjects?.map((subject) => {
            return (
                <SubjectCard
                    key={parseInt(subject._id.toString())}
                    hrefId={parseInt(subject._id.toString())}
                    lastUpdateTime={"2023.08.17"}
                    lessonsCount={14}
                    subjectName="Xdd"
                />
            );
        })}
        </>
    )
}