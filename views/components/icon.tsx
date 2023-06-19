import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import iconmapper from "../../utils/iconmapper"



export default function Icon(props: {icon: string}&DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) {
    return <span {...props as HTMLAttributes<HTMLSpanElement>} style={{fontFamily: "MDI"}}>
        {iconmapper(props.icon)}
    </span>
}