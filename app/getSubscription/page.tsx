"use client";

// import { Toaster } from "@/components/ui/toaster";
// import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useRef } from "react";
import axios from "axios";

interface FormType {
  name: string;
  phoneNumber: string;
  password: string;
  batch: string;
  birthday: string;
}

export default function GetPlans() {
  const [batches, setBatches] = useState<string[]>([
    // "6am - 7am",
    // "7am - 8am",
    // "8am - 9am",
    // "5pm - 6pm",
  ]);

  const currentDate = new Date();

  // Get day, month, and year components
  const day = currentDate.getDate().toString().padStart(2, "0"); // Ensure two digits
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = currentDate.getFullYear();

  // Last date of the month
  const lastDateObject = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const lastDate = lastDateObject.getDate().toString().padStart(2, "0");
  const lastFullDate = `${lastDate}-${month}-${year}`;
  //   console.log(lastFullDate);

  const [form, setForm] = useState<FormType>({
    name: "",
    phoneNumber: "",
    password: "",
    batch: batches.length > 0 ? batches[0] : "6am - 7am",
    birthday: `${year}-${month}-${day}`,
  });

  const router = useRouter();
  const [showBatches, setShowBatches] = useState<boolean>(false);
  //   const { toast } = useToast();
  const mainRef = useRef<HTMLElement | null>(null);
  const [invalidStyle, setInvalidStyle] = useState<{
    name: string;
    phoneNumber: string;
    password: string;
  }>({
    phoneNumber: "",
    name: "",
    password: "",
  });
  const invalidStyleValue = "border-red-500 border-[3px]";

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [sendingRequestMessage, setSendingRequestMessage] =
    useState<string>("");

  const [currentButtonStyle, setCurrentButtonStyle] = useState<string>("");

  const buttonStyleForRequest =
    "bg-[#10a37ebc] outline-[#e5e7eb] outline-[4px] outline";

  //   ----------------------------functions---------------------------------------

  const formSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendingRequestMessage("Subscribing, please wait...");
    setErrorMessage("");
    try {
      console.log(form);
      if (form.name.trim().length === 0) {
        setInvalidStyle((style) => {
          return {
            ...style,
            name: invalidStyleValue,
          };
        });
      }

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
        form.name.trim().length === 0 ||
        form.phoneNumber.trim().length < 10 ||
        form.password.trim().length < 8
      ) {
        throw new Error("Form inputs are not valid");
      }

      setCurrentButtonStyle(buttonStyleForRequest);

      try {
        const res = await axios.post("/api/subscription", {
          data: {
            name: form.name,
            mob_number: form.phoneNumber,
            password: form.password,
            birthday: new Date(form.birthday).toISOString(),
            batch: form.batch,
            expiry_date: new Date(`${year}-${month}-${lastDate}`).toISOString(),
            payment_details: {
              paymentId: "random...id",
            },
          },
        });
        console.log(res.data);
      } catch (err: any) {
        const { response } = err;
        throw new Error(response.data.error);
      }

      router.push("/getSubscriptionDetails");
    } catch (err: any) {
      console.log(err);
      //   toast({
      //     description: "Error occoured",
      //     style: { backgroundColor: "#dc2626", color: "#fff" },
      //   });
      setErrorMessage(err.message || "Error occured");
    }

    setCurrentButtonStyle("");
    setSendingRequestMessage("");
  };

  //   ----------------------------useEffects--------------------------------------

  //   If clicked within main content area then batches will be hidden
  useEffect(() => {
    const populateBatches = async () => {
      try {
        const res = await axios.get("/api/getBatches");
        const data = res.data.data as string[];
        setBatches(data);
      } catch (err: any) {
        console.log(err);
        setErrorMessage("Batches could not be populated");
      }
    };

    populateBatches();
  }, []);

  useEffect(() => {
    if (!mainRef.current) return;

    const init = () => {
      setShowBatches(false);
    };

    mainRef.current.addEventListener("click", init);

    return () => {
      if (mainRef.current) mainRef.current.removeEventListener("click", init);
    };
  }, []);
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
          Subscribe
        </h1>

        <h2 className=" font-bold text-[#2d3372] text-lg text-center mb-6">
          Till {lastFullDate}
        </h2>

        <div className=" text-sm text-red-900 text-center">
          {errorMessage.length > 0 ? `Error: ${errorMessage}` : ""}
        </div>

        <div className=" text-sm text-yellow-900 text-center">
          {sendingRequestMessage.length > 0 ? `${sendingRequestMessage}` : ""}
        </div>

        {/* Input for birthday*/}
        <div className="flex justify-between border-[1px] border-gray-200 rounded-md p-3  focus:outline-[#10a37f] mb-2 text-md w-full ${invalidStyle}">
          <span className=" text-gray-400">D.O.B *</span>
          <input
            value={form.birthday}
            onChange={(e) => {
              setForm((data) => {
                return {
                  ...data,
                  birthday: e.target.value,
                };
              });
            }}
            type={`date`}
            placeholder="Age"
            //   className={` border-[1px] border-gray-200 rounded-md p-3  focus:outline-[#10a37f] mb-2 text-md w-full ${invalidStyle}`}
            className=" outline-none"
          />
        </div>

        {/* Input for name */}
        <input
          value={form.name}
          onFocus={(e) => {
            if (invalidStyle.name.length > 0) {
              setInvalidStyle((style) => {
                return {
                  ...style,
                  name: "",
                };
              });
            }
          }}
          onBlur={(e) => {
            if (form.name.trim().length === 0) {
              setInvalidStyle((style) => {
                return {
                  ...style,
                  name: invalidStyleValue,
                };
              });
            } else {
              console.log("here");
              setInvalidStyle((style) => {
                return {
                  ...style,
                  name: "",
                };
              });
            }
          }}
          onChange={(e) => {
            setForm((data) => {
              return {
                ...data,
                name: e.target.value,
              };
            });
          }}
          type="text"
          placeholder={`Full name ${
            invalidStyle.name.length > 0 ? "required" : ""
          } *`}
          className={` border-[1px] border-gray-200 rounded-md p-3  focus:outline-[#10a37f] mb-2 text-md w-full ${invalidStyle.name}`}
        />

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

        {/* Choose batch */}
        <div className="relative">
          <div className=" flex items-center justify-between border-[1px] border-gray-200 rounded-md p-3  focus:outline-[#10a37f] mb-2 text-md w-full">
            <button
              className=" text-gray-500"
              onClick={(e) => {
                e.preventDefault();
                setShowBatches((toggle) => !toggle);
              }}
            >
              Batch
            </button>
            <span>{form.batch}</span>
          </div>
          <div
            className={` absolute left-0 top-10 ${
              !showBatches && "hidden"
            } bg-white px-2 py-1 rounded-md shadow-md border-[1px] border-gray-200`}
          >
            <ul className=" list-none">
              {batches.map((item) => (
                <li
                  key={item}
                  onClick={() => {
                    setForm((form) => {
                      return {
                        ...form,
                        batch: item,
                      };
                    });

                    setShowBatches(false);
                  }}
                  className={`hover:bg-purple-800 hover:text-white px-2 py-1 rounded-md hover:cursor-pointer ${
                    form.batch === item && "bg-purple-800 text-white"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Button to login or signup */}
        <button
          type="submit"
          disabled={currentButtonStyle.length > 0}
          className={`w-full mb-4 bg-[#10a37f] hover:bg-emerald-600 py-3 rounded-md text-white ${currentButtonStyle}`}
        >
          Pay ₹500
        </button>

        {/* Navigate to login page */}
        <div className="w-full text-sm text-center">
          Already have a subscription?
          <Link
            href={"/getSubscriptionDetails"}
            className=" text-emerald-600 ml-1"
          >
            Get token
          </Link>
        </div>
      </form>
      {/* <Toaster /> */}
      {/* last section */}
    </main>
  );
}
