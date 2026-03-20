// TEMPLATE_META:START
/*
@template-id: service-layer
@version: 1.0.0
@description: Business logic layer separation for complex operations
@dependencies: @prisma/client
@customization-points: MODEL_NAME, METHOD_NAME
@framework: Backend
*/
// TEMPLATE_META:END

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const {{ METHOD_NAME }}Service = async (data: any) => {
    // Complex logic here
    // e.g., Transaction, external API call, multiple DB writes

    return await prisma.$transaction(async (tx) => {
        // 1. Step one
        const result = await tx.{{ MODEL_NAME_LOWER }
    }.create({ data });

    // 2. Step two
    // ...

    return result;
});
};
