import dbConnect from "@/config/db";
import User from "@/model/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    await dbConnect();
    const user = await User.findById(userId);

    const { cartItems } = user;

    return NextResponse.json({ success: true, cartItems });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
