"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ContactMethodField } from "../customField/ContactMethodField";
import { CalendarField } from "../customField/CalendarField";
import { useMeetingContext } from "@/context/MeetingContext";
import {
  useCreateMeeting,
  useMeeting,
  useUpdateMeeting,
} from "../../api/use-meetings";
import { useUserContext } from "@/context/UserContext";
import { ContactMethod, MeetingPayload } from "../../types";

/* ============================
   Schema Validation
============================ */
const meetingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contactMethod: z.number().min(1, "Contact method is required"),
  contactValue: z.string().min(1, "Contact value is required"),
  scheduleDate: z.string().min(1, "Schedule date is required"),
  scheduleTime: z.string().min(1, "Schedule time is required"),
  purpose: z.string().optional(),
});

type MeetingFormData = z.infer<typeof meetingSchema>;

/* ============================
   Reusable Required Label
============================ */
const RequiredLabel = ({
  text,
  hasError,
}: {
  text: string;
  hasError?: boolean;
}) => (
  <label
    className={`block text-sm font-medium ${
      hasError ? "text-red-500" : "text-gray-700"
    }`}
  >
    {text} <span className="text-[#7F56D9]">*</span>
  </label>
);

/* ============================
   Component
============================ */
const MeetupForm = () => {
  const router = useRouter();
  const { setUserData } = useUserContext();
  const {
    createdMeetingId,
    meetingMode,
    setCreatedMeetingId,
    setIsMeetingCreated,
  } = useMeetingContext();

  /* ============================
     Form setup
  ============================ */
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactMethod: 0,
      contactValue: "",
      scheduleDate: "",
      scheduleTime: "",
      purpose: "",
    },
  });

  const [selectedTimeId, setSelectedTimeId] = useState<number | undefined>();
  const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(null);


  /* ============================
     Fetch meeting (EDIT MODE)
  ============================ */
  const meetingIdForEdit =
    meetingMode === "edit" && createdMeetingId ? createdMeetingId : null;
  const { data: meetingData, isFetching } = useMeeting(meetingIdForEdit);

  /* ============================
     Mutations
  ============================ */
  const { mutate: createMutate, isPending: createLoading } = useCreateMeeting();
  const { mutate: updateMutate, isPending: updateLoading } = useUpdateMeeting();

  /* ============================
     Set default values on EDIT
  ============================ */
  useEffect(() => {
    if (meetingMode === "edit" && meetingData) {
      reset({
        firstName: meetingData.firstName,
        lastName: meetingData.lastName,
        email: meetingData.email,
        contactMethod: meetingData.contactMethod.id,
        contactValue: meetingData.contactValue,
        scheduleDate: meetingData.scheduleDate,
        scheduleTime: meetingData.scheduleTime.label,
        purpose: meetingData.purpose,
      });
      setSelectedTimeId(meetingData.scheduleTime.id);

      setSelectedMethod(meetingData.contactMethod);
    }
  }, [meetingMode, meetingData, reset]);


  useEffect(() => {
    if (meetingMode === "edit" && meetingData) {
      setValue("scheduleDate", meetingData.scheduleDate, {
        shouldDirty: false,
      });
      setValue("scheduleTime", meetingData.scheduleTime.toString(), {
        shouldDirty: false,
      });
    }
  }, [meetingData, meetingMode, setValue]);

  /* ============================
     Watch form values for user context
  ============================ */
  useEffect(() => {
    const subscription = watch((values) => {
      setUserData({
        firstName: values.firstName || "",
        lastName: values.lastName || "",
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, setUserData]);

  /* ============================
     Handle time selection
  ============================ */
  const handleTimeSelect = (id: number, label: string) => {
    setSelectedTimeId(id);
    setValue("scheduleTime", label, { shouldValidate: true });
  };

  /* ============================
     Submit handler
  ============================ */
  const onSubmit = (data: MeetingFormData) => {
    if (selectedTimeId === undefined) {
      alert("Please select a schedule time.");
      return;
    }

    const payload: MeetingPayload = {
      ...data,
      purpose: data.purpose ?? "",
      scheduleTime: selectedTimeId,
    };

    if (meetingMode === "create") {
      createMutate(payload, {
        onSuccess: (res) => {
          setCreatedMeetingId(res.id);
          setIsMeetingCreated(true);
          router.push("/meeting/status");
        },
      });
    } else if (meetingMode === "edit" && createdMeetingId) {
      updateMutate(
        { id: createdMeetingId, payload },
        {
          onSuccess: () => {
            setIsMeetingCreated(true);
            router.push("/meeting/status");
          },
        }
      );
    }
  };

  /* ============================
     Derived states
  ============================ */
  const isLoading = createLoading || updateLoading || isFetching;
  const watchScheduleDate = watch("scheduleDate");
  const watchScheduleTime = watch("scheduleTime");

  // دکمه submit در حالت ادیت فقط وقتی فعال می‌شود که فرم تغییر کرده باشد
  const isFormValidForSubmit =
    !isLoading &&
    !!watchScheduleDate &&
    !!watchScheduleTime &&
    (meetingMode === "create" ? isValid : isDirty);

  const getInputClass = (hasError?: boolean) =>
    `mt-1 block w-full rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:ring-1 focus:ring-[#7F56D9] ${
      hasError
        ? "border border-red-500"
        : "border border-gray-300 focus:border-[#7F56D9]"
    }`;

  /* ============================
     UI
  ============================ */
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto p-8 space-y-6"
    >
      {/* Header */}
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900">
          {meetingMode === "edit"
            ? "Edit Your Meeting"
            : "Enter Your Details To Confirm Your Meeting Time"}
        </h2>
        <p className="text-sm text-gray-500">
          We'll notify the agent right away.
        </p>
      </header>

      {/* First Name */}
      <div>
        <RequiredLabel text="First Name" hasError={!!errors.firstName} />
        <input
          type="text"
          placeholder="Enter Your First name"
          {...register("firstName")}
          className={getInputClass(!!errors.firstName)}
        />
      </div>

      {/* Last Name */}
      <div>
        <RequiredLabel text="Last Name" hasError={!!errors.lastName} />
        <input
          type="text"
          placeholder="Enter Your Last name"
          {...register("lastName")}
          className={getInputClass(!!errors.lastName)}
        />
      </div>

      {/* Email */}
      <div>
        <RequiredLabel text="Email" hasError={!!errors.email} />
        <input
          type="Enter Your email"
          placeholder="example@email.com"
          {...register("email")}
          className={getInputClass(!!errors.email)}
        />
      </div>

      {/* Preferred Contact Method */}
      <div>
        <ContactMethodField
          register={register}
          setValue={setValue}
          error={!!errors.contactValue}
          defaultMethod={selectedMethod}
        />
      </div>

      {/* Schedule Time */}
      <div>
        <CalendarField
          value={watch("scheduleDate")}
          onChange={(val: string) =>
            setValue("scheduleDate", val, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          error={!!errors.scheduleDate}
          setTimeRangeType={(id, label) => {
            setSelectedTimeId(id);
            setValue("scheduleTime", label, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Purpose <span className="text-gray-400">(max - 250 chars)</span>
        </label>
        <textarea
          placeholder="Meeting purpose..."
          {...register("purpose")}
          className={`${getInputClass()} h-24 resize-none`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isFormValidForSubmit}
        className={`w-40 rounded-md py-2.5 text-sm font-medium text-white transition ${
          isFormValidForSubmit
            ? "bg-[#7F56D9] hover:opacity-90"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {meetingMode === "edit" ? "Update Meeting" : "Schedule Meeting"}
      </button>
    </form>
  );
};

export default MeetupForm;
