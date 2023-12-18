import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SERVICE_KEY || ""
);

export async function GET(req: NextRequest) {
  try {
    console.log("here");
    const { data, error } = await supabase.from("batches").select();

    if (error) {
      throw error;
    }

    // const batches = data.map((batchObj) => batchObj.batch);
    console.log("data: ", data);

    return NextResponse.json(
      {
        data: data,
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
