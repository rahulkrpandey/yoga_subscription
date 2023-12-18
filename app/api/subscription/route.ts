import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
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

interface Batch {
  batch: string;
}

interface ReqData {
  name: string;
  mob_number: string;
  password: string;
  birthday: string;
  batch: string;
  expiry_date: string;
  payment_details: {
    paymentId: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const reqData = await req.json();
    const subsData = reqData.data as ReqData;

    const age = Math.floor(
      (new Date().getTime() - new Date(subsData.birthday).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );

    // console.log(age);

    if (age < 18 || age > 65) {
      throw new Error("Age should be in between 18 and 65");
    }

    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("mob_number", subsData.mob_number);

    if (error) {
      throw error;
    }

    if (data.length > 0) {
      const user = data[0] as User;
      if (user.password !== subsData.password) {
        throw new Error("User exists, but password is wrong");
      } else if (user.name !== subsData.name) {
        throw new Error("User exists, but name is wrong");
      } else if (
        user.birthday.substring(0, 10) !== subsData.birthday.substring(0, 10)
      ) {
        // console.log(user.birthday.substring(0, 10), subsData.birthday);
        throw new Error("User exists, but birthday is wrong");
      }

      const orderDataOrError = await supabase
        .from("orders")
        .select()
        .eq("user_number", user.mob_number);
      if (orderDataOrError.error) {
        throw orderDataOrError.error;
      }

      const order = orderDataOrError.data[0] as Order;
      if (order) {
        // console.log(order);
        const subsDate = new Date(order.subscription_date);
        const expDate = new Date(order.expiry_date);
        if (subsDate <= expDate) {
          throw new Error("Valid subscription already exist");
        }
      }
    } else {
      const { error } = await supabase.from("users").insert({
        name: subsData.name,
        mob_number: subsData.mob_number,
        birthday: subsData.birthday,
        password: subsData.password,
      });

      if (error) {
        throw error;
      }
    }

    const paymentResponse = await CreatePayment(subsData.payment_details);
    if (paymentResponse) {
      //   console.log("payment is successfull");
      const { data, error } = await supabase
        .from("orders")
        .select()
        .eq("user_number", subsData.mob_number);
      if (error) {
        throw error;
      }

      if (data.length > 0) {
        // if user has subscribed previously, then update subscription
        const { error } = await supabase
          .from("orders")
          .update({
            subscription_date: new Date().toISOString(),
            expiry_date: subsData.expiry_date,
            batch: subsData.batch,
          })
          .eq("user_number", subsData.mob_number);

        if (error) {
          throw error;
        }
      } else {
        // create subscription
        const { error } = await supabase
          .from("orders")
          .insert({
            subscription_date: new Date().toISOString(),
            expiry_date: subsData.expiry_date,
            batch: subsData.batch,
            user_number: subsData.mob_number,
          })
          .eq("user_number", subsData.mob_number);

        if (error) {
          throw error;
        }
      }
    } else {
      throw new Error("Payment is not successfull");
    }

    return NextResponse.json(
      {
        // data,
        data: "Created",
      },
      {
        status: 200,
      }
    );
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

async function CreatePayment(details: ReqData["payment_details"]) {
  return new Promise((resolve, reject) => {
    try {
      // send abstract api request to deduct payment etc
      resolve(true);
    } catch (err: any) {
      reject(err);
    }
  });
}
