import { t } from "@lingui/macro";
import type { AspectRatio } from "@reactive-resume/ui";
import { Checkbox, Input, Label, ToggleGroup, ToggleGroupItem, Tooltip } from "@reactive-resume/ui";
import { useMemo } from "react";

import { useResumeStore } from "@/client/stores/resume";

// Aspect Ratio Helpers
const stringToRatioMap = {
  square: 1,
  portrait: 0.75,
  horizontal: 1.33,
} as const;

const ratioToStringMap = {
  "1": "square",
  "0.75": "portrait",
  "1.33": "horizontal",
} as const;

type AspectRatio = keyof typeof stringToRatioMap;

// Border Radius Helpers
const stringToBorderRadiusMap = {
  square: 0,
  rounded: 6,
  circle: 9999,
};

const borderRadiusToStringMap = {
  "0": "square",
  "6": "rounded",
  "9999": "circle",
};

type BorderRadius = keyof typeof stringToBorderRadiusMap;

export const PictureOptions = () => {
  const setValue = useResumeStore((state) => state.setValue);
  const picture = useResumeStore((state) => state.resume.data.basics.picture);

  const aspectRatio = useMemo(() => {
    const ratio = picture.aspectRatio.toString() as keyof typeof ratioToStringMap;
    return ratioToStringMap[ratio];
  }, [picture.aspectRatio]);

  const onAspectRatioChange = (value: string) => {
    if (!value) return;
    setValue("basics.picture.aspectRatio", stringToRatioMap[value as AspectRatio]);
  };

  const borderRadius = useMemo(() => {
    const radius = picture.borderRadius.toString() as keyof typeof borderRadiusToStringMap;
    return borderRadiusToStringMap[radius];
  }, [picture.borderRadius]);

  const onBorderRadiusChange = (value: string) => {
    if (!value) return;
    setValue("basics.picture.borderRadius", stringToBorderRadiusMap[value as BorderRadius]);
  };

  // Variables simples pour aria-labels
  const size = picture.size;
  const ratioLabel = aspectRatio;
  const borderRadiusLabel = borderRadius;

  return (
    <div className="flex flex-col gap-y-5">
      <div className="grid grid-cols-3 items-center gap-x-6">
        <Label htmlFor="picture.size">{t`Size (in px)`}</Label>
        <Input
          type="number"
          id="picture.size"
          placeholder="128"
          value={size}
          className="col-span-2"
          aria-label={t`Taille de l'image en pixels, valeur actuelle : ${size}`}
          onChange={(event) => {
            setValue("basics.picture.size", event.target.valueAsNumber);
          }}
        />
      </div>

      <div className="grid grid-cols-3 items-center gap-x-6">
        <Label htmlFor="picture.aspectRatio">{t`Aspect Ratio`}</Label>
        <div className="col-span-2 flex items-center justify-between">
          <ToggleGroup
            type="single"
            value={ratioLabel}
            className="flex items-center justify-center"
            aria-label={t`Sélectionnez le ratio d'aspect de l'image, valeur actuelle : ${ratioLabel}`}
            onValueChange={onAspectRatioChange}
          >
            <Tooltip content={t`Square`}>
              <ToggleGroupItem value="square" aria-label={t`Choisir le ratio carré`}>
                <div className="size-3 border border-foreground" />
              </ToggleGroupItem>
            </Tooltip>

            <Tooltip content={t`Horizontal`}>
              <ToggleGroupItem value="horizontal" aria-label={t`Choisir le ratio horizontal`}>
                <div className="h-2 w-3 border border-foreground" />
              </ToggleGroupItem>
            </Tooltip>

            <Tooltip content={t`Portrait`}>
              <ToggleGroupItem value="portrait" aria-label={t`Choisir le ratio portrait`}>
                <div className="h-3 w-2 border border-foreground" />
              </ToggleGroupItem>
            </Tooltip>
          </ToggleGroup>

          <Input
            min={0.1}
            max={2}
            step={0.05}
            type="number"
            className="w-[60px]"
            id="picture.aspectRatio"
            value={picture.aspectRatio}
            aria-label={t`Entrer manuellement le ratio d'aspect`}
            onChange={(event) => {
              if (!event.target.valueAsNumber) return;
              if (Number.isNaN(event.target.valueAsNumber)) return;
              setValue("basics.picture.aspectRatio", event.target.valueAsNumber);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 items-center gap-x-6">
        <Label htmlFor="picture.borderRadius">{t`Border Radius`}</Label>
        <div className="col-span-2 flex items-center justify-between">
          <ToggleGroup
            type="single"
            value={borderRadiusLabel}
            className="flex items-center justify-center"
            aria-label={t`Sélectionnez le rayon des bords de l'image`}
            onValueChange={onBorderRadiusChange}
          >
            <Tooltip content={t`Square`}>
              <ToggleGroupItem value="square" aria-label={t`Choisir bord carré`}>
                <div className="size-3 border border-foreground" />
              </ToggleGroupItem>
            </Tooltip>

            <Tooltip content={t`Rounded`}>
              <ToggleGroupItem value="rounded" aria-label={t`Choisir bord arrondi`}>
                <div className="size-3 rounded-sm border border-foreground" />
              </ToggleGroupItem>
            </Tooltip>

            <Tooltip content={t`Circle`}>
              <ToggleGroupItem value="circle" aria-label={t`Choisir bord en cercle`}>
                <div className="size-3 rounded-full border border-foreground" />
              </ToggleGroupItem>
            </Tooltip>
          </ToggleGroup>

          <Input
            min={0}
            step={2}
            max={9999}
            type="number"
            className="w-[60px]"
            id="picture.borderRadius"
            value={picture.borderRadius}
            aria-label={t`Entrer manuellement le rayon des bords`}
            onChange={(event) => {
              setValue("basics.picture.borderRadius", event.target.valueAsNumber);
            }}
          />
        </div>
      </div>

      <div>
        <div className="grid grid-cols-3 items-start gap-x-6">
          <div>
            <Label>{t`Effects`}</Label>
          </div>
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="picture.effects.hidden"
                checked={picture.effects.hidden}
                aria-label={t`Activer ou désactiver l'effet caché`}
                onCheckedChange={(checked) => {
                  setValue("basics.picture.effects.hidden", checked);
                }}
              />
              <Label htmlFor="picture.effects.hidden">{t`Hidden`}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="picture.effects.border"
                checked={picture.effects.border}
                aria-label={t`Activer ou désactiver l'effet bordure`}
                onCheckedChange={(checked) => {
                  setValue("basics.picture.effects.border", checked);
                }}
              />
              <Label htmlFor="picture.effects.border">{t`Border`}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="picture.effects.grayscale"
                checked={picture.effects.grayscale}
                aria-label={t`Activer ou désactiver l'effet niveaux de gris`}
                onCheckedChange={(checked) => {
                  setValue("basics.picture.effects.grayscale", checked);
                }}
              />
              <Label htmlFor="picture.effects.grayscale">{t`Grayscale`}</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
