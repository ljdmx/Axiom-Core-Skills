// TEMPLATE_META:START
/*
@template-id: rest-routes
@version: 1.0.0
@description: RESTful routes template with auth middleware support
@customization-points: RESOURCE_NAME, CONTROLLER_IMPORT, USE_AUTH
@dependencies: express
@framework: Express
*/
// TEMPLATE_META:END

import { Router } from 'express';
import * as {{ RESOURCE_NAME }}Controller from '../controllers/{{RESOURCE_NAME_LOWER}}.controller';
// CUSTOMIZATION_POINT:START - AUTH_MIDDLEWARE
// import { authMiddleware } from '../middleware/auth.middleware';
// CUSTOMIZATION_POINT:END

const router = Router();

// CUSTOMIZATION_POINT:START - USE_AUTH
// router.use(authMiddleware); // Uncomment to protect all routes
// CUSTOMIZATION_POINT:END

// Get all {{RESOURCE_NAME}}s
router.get('/', {{ RESOURCE_NAME }}Controller.getAll);

// Get {{RESOURCE_NAME}} by ID
router.get('/:id', {{ RESOURCE_NAME }}Controller.getById);

// Create new {{RESOURCE_NAME}}
router.post('/', {{ RESOURCE_NAME }}Controller.create);

// Update {{RESOURCE_NAME}}
router.patch('/:id', {{ RESOURCE_NAME }}Controller.update);

// Delete {{RESOURCE_NAME}}
router.delete('/:id', {{ RESOURCE_NAME }}Controller.remove);

export default router;
