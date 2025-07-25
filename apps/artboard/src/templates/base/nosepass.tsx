import type {
  Award,
  Certification,
  CustomSection,
  CustomSectionGroup,
  HardSkill,
  Interest,
  Language,
  Project,
  Publication,
  Reference,
  SectionKey,
  SectionWithItem,
  Social,
  SoftSkill,
  URL,
} from "@reactive-resume/schema";
import { Education, Experience, Volunteer } from "@reactive-resume/schema";
import { cn, isEmptyString, isUrl, sanitize } from "@reactive-resume/utils";
import get from "lodash.get";
import { Fragment } from "react";

import { BrandIcon, Picture } from "@/artboard/components";
import { calculateAge } from "@/artboard/libs/date";
import { useArtboardStore } from "@/artboard/store/artboard";
import type { TemplateProps } from "@/artboard/types/template";

const Header = () => {
  const basics = useArtboardStore((state) => state.resume.basics);
  const age = calculateAge(basics.birthday);

  return (
    <div className="grid grid-cols-4 gap-x-6">
      <div className="mt-1 space-y-2 text-right">
        <Picture className="ml-auto" />
      </div>

      <div className="col-span-3 space-y-2">
        <div>
          <div className="text-2xl font-bold">{basics.name}</div>
          <div className="text-base">{basics.headline}</div>
        </div>

        <div className="space-y-1 text-sm">
          {basics.location && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-map-pin text-primary" />
              <div>{basics.location}</div>
            </div>
          )}
          {basics.birthday && (
            <div className="flex items-center gap-x-1.5">
              <i aria-hidden className="ph ph-bold ph-cake text-primary" />
              <div>{age} ans</div>
            </div>
          )}
          {basics.phone && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-phone text-primary" />
              <a href={`tel:${basics.phone}`} target="_blank" rel="noreferrer">
                {basics.phone}
              </a>
            </div>
          )}
          {basics.email && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-at text-primary" />
              <a href={`mailto:${basics.email}`} target="_blank" rel="noreferrer">
                {basics.email}
              </a>
            </div>
          )}
          <Link url={basics.portfolio} />
        </div>

        <div className="flex flex-wrap gap-x-3 text-sm">
          {basics.customFields.map((item) => (
            <div key={item.id} className="flex items-center gap-x-1.5">
              <i className={cn(`ph ph-bold ph-${item.icon}`, "text-primary")} />
              {isUrl(item.value) ? (
                <a href={item.value} target="_blank" rel="noreferrer noopener nofollow">
                  {item.name || item.value}
                </a>
              ) : (
                <>
                  <span className="text-primary">{item.name}</span>
                  <span>{item.value}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Summary = () => {
  const section = useArtboardStore((state) => state.resume.sections.summary);

  if (!section.visible || isEmptyString(section.content)) return null;

  return (
    <section id={section.id} className="grid grid-cols-4 gap-x-6">
      <div className="text-right">
        <h4 className="font-medium text-primary">{section.name}</h4>
      </div>

      <div className="col-span-3">
        <div className="relative">
          <hr className="mt-3 border-primary pb-3" />
          <div className="absolute bottom-3 right-0 size-3 bg-primary" />
        </div>

        <div
          dangerouslySetInnerHTML={{ __html: sanitize(section.content) }}
          style={{ columns: section.columns }}
          className="wysiwyg"
        />
      </div>
    </section>
  );
};

type LinkProps = {
  url: URL;
  icon?: React.ReactNode;
  iconOnRight?: boolean;
  label?: string;
  className?: string;
};

const Link = ({ url, icon, iconOnRight, label, className }: LinkProps) => {
  if (!isUrl(url.href)) return null;

  return (
    <div className="flex items-center gap-x-1.5">
      {!iconOnRight && (icon ?? <i className="ph ph-bold ph-link text-primary" />)}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn("inline-block", className)}
      >
        {label ?? (url.label || url.href)}
      </a>
      {iconOnRight && (icon ?? <i className="ph ph-bold ph-link text-primary" />)}
    </div>
  );
};

type LinkedEntityProps = {
  name: string;
  url: URL;
  separateLinks: boolean;
  className?: string;
};

const LinkedEntity = ({ name, url, separateLinks, className }: LinkedEntityProps) => {
  return !separateLinks && isUrl(url.href) ? (
    <Link
      url={url}
      label={name}
      icon={<i className="ph ph-bold ph-globe text-primary" />}
      iconOnRight={true}
      className={className}
    />
  ) : (
    <div className={className}>{name}</div>
  );
};

type SectionProps<T> = {
  section: SectionWithItem<T> | CustomSectionGroup;
  children?: (item: T) => React.ReactNode;
  urlKey?: keyof T;
  dateKey?: keyof T;
  levelKey?: keyof T;
  summaryKey?: keyof T;
  keywordsKey?: keyof T;
};

const Section = <T,>({
  section,
  children,
  urlKey,
  dateKey,
  summaryKey,
  keywordsKey,
}: SectionProps<T>) => {
  if (!section.visible || section.items.length === 0) return null;

  return (
    <section id={section.id} className={cn("grid", dateKey !== undefined && "gap-y-4")}>
      <div className="grid grid-cols-4 gap-x-6">
        <div className="text-right">
          <h4 className="font-medium text-primary">{section.name}</h4>
        </div>

        <div className="col-span-3">
          <div className="relative">
            <hr className="mt-3 border-primary" />
            <div className="absolute bottom-0 right-0 size-3 bg-primary" />
          </div>
        </div>
      </div>

      {dateKey !== undefined && (
        <div className="grid grid-cols-4 gap-x-6 gap-y-4">
          {section.items
            .filter((item) => item.visible)
            .map((item) => {
              const url = (urlKey && get(item, urlKey)) as URL | undefined;
              const date = (dateKey && get(item, dateKey, "")) as string | undefined;
              const summary = (summaryKey && get(item, summaryKey, "")) as string | undefined;
              const keywords = (keywordsKey && get(item, keywordsKey, [])) as string[] | undefined;

              return (
                <Fragment key={item.id}>
                  <div className="text-right font-medium text-primary">{date}</div>

                  <div className="col-span-3 space-y-1">
                    {children?.(item as T)}

                    {url !== undefined && section.separateLinks && <Link url={url} />}

                    {summary !== undefined && !isEmptyString(summary) && (
                      <div
                        dangerouslySetInnerHTML={{ __html: sanitize(summary) }}
                        className="wysiwyg"
                      />
                    )}

                    {keywords !== undefined && keywords.length > 0 && (
                      <p className="text-sm">{keywords.join(", ")}</p>
                    )}
                  </div>
                </Fragment>
              );
            })}
        </div>
      )}

      {dateKey === undefined && (
        <div className="grid grid-cols-4 gap-x-6">
          <div
            className="col-span-3 col-start-2 grid gap-x-6 gap-y-3"
            style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}
          >
            {section.items
              .filter((item) => item.visible)
              .map((item) => {
                const url = (urlKey && get(item, urlKey)) as URL | undefined;
                const summary = (summaryKey && get(item, summaryKey, "")) as string | undefined;
                const keywords = (keywordsKey && get(item, keywordsKey, [])) as
                  | string[]
                  | undefined;

                return (
                  <div key={item.id}>
                    {children?.(item as T)}

                    {url !== undefined && section.separateLinks && <Link url={url} />}

                    {summary !== undefined && !isEmptyString(summary) && (
                      <div
                        dangerouslySetInnerHTML={{ __html: sanitize(summary) }}
                        className="wysiwyg"
                      />
                    )}

                    {keywords !== undefined && keywords.length > 0 && (
                      <p className="text-sm">{keywords.join(", ")}</p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </section>
  );
};

const Socials = () => {
  const section = useArtboardStore((state) => state.resume.sections.socials);

  return (
    <Section<Social> section={section}>
      {(item) => (
        <div>
          {isUrl(item.url.href) ? (
            <Link url={item.url} label={item.username} icon={<BrandIcon slug={item.icon} />} />
          ) : (
            <p>{item.username}</p>
          )}
          {!item.icon && <p className="text-sm">{item.network}</p>}
        </div>
      )}
    </Section>
  );
};

const Experience = () => {
  const section = useArtboardStore((state) => state.resume.sections.experience);

  return (
    <Section<Experience> section={section} urlKey="url" dateKey="date" summaryKey="summary">
      {(item) => (
        <div>
          <LinkedEntity
            name={item.company}
            url={item.url}
            separateLinks={section.separateLinks}
            className="font-bold"
          />
          <div>{item.position}</div>
          <div>{item.location}</div>
        </div>
      )}
    </Section>
  );
};

const Education = () => {
  const section = useArtboardStore((state) => state.resume.sections.education);

  return (
    <Section<Education> section={section} urlKey="url" dateKey="date" summaryKey="summary">
      {(item) => (
        <div>
          <LinkedEntity
            name={item.institution}
            url={item.url}
            separateLinks={section.separateLinks}
            className="font-bold"
          />
          <div>{item.area}</div>
          <div>{item.studyType}</div>
          <div>{item.score}</div>
        </div>
      )}
    </Section>
  );
};

const Awards = () => {
  const section = useArtboardStore((state) => state.resume.sections.awards);

  return (
    <Section<Award> section={section} urlKey="url" dateKey="date" summaryKey="summary">
      {(item) => (
        <div>
          <div className="font-bold">{item.title}</div>
          <LinkedEntity name={item.awarder} url={item.url} separateLinks={section.separateLinks} />
        </div>
      )}
    </Section>
  );
};

const Certifications = () => {
  const section = useArtboardStore((state) => state.resume.sections.certifications);

  return (
    <Section<Certification> section={section} urlKey="url" dateKey="date" summaryKey="summary">
      {(item) => (
        <div>
          <div className="font-bold">{item.name}</div>
          <LinkedEntity name={item.issuer} url={item.url} separateLinks={section.separateLinks} />
        </div>
      )}
    </Section>
  );
};

const HardSkills = () => {
  const section = useArtboardStore((state) => state.resume.sections.hardSkills);

  return (
    <Section<HardSkill> section={section} levelKey="level" keywordsKey="keywords">
      {(item) => (
        <div>
          <div className="font-bold">{item.name}</div>
          <div>{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const SoftSkills = () => {
  const section = useArtboardStore((state) => state.resume.sections.softSkills);

  return (
    <Section<SoftSkill> section={section}>
      {(item) => (
        <div>
          <div>{item.name}</div>
        </div>
      )}
    </Section>
  );
};

const Interests = () => {
  const section = useArtboardStore((state) => state.resume.sections.interests);

  return (
    <Section<Interest> section={section} keywordsKey="keywords">
      {(item) => <div className="font-bold">{item.name}</div>}
    </Section>
  );
};

const Publications = () => {
  const section = useArtboardStore((state) => state.resume.sections.publications);

  return (
    <Section<Publication> section={section} urlKey="url" dateKey="date" summaryKey="summary">
      {(item) => (
        <div>
          <LinkedEntity
            name={item.name}
            url={item.url}
            separateLinks={section.separateLinks}
            className="font-bold"
          />
          <div>{item.publisher}</div>
        </div>
      )}
    </Section>
  );
};

const Volunteer = () => {
  const section = useArtboardStore((state) => state.resume.sections.volunteer);

  return (
    <Section<Volunteer> section={section} urlKey="url" dateKey="date" summaryKey="summary">
      {(item) => (
        <div>
          <LinkedEntity
            name={item.organization}
            url={item.url}
            separateLinks={section.separateLinks}
            className="font-bold"
          />
          <div>{item.position}</div>
          <div>{item.location}</div>
        </div>
      )}
    </Section>
  );
};

const Languages = () => {
  const section = useArtboardStore((state) => state.resume.sections.languages);

  return (
    <Section<Language> section={section} levelKey="level">
      {(item) => (
        <div>
          <div className="font-bold">{item.name}</div>
          <div>{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const Projects = () => {
  const section = useArtboardStore((state) => state.resume.sections.projects);

  return (
    <Section<Project>
      section={section}
      urlKey="url"
      dateKey="date"
      summaryKey="summary"
      keywordsKey="keywords"
    >
      {(item) => (
        <div>
          <LinkedEntity
            name={item.name}
            url={item.url}
            separateLinks={section.separateLinks}
            className="font-bold"
          />
          <div>{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const References = () => {
  const section = useArtboardStore((state) => state.resume.sections.references);

  return (
    <Section<Reference> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div>
          <LinkedEntity
            name={item.name}
            url={item.url}
            separateLinks={section.separateLinks}
            className="font-bold"
          />
          <div>{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const Custom = ({ id }: { id: string }) => {
  const section = useArtboardStore((state) => state.resume.sections.custom[id]);

  return (
    <Section<CustomSection>
      section={section}
      urlKey="url"
      dateKey="date"
      summaryKey="summary"
      keywordsKey="keywords"
    >
      {(item) => (
        <div>
          <LinkedEntity
            name={item.name}
            url={item.url}
            separateLinks={section.separateLinks}
            className="font-bold"
          />
          <div>{item.description}</div>
          <div>{item.location}</div>
        </div>
      )}
    </Section>
  );
};

const mapSectionToComponent = (section: SectionKey) => {
  switch (section) {
    case "socials": {
      return <Socials />;
    }
    case "summary": {
      return <Summary />;
    }
    case "experience": {
      return <Experience />;
    }
    case "education": {
      return <Education />;
    }
    case "awards": {
      return <Awards />;
    }
    case "certifications": {
      return <Certifications />;
    }
    case "hardSkills": {
      return <HardSkills />;
    }
    case "softSkills": {
      return <SoftSkills />;
    }
    case "interests": {
      return <Interests />;
    }
    case "publications": {
      return <Publications />;
    }
    case "volunteer": {
      return <Volunteer />;
    }
    case "languages": {
      return <Languages />;
    }
    case "projects": {
      return <Projects />;
    }
    case "references": {
      return <References />;
    }
    default: {
      if (section.startsWith("custom.")) return <Custom id={section.split(".")[1]} />;

      return null;
    }
  }
};

export const Nosepass = ({ columns, isFirstPage = false }: TemplateProps) => {
  const name = useArtboardStore((state) => state.resume.basics.name);

  const [main, sidebar] = columns;

  return (
    <div className="p-custom space-y-6">
      <div className="flex items-center justify-between">
        <img alt="Europass Logo" className="h-[42px]" src="/assets/europass.png" />

        <p className="font-medium text-primary">Curriculum Vitae</p>

        <p className="font-medium text-primary">{name}</p>
      </div>

      {isFirstPage && <Header />}

      <div className="space-y-4">
        {main.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
        ))}

        {sidebar.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
        ))}
      </div>
    </div>
  );
};
