"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";

interface FormType {
  phoneNumber: string;
  password: string;
}

interface ApiResponseType extends Omit<FormType, "password"> {
  name: string;
  batch: string;
  birthday: string;
  expiryDate: string;
  subscriptionDate: string;
}

export default function GetPlans() {
  const [form, setForm] = useState<FormType>({
    phoneNumber: "",
    password: "",
  });

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  //   const { toast } = useToast();
  const mainRef = useRef<HTMLElement | null>(null);
  const [invalidStyle, setInvalidStyle] = useState<{
    phoneNumber: string;
    password: string;
  }>({
    phoneNumber: "",
    password: "",
  });
  const invalidStyleValue = "border-red-500 border-[3px]";
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [sendingRequestMessage, setSendingRequestMessage] =
    useState<string>("");

  const [apiResponse, setApiResponse] = useState<ApiResponseType>({
    name: "",
    expiryDate: "",
    subscriptionDate: "",
    birthday: "",
    batch: "",
    phoneNumber: "",
  });

  const [currentButtonStyle, setCurrentButtonStyle] = useState<string>("");

  const buttonStyleForRequest =
    "bg-[#10a37ebc] outline-[#e5e7eb] outline-[4px] outline";

  //   ----------------------------functions---------------------------------------

  const formSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendingRequestMessage("Fetching details... please wait");
    setErrorMessage("");
    try {
      console.log(form);
      if (form.phoneNumber.trim().length < 10) {
        setInvalidStyle((style) => {
          return {
            ...style,
            phoneNumber: invalidStyleValue,
          };
        });
      }

      if (form.password.trim().length === 0) {
        setInvalidStyle((style) => {
          return {
            ...style,
            password: invalidStyleValue,
          };
        });
      }

      if (
        form.phoneNumber.trim().length < 10 ||
        form.password.trim().length === 0
      ) {
        throw new Error("Input is not valid");
      }

      setCurrentButtonStyle(buttonStyleForRequest);

      try {
        const res = await axios.post("/api/getDetails", {
          data: {
            mob_number: form.phoneNumber,
            password: form.password,
          },
        });

        const apiData = res.data.data as ApiResponseType;
        setForm({
          phoneNumber: "",
          password: "",
        });
        setApiResponse(apiData);
        console.log(res.data);
      } catch (err: any) {
        const { response } = err;
        throw new Error(response.data.error);
      }
    } catch (err: any) {
      console.log(err);
      setApiResponse({
        name: "",
        phoneNumber: "",
        birthday: "",
        expiryDate: "",
        subscriptionDate: "",
        batch: "",
      });
      setErrorMessage(err.message || "Error occured");
    }

    setCurrentButtonStyle("");
    setSendingRequestMessage("");
  };

  //   ----------------------------useEffects--------------------------------------

  //   If clicked within main content area then batches will be hidden
  useEffect(() => {}, []);
  return (
    <main
      ref={mainRef}
      className="flex flex-col items-center justify-start gap-8 h-screen bg-white text-black"
    >
      <div className=" bg-emerald-800 font-semibold text-3xl text-center py-2 w-full text-white">
        Get Your Yoga Substription
      </div>

      {/* form */}
      <form
        onSubmit={(e) => formSubmitHandler(e)}
        className="mx-auto w-full max-w-[20.4rem]"
      >
        {/* Heading */}
        <h1 className=" font-bold text-[#2d3372] text-3xl text-center mb-1">
          Get subscription details
        </h1>
        <div className=" text-sm text-red-900 text-center">
          {errorMessage.length > 0 ? `Error: ${errorMessage}` : ""}
        </div>

        <div className=" text-sm text-yellow-900 text-center">
          {sendingRequestMessage.length > 0 ? `${sendingRequestMessage}` : ""}
        </div>

        {/* Input for number */}
        <input
          value={form.phoneNumber}
          onFocus={(e) => {
            if (invalidStyle.phoneNumber.length > 0) {
              setInvalidStyle((style) => {
                return {
                  ...style,
                  phoneNumber: "",
                };
              });
            }
          }}
          onBlur={(e) => {
            if (form.phoneNumber.length !== 10) {
              setInvalidStyle((style) => {
                return {
                  ...style,
                  phoneNumber: invalidStyleValue,
                };
              });
            }
          }}
          onChange={(e) => {
            setForm((data) => {
              return {
                ...data,
                phoneNumber: e.target.value,
              };
            });
          }}
          type={`number`}
          placeholder={`Mobile number ${
            invalidStyle.phoneNumber.length > 0 ? "required" : ""
          } *`}
          className={` border-[1px] border-gray-200 rounded-md p-3  focus:outline-[#10a37f] mb-2 text-md w-full ${invalidStyle.phoneNumber}`}
        />

        {/* Input for password */}
        <input
          value={form.password}
          onFocus={(e) => {
            if (invalidStyle.password.length > 0) {
              setInvalidStyle((style) => {
                return {
                  ...style,
                  password: "",
                };
              });
            }
          }}
          onBlur={(e) => {
            if (form.password.trim().length === 0) {
              setInvalidStyle((style) => {
                return {
                  ...style,
                  password: invalidStyleValue,
                };
              });
            } else {
              console.log("here");
              setInvalidStyle((style) => {
                return {
                  ...style,
                  password: "",
                };
              });
            }
          }}
          onChange={(e) => {
            setForm((data) => {
              return {
                ...data,
                password: e.target.value,
              };
            });
          }}
          type="password"
          placeholder={`Password ${
            invalidStyle.password.length > 0 ? "required" : ""
          } *`}
          className={` border-[1px] border-gray-200 rounded-md p-3  focus:outline-[#10a37f] mb-2 text-md w-full ${invalidStyle.password}`}
        />

        {/* Button to login or signup */}
        <button
          type="submit"
          disabled={currentButtonStyle.length > 0}
          className={`w-full mb-4 bg-[#10a37f] hover:bg-emerald-600 py-3 rounded-md text-white ${currentButtonStyle}`}
        >
          Submit
        </button>

        {/* Navigate to login page */}
        <div className="w-full text-sm text-center">
          Don't have a subscription?
          <Link href={"/getSubscription"} className=" text-emerald-600 ml-1">
            Get subscription
          </Link>
        </div>
      </form>

      {apiResponse.name?.length > 0 && (
        <div className=" flex flex-col gap-2 border-[1px] border-slate-200 rounded-md px-2 py-1">
          <span>
            <span className=" font-bold">Name:</span> {apiResponse.name}
          </span>
          <span>
            <span className=" font-bold">Phone number:</span>{" "}
            {apiResponse.phoneNumber}
          </span>
          <span>
            <span className=" font-bold">Birthday:</span>{" "}
            {apiResponse.birthday.substring(0, 10)}
          </span>
          <span>
            <span className=" font-bold">Subscription date:</span>{" "}
            {apiResponse.subscriptionDate.substring(0, 10)}
          </span>
          <span>
            <span className=" font-bold">Expiry date:</span>{" "}
            {apiResponse.expiryDate.substring(0, 10)}
          </span>
          <span>
            <span className=" font-bold">Batch:</span> {apiResponse.batch}
          </span>
        </div>
      )}
      {/* <Toaster /> */}
      {/* last section */}
    </main>
  );
}
