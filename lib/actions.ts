"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";
import { sendNotification } from "./infobip";
import bcrypt from "bcryptjs";

export async function addDevice(formData: FormData) {
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const brand = formData.get("brand") as string;
    const model = formData.get("model") as string;
    const serialNo = formData.get("serialNo") as string;
    const description = formData.get("description") as string;

    if (!customerName || !customerPhone || !brand || !model || !description) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        const device = await prisma.device.create({
            data: {
                customerName,
                customerPhone,
                brand,
                model,
                serialNo: serialNo || "",
                description,
                status: "RECEIVED",
            },
        });

        // Send SMS Notification
        if (customerPhone) {
            const message = `To syskevi sas (${brand} ${model}) paralifthike. Arithmos entolis: #${device.id.slice(-6)}.`;
            // Running in background to not block UI
            sendNotification(customerPhone, message, ["SMS"]).catch(console.error);
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to add device:", error);
        return { success: false, error: "Database error" };
    }
}

export async function updateDeviceStatus(id: string, status: string, cost?: number, notes?: string) {
    console.log(`[ACTION] Updating status for device ${id} to ${status} with cost ${cost} and notes length ${notes?.length}`);
    try {
        const updateData: any = { status };
        if (typeof cost === 'number') {
            updateData.repairCost = cost;
        }
        if (notes) {
            updateData.repairNotes = notes;
        }

        const device = await prisma.device.update({
            where: { id },
            data: updateData,
        });
        console.log(`[ACTION] Device updated:`, device);

        // Send Notification based on status
        if (device.customerPhone) {
            // Check if SMS is enabled in settings
            const companyInfo = await prisma.companyInfo.findFirst();
            const isSmsEnabled = companyInfo?.enableSMS || false;

            if (isSmsEnabled) {
                let message = "";
                if (status === "READY") {
                    const costText = device.repairCost ? ` Kostos: ${device.repairCost}€. ` : "";
                    message = `H syskevi sas (${device.brand} ${device.model}) einai ETOIMI.${costText} Parakaloume paralavete tin apo to katastima.`;
                } else if (status === "REPAIRING") {
                    message = `H syskevi sas (${device.brand} ${device.model}) einai ypo episkevi.`;
                } else if (status === "DELIVERED") {
                    message = `H syskevi sas (${device.brand} ${device.model}) paradothike. Sas efcharistoume!`;
                }

                if (message) {
                    // Run in background
                    console.log(`[ACTION] Sending SMS to ${device.customerPhone}: ${message}`);
                    sendNotification(device.customerPhone, message, ["SMS"]).catch((err) => console.error("[ACTION] Notification failed:", err));
                }
            } else {
                console.log(`[ACTION] SMS skipped for ${device.customerPhone} (SMS Disabled in Settings)`);
            }
        }

        revalidatePath(`/dashboard/device/${id}`);
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, error: "Database error" };
    }
}

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: { id: true, username: true, role: true, createdAt: true },
        });
        return { success: true, users };
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return { success: false, error: "Database error" };
    }
}

export async function createUser(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!username || !password || !role) {
        return { success: false, error: "Missing fields" };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role,
            },
        });
        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to create user:", error);
        return { success: false, error: "Database error (Username might be taken)" };
    }
}

export async function updateDeviceDetails(id: string, formData: FormData) {
    const notes = formData.get("notes") as string;
    const cost = parseFloat(formData.get("cost") as string);

    try {
        await prisma.device.update({
            where: { id },
            data: {
                repairNotes: notes,
                repairCost: isNaN(cost) ? null : cost,
            },
        });
        revalidatePath(`/dashboard/device/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update device details:", error);
        return { success: false, error: "Database error" };
    }
}

export async function getCompanyInfo() {
    try {
        const info = await prisma.companyInfo.findFirst();
        return { success: true, info };
    } catch (error) {
        console.error("Failed to fetch company info:", error);
        return { success: false, error: "Database error" };
    }
}

export async function updateCompanyInfo(formData: FormData) {
    const rawData: any = {};

    // Extract fields if they exist in formData
    const fields = ["name", "phone", "address", "email", "website", "infobipApiKey", "infobipBaseUrl", "infobipSender"];
    fields.forEach(field => {
        const value = formData.get(field);
        if (value !== null) rawData[field] = value as string;
    });

    if (formData.has("enableSMS")) {
        rawData.enableSMS = formData.get("enableSMS") === "on";
    }

    // Validation only if we are creating new or updating core identity
    // If it's a partial update (e.g. just infobip settings), we might skip strict name/phone checks 
    // IF the record already exists.

    try {
        const existing = await prisma.companyInfo.findFirst();

        if (existing) {
            // Update
            await prisma.companyInfo.update({
                where: { id: existing.id },
                data: rawData,
            });
        } else {
            // Create - require minimum fields
            if (!rawData.name || !rawData.phone) {
                return { success: false, error: "Name and Phone are required for initial setup" };
            }
            await prisma.companyInfo.create({
                data: rawData,
            });
        }

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update company info:", error);
        return { success: false, error: "Database error" };
    }
}

export async function deleteUser(userId: string, currentUserId: string) {
    if (userId === currentUserId) {
        return { success: false, error: "You cannot delete your own account." };
    }

    try {
        await prisma.user.delete({
            where: { id: userId },
        });
        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { success: false, error: "Database error" };
    }
}

export async function updateUserPassword(userId: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" };
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update password:", error);
        return { success: false, error: "Database error" };
    }
}
