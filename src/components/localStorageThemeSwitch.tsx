import { useTheme } from "next-themes";
import { Button } from "./common";
import Icon from "@mdi/react";
import { mdiWeatherNight, mdiWeatherSunny } from "@mdi/js";

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      suppressHydrationWarning
      $type="outline"
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      $icon={theme === "dark" ? mdiWeatherNight : mdiWeatherSunny}
    >
      {/* <Icon path={theme === 'dark' ? mdiWeatherNight : mdiWeatherSunny} className='w-6'/> */}
    </Button>
  );
}
