import tw from "tailwind-styled-components";

const ListDetailContainer = tw.div`
min-h-[500px] w-full h-full flex flex-row gap-2 surface-container-low self-stretch p-2 rounded-2xl
`
const ListDetailSide = tw.div`
surface-container flex-1 p-4 rounded-2xl overflow-y-auto
`

export {ListDetailContainer, ListDetailSide}