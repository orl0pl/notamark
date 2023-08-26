import { GetServerSideProps } from "next";
import { Convert, Subject } from "./converter";
import * as fs from "fs";

export const getServerSideProps: GetServerSideProps<{
	subjects: Subject[];
}> = async () => {
	
	var json = fs.readFileSync("db/notes.json", "utf8");
	const data = Convert.toDataBase(json);
	const subjects = data.subjects;
	return { props: { subjects } };
};
