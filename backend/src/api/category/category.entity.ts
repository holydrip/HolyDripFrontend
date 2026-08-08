import { Prisma } from "@prisma/client";

export type CategoryEntity = Prisma.CategoryGetPayload<{
    include: {
        products: true
    }
}>