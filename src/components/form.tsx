import Icon from "@mdi/react";
import { ButtonHTMLAttributes, DetailedHTMLProps, FormHTMLAttributes, HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import tw from "tailwind-styled-components";
import { Button, IButtonWIcon } from "./common";

const FormWrapper = tw.main`flex min-h-screen flex-col items-center p-2 md:p-6 xl:p-12`;

const FormContainer = tw.form`gap-8 surface-container py-8 px-4 rounded-2xl w-full sm:w-[450px] flex flex-col items-center`;

const FormHeaderAndIcon = tw.div`flex flex-col items-center`;

const FormInputs = tw.div`flex flex-col items-center w-full px-10 gap-4`;

const Input = tw.input`h-14 px-4 rounded-md w-full bg-transparent
focus:outline-b focus:outline-b-[var(--md-sys-color-primary)]
focus-visible:outline focus-visible:outline-[var(--md-sys-color-primary)]`;

const FormActions = tw.div`flex flex-row justify-between items-center w-full px-10 gap-4`;


type FormAction = {
    name: string,
} & IButtonWIcon

interface FormOptions {
    icon: string,
    title: string,
    inputs:  (InputHTMLAttributes<HTMLInputElement>)[]
    actions: (FormAction & ButtonHTMLAttributes<HTMLButtonElement>)[]
}

export default function FormComponent({icon, inputs, title, actions}: FormOptions & FormHTMLAttributes<HTMLFormElement>) {
	return (
		<FormWrapper>
			<FormContainer>
				<FormHeaderAndIcon>
					<Icon className="w-8" path={icon} />
					<span className="headline-small">{title}</span>
				</FormHeaderAndIcon>
				<FormInputs>
                    {inputs.map((inp, i)=>(
                        <Input key={i} {...inp}/>
                    ))}
                </FormInputs>
				<FormActions>
                    {
                        actions.map((acti, i)=>(
                            <Button key={i} {...acti}>{acti.name}</Button>
                        ))
                    }
                </FormActions>
			</FormContainer>
		</FormWrapper>
	);
}
