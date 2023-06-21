import React from "react";
export type TextType =
	| "label-small"
	| "label-medium"
	| "label-large"
	| "title-small"
	| "title-medium"
	| "title-large"
	| "body-small"
	| "body-medium"
	| "body-large"
	| "headline-small"
	| "headline-medium"
	| "headline-large"
	| "display-small"
	| "display-medium"
	| "display-large";
export default function Text(props: { type?: TextType, children?: React.ReactNode } & React.HTMLProps<HTMLSpanElement>) {
	return <span className={props.type ? `${props.type}` : "body-medium"} {...props}>{props.children}</span>;
}
