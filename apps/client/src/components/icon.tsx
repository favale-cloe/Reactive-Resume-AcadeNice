import { useTheme } from "@reactive-resume/hooks";
import { cn } from "@reactive-resume/utils";

type Props = {
  size?: number;
  className?: string;
};

export const Icon = ({ size = 32, className }: Props) => {
  const { isDarkMode } = useTheme();

  let src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  switch (isDarkMode) {
    case false: {
      src = "/icon/dark.png";
      break;
    }
    case true: {
      src = "/icon/light.png";
      break;
    }
  }

  return (
    <img src={src} width={size} height={size} alt="" className={cn("rounded-sm", className)} />
  );
};
