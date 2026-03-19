// TEMPLATE_META:START
/*
@template-id: crud-controller
@version: 1.0.0
@description: Generic CRUD controller with Zod validation and Prisma ORM
@customization-points: MODEL_NAME, VALIDATION_SCHEMA, RELATIONS
@dependencies: @prisma/client, zod, express
@framework: Express + Prisma
*/
// TEMPLATE_META:END

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { success, error } from '../utils/response';

const prisma = new PrismaClient();

// CUSTOMIZATION_POINT:START - VALIDATION_SCHEMA
const {{ MODEL_NAME }}Schema = z.object({
    // Define your schema fields here
    name: z.string().min(1),
    // Add more fields as needed
});
// CUSTOMIZATION_POINT:END

/**
 * Get all {{MODEL_NAME}}s
 */
export const getAll = async (req: Request, res: Response) => {
    try {
        // CUSTOMIZATION_POINT:START - RELATIONS
        const items = await prisma.{{ MODEL_NAME_LOWER }
    }.findMany({
        // include: { /* Add relations here */ },
        orderBy: { createdAt: 'desc' }
    });
    // CUSTOMIZATION_POINT:END
    return success(res, items);
} catch (err: any) {
    return error(res, err.message, 500, err);
}
};

/**
 * Get {{MODEL_NAME}} by ID
 */
export const getById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await prisma.{{ MODEL_NAME_LOWER }
    }.findUnique({
        where: { id }
    });

    if (!item) {
        return error(res, '{{MODEL_NAME}} not found', 404);
    }

    return success(res, item);
} catch (err: any) {
    return error(res, err.message, 500, err);
}
};

/**
 * Create new {{MODEL_NAME}}
 */
export const create = async (req: Request, res: Response) => {
    try {
        const data = {{ MODEL_NAME }
    }Schema.parse(req.body);
    const item = await prisma.{{ MODEL_NAME_LOWER }
}.create({ data });
return success(res, item, '{{MODEL_NAME}} created successfully', 201);
  } catch (err: any) {
    return error(res, err.message, 400, err);
}
};

/**
 * Update {{MODEL_NAME}}
 */
export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = {{ MODEL_NAME }
    }Schema.partial().parse(req.body);

    const item = await prisma.{{ MODEL_NAME_LOWER }
}.update({
    where: { id },
    data
});

return success(res, item, '{{MODEL_NAME}} updated successfully');
  } catch (err: any) {
    return error(res, err.message, 400, err);
}
};

/**
 * Delete {{MODEL_NAME}}
 */
export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.{ { MODEL_NAME_LOWER } }.delete ({ where: { id } });
        return success(res, null, '{{MODEL_NAME}} deleted successfully');
    } catch (err: any) {
        return error(res, err.message, 500, err);
    }
};
