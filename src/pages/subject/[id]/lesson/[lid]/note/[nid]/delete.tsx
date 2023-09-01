import { Button, Center } from "@/components/common";
import { mdiArrowLeft, mdiDeleteForever, mdiKey, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import tw from "tailwind-styled-components";
import FormComponent, { FormWrapper } from "@/components/form";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/spinner";
import SERVER_HOST from "../../../../../../../../url-config";
import { WithId } from "mongodb";
import { Note } from "../../../../../../../../lib/types";
import { i18n, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

async function getNote(id: string) {
	const resNote = await fetch((SERVER_HOST || "http://localhost:3000")+"/api/note/" + id);
	const note: WithId<Note> | null = await resNote.json();
	return note;
}

async function formSubmit(event: FormEvent<HTMLFormElement>) {
    console.log(event.currentTarget)
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/note/add', {
        method: 'POST',
        body: formData,
      })
    const json = await response.json()
    alert(json)
}

export async function getServerSideProps({ locale }: { locale: string }) {
	//if (process.env.NODE_ENV === "development") {
	await i18n?.reloadResources();
	//}
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"])),
			// Will be passed to the page component as props
		},
	};
}

export default function Page() {
    const router = useRouter()
    const [id, setId] = useState(router.query.id?.toString());
    const {t} = useTranslation();
    const [note, setNote] = useState<WithId<Note> | "loading" | null>("loading");
    useEffect(()=>{
        setId(router.query.id?.toString()||"loading")
    }, [router.query.id])
    useEffect(() => {
		if (router.query.nid) {
			getNote(router.query.nid.toString())
				.then((x) => {
					setNote(x);
				})
				.catch(() => setNote(null));
		}
	}, [router.query.nid]);
    if(id=='loading'||note=='loading'){
        return (
            <Center><Spinner/></Center>
        )
    }
    else if (note==null){
        return (
            <FormWrapper>
                <Center>
                    <span className="error-text">{t('note.notfound')}</span>
                </Center>
            </FormWrapper>
            
        )
    }
    else {
        return (
            <FormComponent icon={mdiDeleteForever} formHeader={t('note.delete.confirm', {title: note.title})} inputs={[
                {placeholder: t('user.login'), name: "login"},
                {placeholder: t('user.password'), name: "password", type: "password"},
                {name: "id", type: "hidden", value: router.query.nid?.toString()},
            ]} submitTitle={t('note.delete.button')} submitUrl="/api/note/delete/"/>
        )
    }
}