import React, { Component } from "react";
import { DataBase } from "../db/converter";
import Layout from "./layout"

export interface Props {
    title: string;
    lang: string;
}

// Important -- use the `default` export
export default function (props: Props) {
    return (
        <Layout>
            <h1>
                {props.title}
            </h1>
        </Layout>
    )
}