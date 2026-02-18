import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is authenticated and is an ADMIN
        // Note: Adjust "ADMIN" to match your actual role value in database if different (e.g. "admin")
        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        await prisma.device.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json({ message: "Device deleted successfully" });
    } catch (error) {
        console.error("[DEVICE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
