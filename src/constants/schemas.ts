import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: 'validation.required' })
    .min(3, { message: 'validation.fullNameMin' }),
  nationalId: z
    .string()
    .min(1, { message: 'validation.required' })
    .regex(/^\d{10}$/, { message: 'validation.nationalIdFormat' }),
  dateOfBirth: z
    .string()
    .min(1, { message: 'validation.required' })
    .refine(
      (val) => {
        const date = new Date(val);
        return date <= new Date();
      },
      { message: 'validation.dateOfBirthFuture' }
    ),
  gender: z
    .enum(['male', 'female', 'other', ''])
    .refine((val) => val !== '', { message: 'validation.required' }),
  address: z.string().min(1, { message: 'validation.required' }),
  city: z.string().min(1, { message: 'validation.required' }),
  state: z.string().min(1, { message: 'validation.required' }),
  country: z.string().min(1, { message: 'validation.required' }),
  phoneNumber: z
    .string()
    .min(1, { message: 'validation.required' })
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
      message: 'validation.phoneNumberFormat',
    }),
  email: z
    .string()
    .min(1, { message: 'validation.required' })
    .email({ message: 'validation.emailFormat' }),
});
// **************************
export const familyFinancialSchema = z.object({
  maritalStatus: z
    .enum(['single', 'married', 'divorced', 'widowed', ''])
    .refine((val) => val !== '', { message: 'validation.required' }),
  dependents: z.coerce
    .number()
    .int()
    .min(0, { message: 'validation.dependentsMin' }),
  employmentStatus: z
    .enum(['employed', 'unemployed', 'self-employed', 'retired', 'student', ''])
    .refine((val) => val !== '', { message: 'validation.required' }),
  monthlyIncome: z.coerce
    .number()
    .min(0, { message: 'validation.monthlyIncomeMin' }),
  housingStatus: z
    .enum(['owned', 'rented', 'government', 'other', ''])
    .refine((val) => val !== '', { message: 'validation.required' }),
});

export const situationSchema = z.object({
  financialSituation: z
    .string()
    .min(1, { message: 'validation.required' })
    .min(15, { message: 'validation.minChar' })
    .max(2000, { message: 'validation.maxChar' }),
  employmentCircumstances: z
    .string()
    .min(1, { message: 'validation.required' })
    .min(15, { message: 'validation.minChar' })
    .max(2000, { message: 'validation.maxChar' }),
  reasonForApplying: z
    .string()
    .min(1, { message: 'validation.required' })
    .min(15, { message: 'validation.minChar' })
    .max(2000, { message: 'validation.maxChar' }),
});
