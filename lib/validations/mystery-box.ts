import { z } from 'zod'

export const BundleSizeEnum = z.enum(['Small', 'Medium', 'Large'])
export const DesignEnum = z.enum(['Simple', 'Extra', 'IDontCare'])
export const StylePreferenceEnum = z.enum(['Masculine', 'Feminine', 'IDontCare'])
export const MysteryBoxStatusEnum = z.enum(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'])

export const mysteryBoxCreationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  bundleSize: BundleSizeEnum,
  design: DesignEnum,
  stylePreference: StylePreferenceEnum.default('IDontCare'),
  neckMeasurements: z.string().min(1, 'Neck measurements are required').max(100, 'Neck measurements must be less than 100 characters'),
  wristMeasurements: z.string().min(1, 'Wrist measurements are required').max(100, 'Wrist measurements must be less than 100 characters'),
  colorPreference: z.string().max(255, 'Color preference must be less than 255 characters').optional().nullable(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional().nullable(),
  username: z.string().min(1, 'Username is required').max(255, 'Username must be less than 255 characters'),
  price: z.number().min(0, 'Price must be non-negative').default(0),
  status: MysteryBoxStatusEnum.default('Pending'),
})

export const mysteryBoxUpdateSchema = mysteryBoxCreationSchema.partial()

export const publicMysteryBoxCreationSchema = mysteryBoxCreationSchema.omit({
  title: true,
  price: true,
  status: true,
}).extend({
  title: z.string().optional(),
  neckMeasurements: z.string().min(1, 'Neck measurements are required').max(100, 'Neck measurements must be less than 100 characters'),
  wristMeasurements: z.string().min(1, 'Wrist measurements are required').max(100, 'Wrist measurements must be less than 100 characters'),
  username: z.string().min(1, 'Username is required').max(255, 'Username must be less than 255 characters'),
}).refine((data) => {
  // Ensure required fields are not null
  if (data.bundleSize === null || data.bundleSize === undefined) {
    throw new Error('Bundle size is required')
  }
  if (data.design === null || data.design === undefined) {
    throw new Error('Design is required')
  }
  return true
})

export type MysteryBoxCreationInput = z.infer<typeof mysteryBoxCreationSchema>
export type MysteryBoxUpdateInput = z.infer<typeof mysteryBoxUpdateSchema>
export type PublicMysteryBoxCreationInput = z.infer<typeof publicMysteryBoxCreationSchema>

export const BUNDLE_SIZE_PRICES = {
  Small: 10,
  Medium: 15,
  Large: 30,
} as const

export const DESIGN_PRICES = {
  Simple: 0,
  Extra: 10,
  IDontCare: 5,
} as const

export function calculateMysteryBoxPrice(bundleSize: keyof typeof BUNDLE_SIZE_PRICES, design: keyof typeof DESIGN_PRICES): number {
  return BUNDLE_SIZE_PRICES[bundleSize] + DESIGN_PRICES[design]
}

export function generateMysteryBoxTitle(bundleSize: string): string {
  if (!bundleSize) {
    throw new Error('Bundle size is required to generate title')
  }
  return `Mystery Box - ${bundleSize}`
}
