"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/getSubscription");
  }, []);
  return <main className="">Page is available: base/getSubscription</main>;
}
