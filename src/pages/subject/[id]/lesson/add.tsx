import { Button, Center } from "@/components/common";
import { mdiArrowLeft, mdiKey, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import tw from "tailwind-styled-components";
import FormComponent from "@/components/form";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/spinner";

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
    useEffect(()=>{
        setId(router.query.id?.toString()||"loading")
    }, [router.query.id])
    if(id=='loading'){
        return (
            <Center><Spinner/></Center>
        )
    }
    else {
        return (
            <FormComponent icon={mdiPlus} formHeader="Dodaj lekcję" inputs={[
                {placeholder: "Login", name: "login"},
                {placeholder: "Hasło", name: "password", type: "password"},
                {placeholder: "Temat lekcji", name: "topic"},
                {name: "id", type: "hidden", value: router.query.id?.toString()},
            ]} submitTitle="Dodaj" submitUrl="/api/lesson/add"/>
        )
    }
}