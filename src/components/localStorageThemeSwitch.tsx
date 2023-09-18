import { useTheme } from "next-themes";
import { Button } from "./common";
import Icon from "@mdi/react";
import { mdiWeatherNight, mdiWeatherSunny } from "@mdi/js";
import { useTheme as useMD3Theme } from "md3-react";

function ThemeText(){
  const { theme } = useMD3Theme();
  return theme;
}

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();
  const {toggleTheme, theme: md3Theme} = useMD3Theme();
  //console.log(toggleTheme.toString(), 'th');
  return (
    <Button
      suppressHydrationWarning
      $type="outline"
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
        console.log(theme === "dark" ? "light" : "dark", 'new')
        toggleTheme(theme === "dark" ? "light" : "dark")
        console.log(toggleTheme, md3Theme)
      }}
      $icon={theme === "dark" ? mdiWeatherNight : mdiWeatherSunny}
    >
      <ThemeText/>
      {/* <Icon path={theme === 'dark' ? mdiWeatherNight : mdiWeatherSunny} className='w-6'/> */}
    </Button>
  );
}
