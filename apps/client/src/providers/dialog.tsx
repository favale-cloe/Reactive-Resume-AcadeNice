import { AwardsDialog } from "../pages/builder/sidebars/left/dialogs/awards";
import { CertificationsDialog } from "../pages/builder/sidebars/left/dialogs/certifications";
import { CustomSectionDialog } from "../pages/builder/sidebars/left/dialogs/custom-section";
import { EducationDialog } from "../pages/builder/sidebars/left/dialogs/education";
import { ExperienceDialog } from "../pages/builder/sidebars/left/dialogs/experience";
import { HardSkillsDialog } from "../pages/builder/sidebars/left/dialogs/hard-skills";
import { InterestsDialog } from "../pages/builder/sidebars/left/dialogs/interests";
import { LanguagesDialog } from "../pages/builder/sidebars/left/dialogs/languages";
import { ProjectsDialog } from "../pages/builder/sidebars/left/dialogs/projects";
import { PublicationsDialog } from "../pages/builder/sidebars/left/dialogs/publications";
import { ReferencesDialog } from "../pages/builder/sidebars/left/dialogs/references";
import { SocialsDialog } from "../pages/builder/sidebars/left/dialogs/socials";
// import { SkillsDialog } from "../pages/builder/sidebars/left/dialogs/skills";
import { SoftSkillsDialog } from "../pages/builder/sidebars/left/dialogs/soft-skills";
import { VolunteerDialog } from "../pages/builder/sidebars/left/dialogs/volunteer";
import { ImportDialog } from "../pages/dashboard/resumes/_dialogs/import";
import { LockDialog } from "../pages/dashboard/resumes/_dialogs/lock";
import { ResumeDialog } from "../pages/dashboard/resumes/_dialogs/resume";
import { TwoFactorDialog } from "../pages/dashboard/settings/_dialogs/two-factor";
import { useResumeStore } from "../stores/resume";

type Props = {
  children: React.ReactNode;
};

export const DialogProvider = ({ children }: Props) => {
  const isResumeLoaded = useResumeStore((state) => Object.keys(state.resume).length > 0);

  return (
    <>
      {children}

      <div id="dialog-root">
        <ResumeDialog />
        <LockDialog />
        <ImportDialog />
        <TwoFactorDialog />

        {isResumeLoaded && (
          <>
            <SocialsDialog />
            <ExperienceDialog />
            <EducationDialog />
            <AwardsDialog />
            <CertificationsDialog />
            <InterestsDialog />
            <LanguagesDialog />
            <ProjectsDialog />
            <PublicationsDialog />
            <VolunteerDialog />
            <HardSkillsDialog />
            <SoftSkillsDialog />
            <ReferencesDialog />
            <CustomSectionDialog />
          </>
        )}
      </div>
    </>
  );
};
