import { cn } from "@/lib/utils";
import { Input } from "./input";
import { HTMLInputTypeAttribute } from "react";

interface Props {
    label : string,
    inputType?: HTMLInputTypeAttribute,
    onChange?: (e : any) => void,
    value?: string,
    inputPlaceholder?: string,
    inputId?: string,
    inputClassName?: string,
    clasName?: string
    labelClassName?: string
}

export default function LabelledInput(props : Props){
    return <div className={cn(props.clasName, "flex flex-col gap-1 w-full")}>
        <label htmlFor={props.inputId} className={props.labelClassName}>{props.label}</label>
        <Input type={props.inputType} placeholder={props.inputPlaceholder}  id={props.inputId} onChange={props.onChange} value={props.value} className={cn(props.inputClassName, "w-full")}></Input>
    </div>
}  