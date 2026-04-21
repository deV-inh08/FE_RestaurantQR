import z from "zod";

export const GuestLoginBodySchema = z.object({
    tableNumber: z.number().int().positive('Table number must be positive'),
    name: z.string().min(1, 'Name must not be empty')
})

export type GuestLoginBodyType = z.TypeOf<typeof GuestLoginBodySchema>



export const GuestDtoSchema = z.object({
    id: z.number(),
    name: z.string(),
    tableId: z.number(),
    tableNumber: z.number(),
    createdAt: z.string()
})

export type GuestDtoType = z.TypeOf<typeof GuestDtoSchema>



export const GuestLoginResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        guest: GuestDtoSchema,
        accessToken: z.string(),
        refreshToken: z.string()
    })
})

export type GuestLoginResponseType = z.TypeOf<typeof GuestLoginResponseSchema>



export const GuestOrderDtoSchema = z.object({
    id: z.number(),
    guestId: z.number(),
    guestName: z.string(),
    tableId: z.number(),
    tableNumber: z.number(),
    dishSnapshotId: z.number(),
    dishName: z.string(),
    dishPrice: z.number(),
    dishImage: z.string().nullable(),
    accountId: z.number().nullable(),
    quantity: z.number(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
})

export type GuestOrderDtoType = z.TypeOf<typeof GuestOrderDtoSchema>



export const GuestOrderListResponseSchema = z.object({
    message: z.string(),
    data: z.array(GuestOrderDtoSchema)
})

export type GuestOrderListResponseType = z.TypeOf<typeof GuestOrderListResponseSchema>



export const GuestRefreshTokenResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        guest: GuestDtoSchema,
        accessToken: z.string(),
        refreshToken: z.string()
    })
})

export type GuestRefreshTokenResponseType = z.TypeOf<typeof GuestRefreshTokenResponseSchema>
