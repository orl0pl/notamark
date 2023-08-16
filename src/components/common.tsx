import tw from "tailwind-styled-components"

export const Button = tw.button<{
    $type: 'filled' | 'tonal' | 'outline' 
}>`
    flex
    justify-center
    items-center
    rounded-full
    w-fit
    px-[24px]
    ${(p) => (p.$type === 'outline' ? "" : "")}
    ${(p) => (p.$type === 'outline' ? "primary-text" : (
        p.$type === 'tonal' ? "on-secondary-container-text" : "on-primary-text"
    ))}
    label-large
    h-[36px]
    ${(p) => (p.$type === 'outline' ? "" : (
        p.$type === 'tonal' ? "interactive-surface-secondarycontainer" : "interactive-surface-primary"
    ))}
    ${(p) => (p.$type === 'outline' ? "outline-[var(--md-sys-color-primary)] outline-1 outline" : "")}
`