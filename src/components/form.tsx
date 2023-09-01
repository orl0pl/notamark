import Icon from "@mdi/react";
import { ButtonHTMLAttributes, ChangeEvent, DetailedHTMLProps, FormEvent, FormHTMLAttributes, HTMLInputTypeAttribute, InputHTMLAttributes, useState } from "react";
import tw from "tailwind-styled-components";
import { Button, IButtonWIcon } from "./common";

export const FormWrapper = tw.main`flex min-h-screen flex-col items-center p-2 md:p-6 xl:p-12`;

const FormContainer = tw.div`gap-8 surface-container py-8 px-4 rounded-2xl w-full sm:w-[450px] flex flex-col items-center`;

const FormHeaderAndIcon = tw.div`flex flex-col items-center`;

const FormInputs = tw.div`flex flex-col items-center w-full px-10 gap-4`;

export const Input = tw.input`h-14 px-4 rounded-md w-full bg-transparent
focus:outline-b focus:outline-b-[var(--md-sys-color-primary)]
focus-visible:outline focus-visible:outline-[var(--md-sys-color-primary)]`;

const FormActions = tw.div`flex flex-row justify-between items-center w-full px-10 gap-4`;


type FormAction = {
    name: string,
} & IButtonWIcon

interface FormOptions {
    icon: string,
    formHeader: string,
    inputs:  (InputHTMLAttributes<HTMLInputElement> & {name: string})[]
    actions?: (FormAction & ButtonHTMLAttributes<HTMLButtonElement>)[],
    submitOptions?: IButtonWIcon,
    submitTitle: string,
    submitUrl: string
}

export default function FormComponent({icon, inputs, formHeader, actions = [], submitOptions={$type: 'filled'}, submitTitle, submitUrl, ...props}: FormOptions & React.HTMLAttributes<HTMLDivElement>) {
	
    const [formState, setFormState] = useState(inputs.reduce((a, v) => ({ ...a, [v.name]: v.value || ""}), {}) )
    const [formError, setFormError] = useState<null | string>(null)
    function updateFormState(event: ChangeEvent<HTMLInputElement>){
        setFormState({...formState, [event.target.name]: event.target.value})
    }
    async function formSubmit() {
        
        const response = await fetch(submitUrl, {
            method: 'POST',
            body: JSON.stringify(formState),
          })
          if(!response.status.toString().startsWith('2')){
            setFormError(response.status.toString()+await response.text())
          }
          else {
            setFormError(null)
          }
    }
    return (
		<FormWrapper>
			<FormContainer {...props}>
				<FormHeaderAndIcon>
					<Icon className="w-8" path={icon} />
					<span className="headline-small">{formHeader}</span>
				</FormHeaderAndIcon>
				<FormInputs>
                    {inputs.map((inp, i)=>(
                        <Input key={i} {...inp} onChange={(event)=>{updateFormState(event)}}/>
                    ))}
                </FormInputs>
                
                <span className="error-text">
                        {
                            formError
                        }
                </span>
				<FormActions>
                    <Button onClick={formSubmit} {...submitOptions}>{submitTitle}</Button>
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
