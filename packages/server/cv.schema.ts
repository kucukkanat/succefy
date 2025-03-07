import { z } from "npm:zod";

const ContactInfoSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  //   phone: z.string(),
  //   location: z.object({
  //     city: z.string(),
  //     country: z.string(),
  //     postalCode: z.string().optional(),
  //   }),
  //   socialProfiles: z
  //     .object({
  //       linkedin: z.string().url().optional(),
  //       github: z.string().url().optional(),
  //       personalWebsite: z.string().url().optional(),
  //     })
  //     .optional(),
});

const EducationEntrySchema = z.object({
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  gpa: z.any().optional(),
  honors: z.array(z.string()).optional(),
});

const WorkExperienceEntrySchema = z.object({
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrentRole: z.boolean(),
  responsibilities: z.array(z.string()),
  achievements: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
});

const SkillCategorySchema = z.object({
  category: z.string(),
  skills: z.array(z.string()),
});

export const CandidateCVSchema = z.object({
  contactInfo: ContactInfoSchema,
  summary: z.string(),
  education: z.array(EducationEntrySchema),
  workExperience: z.array(WorkExperienceEntrySchema),
  skills: z.array(SkillCategorySchema),
  languages: z
    .array(
      z.object({
        language: z.string(),
        proficiency: z.string().optional(),
      })
    )
    .optional(),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuingOrganization: z.string(),
        date: z.string(),
      })
    )
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
        link: z.string().url().optional(),
      })
    )
    .optional(),
});

export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type EducationEntry = z.infer<typeof EducationEntrySchema>;
export type WorkExperienceEntry = z.infer<typeof WorkExperienceEntrySchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type CandidateCV = z.infer<typeof CandidateCVSchema>;
