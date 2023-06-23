import React from "react";
import { DataBase } from "../db/converter";
import styled from "@emotion/styled";
import Text from "./components/text";
import Icon from "./components/icon";
import { accounts } from "../server";
const SubjectsListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 8px;
    border-radius: 8px;
    gap: 8px;
    border: 1px solid var(--md-sys-color-outline);`
const SubjectList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    padding: 0;
    margin: 0;`

const SubjectListItem = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    background-color: var(--md-sys-color-surface-container);
    `

const SubjectListItemGroup = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;`
export default function AdminPanel({ data, url }: { data: DataBase, url: string }) {
    return (
        <html lang="pl">
            <head>
                <link rel="stylesheet" href={`${url}static/katex/katex.min.css`} />
                <link rel="stylesheet" href={`${url}static/mainstyles.css`} />
                <link rel="stylesheet" href={`${url}static/css/tokens.css`} />
                <link rel="stylesheet" href={`${url}static/lessonstyle.css`} />
                <link rel="icon" type="image/x-icon" href={`${url}static/favicon.ico`} />
                <title>Panel zarządzania</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />{" "}
            </head>
            <body style={{ padding: "12px", gap: "12px" }}>
                <Text type="headline-small">Panel zarządzania</Text>
                <SubjectsListWrapper>
                    <Text type="label-large">Lista przedmiotów</Text>
                    <SubjectList>
                        {data.subjects.map((subject, i) => (
                            <SubjectListItem key={i}>
                                <SubjectListItemGroup>
                                    <Text type="label-medium" style={{ marginInline: "8px" }}>{subject.id}</Text>
                                    <Text type="title-medium">{subject.name}</Text>
                                    <Text type="label-small">Liczba informacji: {subject.infos.length}</Text>
                                </SubjectListItemGroup>
                                <SubjectListItemGroup>
                                    <a style={{ "textDecoration": "none" }} href={`edit/${subject.id}`}>
                                        <button id="edit">
                                            <Icon icon="pencil" />
                                        </button>
                                    </a>
                                    <a href={`delete/${subject.id}`} style={{ "textDecoration": "none" }}>
                                        <button id="delete" style={{ backgroundColor: "var(--md-sys-color-error-container)", color: "var(--md-sys-color-on-error-container)" }}>
                                            <Icon icon="trash-can" />
                                        </button>
                                    </a>
                                </SubjectListItemGroup>

                            </SubjectListItem>

                        ))}
                    </SubjectList>
                    <div>
                        <a href="add" style={{ "textDecoration": "none" }}>
                            <button><Icon icon="plus" /> Dodaj przedmiot</button>
                        </a>
                    </div>
                </SubjectsListWrapper>
                <SubjectsListWrapper>
                    <Text type="label-large">Lista przedmiotów</Text>
                    <SubjectList>
                        {data.persons.map((person, i) => (
                            <SubjectListItem key={i}>
                                <SubjectListItemGroup>
                                    <Text type="label-medium" style={{ marginInline: "8px" }}>{i}</Text>
                                    <Text type="title-medium">{person.name}</Text>
                                    <Text type="label-small">Role: {person.roles.join(", ")}</Text>
                                </SubjectListItemGroup>
                                <SubjectListItemGroup>
                                    <a style={{ "textDecoration": "none" }} href={`edit-roles/${person.id}`}>
                                        <button id="edit">
                                            <Icon icon="pencil" />
                                        </button>
                                    </a>
                                    {/* <a href={`delete-person/${person.id}`} style={{ "textDecoration": "none" }}>
                                        <button id="delete" style={{ backgroundColor: "var(--md-sys-color-error-container)", color: "var(--md-sys-color-on-error-container)" }}>
                                            <Icon icon="trash-can" />
                                        </button>
                                    </a> */}
                                </SubjectListItemGroup>
                            </SubjectListItem>

                        ))}
                    </SubjectList>
                    <div>
                        <a href="add-person" style={{ "textDecoration": "none" }}>
                            <button><Icon icon="plus" /> Dodaj osobę</button>
                        </a>
                    </div>
                </SubjectsListWrapper>
            </body>
            <script src={`${url}static/actions.js`}></script>
        </html>
    );
}