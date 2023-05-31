import React, { Component } from "react";
import { DataBase } from "../db/converter";

export interface Props {
    title: string;
    lang: string;
}

// Important -- use the `default` export
export default class MyView extends Component<Props> {
    constructor(props: Props) {
        super(props);
        this.state = {
            count: 0
        }
    }
    render() {
        return <div>
            <div>
            Data base
            </div>
            <button>
                Click me
            </button>

            
        </div>;
    }
}