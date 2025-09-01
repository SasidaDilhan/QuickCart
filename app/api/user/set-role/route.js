import { clerkClient } from "@clerk/nextjs/server";

import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    console.log("Setting role to seller for user:", userId);

    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role: "seller" },
    });

    console.log("Role updated successfully");

    return NextResponse.json({
      success: true,
      message: "Role updated to seller successfully",
    });
  } catch (error) {
    console.error("Error setting role:", error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
