import React from "react";
import { ReactNode } from "react";

interface LayoutProps {
    children?: Array<ReactNode> | ReactNode,
    title?: string,
    pageType?: string,
    lang?: string,
}
export default function({children, title, pageType, lang}:LayoutProps){
    return(
        <>
        <html lang={lang}>
        <head>
            <meta charSet={"UTF-8"} />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{title}</title>
        </head>
        <body>
            {children}
        </body>
        </html>
        </>
    )
}