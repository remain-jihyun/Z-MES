import { z } from "zod"

export const temperatureSchema = z
  .object({
    name: z.string().min(1, "명칭을 입력해주세요"),
    thresholdType: z.enum(["ABOVE", "BELOW", "RANGE"]),
    minValue: z.number().nullable(),
    maxValue: z.number().nullable(),
    description: z.string(),
  })
  .refine(
    (data) => {
      if (data.thresholdType === "RANGE")
        return data.minValue !== null && data.maxValue !== null && data.minValue < data.maxValue
      if (data.thresholdType === "ABOVE") return data.minValue !== null
      if (data.thresholdType === "BELOW") return data.maxValue !== null
      return true
    },
    { message: "임계유형에 맞는 온도값을 입력해주세요", path: ["maxValue"] }
  )

export const spaceSchema = z.object({
  name: z.string().min(1, "공간명을 입력해주세요"),
  spaceType: z.enum(["WORKSHOP", "WAREHOUSE"]),
  cleanZone: z.enum(["CLEAN", "SEMI_CLEAN", "GENERAL"]),
  depth: z.number().min(1).max(5),
  floor: z.string().min(1, "층을 입력해주세요"),
  temperatureName: z.string().nullable(),
})

export const processSchema = z.object({
  name: z.string().min(1, "공정명을 입력해주세요"),
  spaceName: z.string().min(1, "공간을 선택해주세요"),
  isCcp: z.boolean(),
  isInspection: z.boolean(),
  isCooling: z.boolean(),
  createKanban: z.boolean(),
  deviceId: z.string().nullable(),
  equipmentName: z.string().nullable(),
  description: z.string().nullable(),
})

export type TemperatureFormValues = z.infer<typeof temperatureSchema>
export type SpaceFormValues = z.infer<typeof spaceSchema>
export type ProcessFormValues = z.infer<typeof processSchema>
