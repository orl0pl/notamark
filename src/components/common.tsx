import Icon from "@mdi/react";
import tw from "tailwind-styled-components";

interface IButtonWIcon {
	$type: "filled" | "tonal" | "outline";
	$icon?: string;
	$iconSize?: number;
}

const ButtonStyles = tw.button<IButtonWIcon & { $hasChildren?: boolean } & React.ButtonHTMLAttributes<IButtonWIcon>>`
    flex
    justify-center
    items-center
    rounded-full
    w-fit
    ${(p) => p.$icon && "pl-3"}
    ${(p) => (p.$hasChildren ? "px-6" : "px-3")}
    ${(p) => (p.$type === "outline" ? "" : "")}
    ${(p) =>
			p.$type === "outline"
				? "primary-text"
				: p.$type === "tonal"
				? "on-secondary-container-text"
				: "on-primary-text"}
    label-large
    h-[36px]
    ${(p) => (p.$type === "outline" ? "" : p.$type === "tonal" ? "secondary-container" : "primary")}
    ${(p) =>
			p.$type === "outline" ? "outline-[var(--md-sys-color-primary)] outline-1 outline" : ""}
    hover:opacity-90
    focus:opacity-90
    gap-2
    active:opacity-80
    hover:duration-150
    hover:transition-all
    active:duration-150
    active:transition-all
    
    `;

export const Button = ({
	$type,
	$icon,
	$iconSize = 5,
	children,
    ...props
}: IButtonWIcon & React.ButtonHTMLAttributes<{}>) => {
	return (
		<ButtonStyles
			$type={$type}
			$icon={$icon}
			$iconSize={$iconSize}
			$hasChildren={children !== undefined}
            {...props}
		>
			{$icon && <Icon path={$icon} className={`w-${$iconSize}`} />}
			{children}
		</ButtonStyles>
	);
};
