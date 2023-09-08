import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { number } from "zod";

export interface IButtonWIcon {
  $type: "filled" | "tonal" | "outline" | "text";
  $icon?: string;
  $iconSize?: number;
}

const ButtonStyles = tw.button<
  IButtonWIcon & {
    $hasChildren?: boolean;
  } & React.ButtonHTMLAttributes<IButtonWIcon>
>`
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
        : p.$type === "filled"
        ? "on-primary-text"
        : "primary-text"}
    label-large
    h-[36px]
    ${(p) =>
      p.$type === "outline"
        ? ""
        : p.$type === "tonal"
        ? "secondary-container"
        : p.$type === "filled"
        ? "primary"
        : ""}
    ${(p) =>
      p.$type === "outline"
        ? "border-[var(--md-sys-color-primary)] border-1 border"
        : ""}
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
  $iconSize = 20,
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
      {$icon && <Icon path={$icon} style={{ width: $iconSize }} />}
      {children}
    </ButtonStyles>
  );
};

export const ResponsiveButton = ({
  minMediaWidth = 640,
  children,
  ...props
}: IButtonWIcon &
  React.ButtonHTMLAttributes<{}> & { minMediaWidth?: number }) => {
  const [matches, setMatches] = useState(true);
  const handler = (e: { matches: boolean }) => setMatches(e.matches);
  useEffect(() => {
    if (window) {
      window
        .matchMedia("(min-width: " + minMediaWidth + "px)")
        .addEventListener("change", handler);
    }
  });
  if (matches) {
    return <Button {...props}>{children}</Button>;
  } else {
    return <Button {...props} />;
  }
};

export const Center = tw.div`
flex flex-1 justify-center items-center
`;

export const ChipStyles = tw.button<
  IButtonWIcon & {
    $hasChildren?: boolean;
  } & React.ButtonHTMLAttributes<IButtonWIcon>
>`
flex
justify-center
items-center
w-fit
rounded-md
${(p) => p.$icon && "pl-2"}
${(p) => (p.$hasChildren ? "px-2" : "px-1")}
${(p) => (p.$type === "outline" ? "" : "")}
${(p) =>
  p.$type === "outline"
    ? "on-surface-text"
    : p.$type === "tonal"
    ? "on-secondary-container-text"
    : p.$type === "filled"
    ? "on-primary-text"
    : "primary-text"}
label-large
py-1
h-min
${(p) =>
  p.$type === "outline"
    ? ""
    : p.$type === "tonal"
    ? "secondary-container"
    : p.$type === "filled"
    ? "primary"
    : ""}
${(p) =>
  p.$type === "outline"
    ? "border-[var(--md-sys-color-outline)] border-1 border"
    : ""}
hover:opacity-90
focus:opacity-90
gap-2
active:opacity-80
hover:duration-150
hover:transition-all
active:duration-150
active:transition-all
`;

export const Chip = ({
  $type,
  $icon,
  children,
  ...props
}: IButtonWIcon & React.ButtonHTMLAttributes<{}>) => {
  return (
    <ChipStyles
      $type={$type}
      $icon={$icon}
      $hasChildren={children !== undefined}
      {...props}
    >
      {$icon && <Icon path={$icon} style={{ width: 18 }} />}
      {children}
    </ChipStyles>
  );
};
