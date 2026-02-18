import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbPath = path.join(process.cwd(), "dev.db");

    if (!fs.existsSync(dbPath)) {
        return NextResponse.json({ error: "Database file not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(dbPath);
    const filename = `backup-${new Date().toISOString().split('T')[0]}.db`;

    return new NextResponse(fileBuffer, {
        headers: {
            "Content-Type": "application/x-sqlite3",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}
