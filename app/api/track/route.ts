import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { ticketId, phone } = await request.json();

        if (!ticketId || !phone) {
            return new NextResponse("Missing Ticket ID or Phone", { status: 400 });
        }

        // Find device where ID ends with ticketId AND phone matches
        // Note: Prisma doesn't support endsWith for ID directly in all DBs, but for SQLite/Postgres it's fine or we filter in memory if needed.
        // However, for security and cleaner ID lookup, we should probably fetch by ID if it was a full ID.
        // Since ticketId is last 6 chars, we might need to use `endsWith` or store a shortCode.
        // For now, let's try to match by partial ID if possible, or strict phone match + iterate.
        // Actually, `endsWith` filter is supported in Prisma for String fields.

        const devices = await prisma.device.findMany({
            where: {
                customerPhone: phone,
                id: {
                    endsWith: ticketId,
                },
            },
            select: {
                id: true,
                customerName: true,
                brand: true,
                model: true,
                status: true,
                repairCost: true,
                createdAt: true,
                updatedAt: true,
                description: true, // Maybe safe?
                repairNotes: true, // Maybe safe?
            }
        });

        if (devices.length === 0) {
            return new NextResponse("Device not found", { status: 404 });
        }

        // Return the specific device (or first one if multiple matches, which is rare with last 6 chars + phone)
        return NextResponse.json({ success: true, device: devices[0] });

    } catch (error) {
        console.error("[TRACK_API]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
