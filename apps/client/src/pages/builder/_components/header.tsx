import { t } from "@lingui/macro";
import { HouseSimple, Lock, SidebarSimple } from "@phosphor-icons/react";
import { Button, Tooltip } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useBuilderStore } from "@/client/stores/builder";
import { useResumeStore } from "@/client/stores/resume";

export const BuilderHeader = () => {
  const title = useResumeStore((state) => state.resume.title);
  const locked = useResumeStore((state) => state.resume.locked);

  const toggle = useBuilderStore((state) => state.toggle);
  const isDragging = useBuilderStore(
    (state) => state.panel.left.handle.isDragging || state.panel.right.handle.isDragging,
  );
  const leftPanelSize = useBuilderStore((state) => state.panel.left.size);
  const rightPanelSize = useBuilderStore((state) => state.panel.right.size);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  const onToggle = (side: "left" | "right") => {
    toggle(side);
  };

  return (
    <header
      style={{
        left: isMobile ? "0" : `${leftPanelSize}%`,
        right: isMobile ? "0" : `${rightPanelSize}%`,
      }}
      className={cn(
        "fixed inset-x-0 top-0 z-[60] h-16 bg-background backdrop-blur-lg lg:z-20",
        !isDragging && "transition-[left,right]",
      )}
      role="banner"
    >
      <div className="flex h-full items-center justify-between bg-secondary-accent/50 px-4">
        <Button
          size="icon"
          variant="ghost"
          className="flex lg:hidden"
          aria-label={t`Toggle left panel`}
          onClick={() => {
            onToggle("left");
          }}
        >
          <SidebarSimple aria-hidden="true" />
        </Button>

        <div className="flex items-center justify-center gap-x-1 lg:mx-auto">
          <Button asChild size="icon" variant="ghost">
            <Link to="/dashboard/resumes" aria-label={t`Go back to dashboard`}>
              <HouseSimple aria-hidden="true" />
            </Link>
          </Button>

          <span className="mr-2 text-xs opacity-40" aria-hidden="true">
            /
          </span>

          <h1 className="max-w-[300px] truncate text-base font-medium" title={title}>
            {title}
          </h1>

          {locked && (
            <Tooltip content={t`This resume is locked, please unlock to make further changes.`}>
              <Lock size={14} className="ml-2 opacity-75" aria-hidden="true" />
            </Tooltip>
          )}
        </div>

        <div />
      </div>
    </header>
  );
};
