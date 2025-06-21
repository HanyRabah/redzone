import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' });
    }
};

export async function POST(request: NextRequest) {
    const body = await request.json();
    try {
        const users = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                role: body.role,
                password: body.password,
            },
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' });
    }
};

export async function PUT(request: NextRequest) {
    const body = await request.json();
    try {
        const users = await prisma.user.update({
            where: {
                id: body.id,
            },
            data: {
                name: body.name,
                email: body.email,
                role: body.role,
            },
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' });
    }
};

export async function DELETE(request: NextRequest) {
    const body = await request.json();
    try {
        const users = await prisma.user.delete({
            where: {
                id: body.id,
            },
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' });
    }

};

