import tw from "tailwind-styled-components"

export const Button = tw.button<{
    $outline?: boolean
}>`
    rounded-full
    w-fit
    p-1
    px-[24px]
    ${(p) => (p.$outline ? "primary-text" : "on-primary-text")}
    label-large
    h-[36px]
    ${(p) => (p.$outline ? "" : "primary")}
    ${(p) => (p.$outline ? "outline" : "")}
`