import { Button } from "@/components/common";
import { mdiArrowLeft, mdiKey } from "@mdi/js";
import Icon from "@mdi/react";
import tw from "tailwind-styled-components";
import FormComponent from "@/components/form";


export default function Form() {
    return (
        // <main className="flex min-h-screen flex-col items-center p-2 md:p-6 xl:p-12">

        //     <div className="gap-8 surface-container py-8 px-4 rounded-2xl w-full sm:w-[450px] flex flex-col items-center">
        //         <div className="flex flex-col items-center">
        //             <Icon className="w-8" path={mdiKey} />
        //             <span className="headline-small">
        //                 Zaloguj się
        //             </span>
        //         </div>
        //         <div className="flex flex-col items-center w-full px-10 gap-4">
        //             <input placeholder="Login" className={`h-14 px-4 rounded-md w-full bg-transparent
        //             focus:outline-b focus:outline-b-[var(--md-sys-color-primary)]
        //             focus-visible:outline focus-visible:outline-[var(--md-sys-color-primary)]
        //             `} type="text" />
        //             <input placeholder="Password" className={`h-14 px-4 rounded-md w-full bg-transparent
        //             focus:outline-b focus:outline-b-[var(--md-sys-color-primary)]
        //             focus-visible:outline focus-visible:outline-[var(--md-sys-color-primary)]
        //             `} type="password" />
        //         </div>
        //         <div className="flex flex-row justify-between items-center w-full px-10 gap-4">
        //             <Button $type="text" $icon={mdiArrowLeft}>Go back</Button>
        //             <Button $type="filled">Login</Button>
        //         </div>
        //     </div>
        // </main>
        <FormComponent action={'/'} icon={mdiKey} title="Zaloguj się" inputs={[
            {placeholder: "Login"},
            {placeholder: "Hasło"}
        ]} actions={[
            {name: "Zaloguj się", $type: "filled", type: "submit"},
        ]}/>
    )
}