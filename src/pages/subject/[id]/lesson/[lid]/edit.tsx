import { Button, Center } from "@/components/common";
import { mdiArrowLeft, mdiDeleteForever, mdiKey, mdiPencilCircle, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import tw from "tailwind-styled-components";
import FormComponent from "@/components/form";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/spinner";
import SERVER_HOST from "../../../../../../url-config";
import { WithId } from "mongodb";
import { Lesson } from "../../../../../../lib/types";

async function getLesson(id: string) {
	const resLesson = await fetch((SERVER_HOST || "http://localhost:3000")+"/api/lesson/" + id);
	const lesson: WithId<Lesson> | null = await resLesson.json();
	return lesson;
}

async function formSubmit(event: FormEvent<HTMLFormElement>) {
    console.log(event.currentTarget)
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/lesson/add', {
        method: 'POST',
        body: formData,
      })
    const json = await response.json()
    alert(json)
}

export default function Page() {
    const router = useRouter()
    const [id, setId] = useState(router.query.id?.toString())
    const [lesson, setLesson] = useState<WithId<Lesson> | "loading" | null>("loading");
    useEffect(()=>{
        setId(router.query.id?.toString()||"loading")
    }, [router.query.id])
    useEffect(() => {
		if (router.query.lid) {
			getLesson(router.query.lid.toString())
				.then((x) => {
					setLesson(x);
				})
				.catch(() => setLesson(null));
		}
	}, [router.query.lid]);
    if(id=='loading'||lesson=='loading'){
        return (
            <Center><Spinner/></Center>
        )
    }
    else if (lesson==null){
        return (
            <Center>
                <span className="error-text">Nie odnaleziono tej lekcji</span>
            </Center>
        )
    }
    else {
        return (
            <FormComponent icon={mdiPencilCircle} formHeader={`Edytuj lekcje: "${lesson.topic}"`} inputs={[
                {placeholder: "Login", name: "login"},
                {placeholder: "Hasło", name: "password", type: "password"},
                {placeholder: "Temat lekcji", name: "topic"},
                {name: "id", type: "hidden", value: router.query.lid?.toString()},
            ]} submitTitle="Edytuj lekcje" submitUrl="/api/lesson/edit"/>
        )
    }
}