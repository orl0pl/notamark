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
        p.$type === 'tonal' ? "secondary-container" : "primary"
    ))}
    ${(p) => (p.$type === 'outline' ? "outline-[var(--md-sys-color-primary)] outline-1 outline" : "")}
    hover:opacity-90
    focus:opacity-90
    gap-2
    active:opacity-80
    hover:duration-150
    hover:transition-all
    active:duration-150
    active:transition-all
    
    `