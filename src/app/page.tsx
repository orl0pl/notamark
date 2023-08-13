import Icon from "@mdi/react";
import * as mdi from "@mdi/js";
import { Subject } from "../../db/converter";
import {data} from '../../db/databaseConnect'


function Card({ headline = "" }: { headline?: string }): React.ReactElement {
	return (
		<div className="outline outline-[color:var(--md-sys-color-outline)] outline-1 w-full p-2 rounded-[8px] ">
			<div className="flex flex-row justify-between">
				<span className="text-xl">{headline}</span>
				<Icon path={mdi.mdiPencilPlus} size={1} />
			</div>
		</div>
	);
}

function CardList({ data }: { data: Subject[] }): React.ReactElement {

	return (
    <div className="flex-1 gap-2 md:gap-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 md:grid-cols-3">{
      data.map((subject, i)=>{
        return <Card headline={subject.name} key={i}/>
      })
    }</div>
  );
}
export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-start p-2 md:p-6 xl:p-12 gap-8">
			<h1 className={`text-3xl font-normal`}>Przeglądaj notatki </h1>
			<div className="w-full flex flex-col gap-2">
				<h4 className="text-l pl-2">Przedmioty</h4>
				<CardList data={data.subjects} />
			</div>
		</main>
	);
}
