#!/usr/bin/env node

/**
 * Database Seeding Script
 * Seeds initial data (permissions, roles, admin user)
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function seedPermissions() {
    log('\n1️⃣ Seeding permissions...', 'blue');

    const permissions = [
        // Blog permissions
        { resource: 'blog', action: 'read', description: 'View blogs' },
        { resource: 'blog', action: 'write', description: 'Create blogs' },
        { resource: 'blog', action: 'update', description: 'Edit blogs' },
        { resource: 'blog', action: 'delete', description: 'Delete blogs' },
        { resource: 'blog', action: 'publish', description: 'Publish blogs' },

        // User permissions
        { resource: 'user', action: 'read', description: 'View users' },
        { resource: 'user', action: 'update', description: 'Edit users' },
        { resource: 'user', action: 'delete', description: 'Delete users' },
        { resource: 'user', action: 'manage', description: 'Manage all users' },

        // Comment permissions
        { resource: 'comment', action: 'read', description: 'View comments' },
        { resource: 'comment', action: 'write', description: 'Write comments' },
        { resource: 'comment', action: 'moderate', description: 'Moderate comments' },
    ];

    for (const perm of permissions) {
        await prisma.permission.upsert({
            where: {
                resource_action: {
                    resource: perm.resource,
                    action: perm.action,
                },
            },
            update: {},
            create: perm,
        });
    }

    log(`  ✓ Created ${permissions.length} permissions`, 'green');
}

async function seedRoles() {
    log('\n2️⃣ Seeding roles...', 'blue');

    // User role
    const userRole = await prisma.role.upsert({
        where: { name: 'user' },
        update: {},
        create: {
            name: 'user',
            description: 'Regular user - can read and write own content',
        },
    });

    // Editor role
    const editorRole = await prisma.role.upsert({
        where: { name: 'editor' },
        update: {},
        create: {
            name: 'editor',
            description: 'Content editor - can publish and moderate',
        },
    });

    // Admin role
    const adminRole = await prisma.role.upsert({
        where: { name: 'admin' },
        update: {},
        create: {
            name: 'admin',
            description: 'Administrator - full access to all resources',
        },
    });

    log('  ✓ Created 3 roles (user, editor, admin)', 'green');

    return { userRole, editorRole, adminRole };
}

async function assignPermissions(roles) {
    log('\n3️⃣ Assigning permissions to roles...', 'blue');

    const allPermissions = await prisma.permission.findMany();

    // User role permissions
    const userPermissions = allPermissions.filter(p =>
        (p.resource === 'blog' && ['read', 'write'].includes(p.action)) ||
        (p.resource === 'comment' && ['read', 'write'].includes(p.action)) ||
        (p.resource === 'user' && p.action === 'read')
    );

    await prisma.rolePermission.deleteMany({
        where: { roleId: roles.userRole.id },
    });

    await prisma.rolePermission.createMany({
        data: userPermissions.map(p => ({
            roleId: roles.userRole.id,
            permissionId: p.id,
        })),
    });

    log(`  ✓ Assigned ${userPermissions.length} permissions to user role`, 'green');

    // Editor role permissions
    const editorPermissions = allPermissions.filter(p =>
        p.resource !== 'user' || p.action === 'read'
    );

    await prisma.rolePermission.deleteMany({
        where: { roleId: roles.editorRole.id },
    });

    await prisma.rolePermission.createMany({
        data: editorPermissions.map(p => ({
            roleId: roles.editorRole.id,
            permissionId: p.id,
        })),
    });

    log(`  ✓ Assigned ${editorPermissions.length} permissions to editor role`, 'green');

    // Admin role gets all permissions
    await prisma.rolePermission.deleteMany({
        where: { roleId: roles.adminRole.id },
    });

    await prisma.rolePermission.createMany({
        data: allPermissions.map(p => ({
            roleId: roles.adminRole.id,
            permissionId: p.id,
        })),
    });

    log(`  ✓ Assigned ${allPermissions.length} permissions to admin role`, 'green');
}

async function createAdminUser(adminRole) {
    log('\n4️⃣ Creating admin user...', 'blue');

    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            passwordHash,
            name: 'Admin User',
            isActive: true,
        },
    });

    // Assign admin role
    await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: admin.id,
                roleId: adminRole.id,
            },
        },
        update: {},
        create: {
            userId: admin.id,
            roleId: adminRole.id,
        },
    });

    log('  ✓ Admin user created', 'green');
    log(`  📧 Email: ${email}`, 'yellow');
    log(`  🔑 Password: ${password}`, 'yellow');
    log('  ⚠️  Change password immediately!', 'yellow');
}

async function main() {
    log('\n🌱 Database Seeding', 'blue');
    log('━'.repeat(50), 'blue');

    try {
        await seedPermissions();
        const roles = await seedRoles();
        await assignPermissions(roles);
        await createAdminUser(roles.adminRole);

        log('\n✅ Seeding completed successfully!', 'green');
        log('━'.repeat(50), 'green');

    } catch (error) {
        log('\n❌ Seeding failed: ' + error.message, 'red');
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
