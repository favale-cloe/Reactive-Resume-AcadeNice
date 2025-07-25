import { z } from "zod";

import { defaultItem, itemSchema } from "../shared";

// Schema
export const skillSchema = itemSchema.extend({
  name: z.string(),
  description: z.string(),
  level: z.coerce.number().min(0).max(5).default(1),
  keywords: z.array(z.string()).default([]),
});

// Type
export type Skill = z.infer<typeof skillSchema>;

// Defaults
export const defaultSkill: Skill = {
  ...defaultItem,
  name: "",
  description: "",
  level: 1,
  keywords: [],
};

// Hard Skill Schema
export const hardSkillSchema = itemSchema.extend({
  name: z.string(),
  description: z.string(),
  level: z.coerce.number().min(0).max(5).default(1),
  keywords: z.array(z.string()).default([]),
});

// Soft Skill Schema
export const softSkillSchema = itemSchema.extend({
  name: z.string(),
});

// Types
export type HardSkill = z.infer<typeof hardSkillSchema>;
export type SoftSkill = z.infer<typeof softSkillSchema>;

// Defaults
export const defaultHardSkill: HardSkill = {
  ...defaultItem,
  name: "",
  description: "",
  level: 1,
  keywords: [],
};

export const defaultSoftSkill: SoftSkill = {
  ...defaultItem,
  name: "",
};
