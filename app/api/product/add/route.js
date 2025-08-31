//configure the cloudinary

import dbConnect from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/model/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { userID } = getAuth(request);

    const isSeller = await authSeller(userID);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: "not authorizes" });
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const offerPrice = formData.get("offerProce");

    const files = formData.getAll("images");

    if (!files || files.length === 0) {
      return NextResponse.json({
        success: false,
        message: "no files uploaded",
      });
    }

    const result = await Promise.all(
      files.map(async (file) => {
        const arryBuffer = await file.arryBuffer();
        const buffer = Buffer.from(arryBuffer);

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(buffer);
        });
      })
    );

    const image = result.map((result) => result.secure_url);

    await dbConnect();

    const newProduct = await Product.create({
      userID,
      name,
      description,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      image,
      date: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Upload Successful",
      newProduct,
    });
  } catch (error) {
    NextResponse.json({ success: false, message: error.message });
  }
}
