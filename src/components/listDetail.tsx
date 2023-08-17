import tw from "tailwind-styled-components";

const ListDetailContainer = tw.div`
min-h-[500px] w-full h-full flex flex-row gap-2 surface-container-low self-stretch p-2 rounded-2xl
`
const ListDetailSide = tw.div`
flex flex-col
surface-container flex-1 p-4 rounded-2xl overflow-y-auto gap-2
`
const ListDetailTitle = tw.span`
title-small
`

const ListDetailBody = tw.div`
gap-1`

export {ListDetailContainer, ListDetailSide, ListDetailTitle, ListDetailBody}