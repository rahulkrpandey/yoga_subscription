import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SERVICE_KEY || ""
);

interface User {
  name: string;
  mob_number: string;
  birthday: string;
  password: string;
}

interface Order {
  id: string;
  subscription_date: string;
  expiry_date: string;
  batch: string;
  user_number: string;
}

interface ReqData {
  mob_number: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const reqData = await req.json();
    const subsData = reqData.data as ReqData;

    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("mob_number", subsData.mob_number);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      throw new Error("User not exist");
    }

    const user = data[0] as User;
    if (user.password !== subsData.password) {
      throw new Error("User not authenticated");
    } else {
      const { data, error } = await supabase
        .from("orders")
        .select()
        .eq("user_number", user.mob_number);
      if (error) {
        throw error;
      }

      if (data.length === 0) {
        throw new Error("Valid subscription does not exist");
      }

      const order = data[0] as Order;
      const subsDate = new Date(order.subscription_date);
      const expDate = new Date(order.expiry_date);
      if (subsDate > expDate) {
        throw new Error("Subscription is expired");
      }

      return NextResponse.json({
        data: {
          name: user.name,
          phoneNumber: user.mob_number,
          birthday: user.birthday,
          subscriptionDate: order.subscription_date,
          expiryDate: order.expiry_date,
          batch: order.batch,
        },
      });
    }
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: err.status || 400,
      }
    );
  }
}
