import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Dropzone from "react-dropzone";
import { IoCameraOutline } from "react-icons/io5";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import usericon from "@/assets/images/user.png";
import { useFetch } from "@/hooks/useFetch";
import { setUser } from "@/redux/user/user.slice";
import { showToast } from "@/helpers/showtoast";
import { getEnv } from "@/helpers/getEnv";

const profileSchema = z.object({
  name: z.string().min(3, "Enter your name"),
  email: z.string().email("Please enter a valid email."),
  bio: z.string().optional(),
});

const Profile = () => {
  const dispatch = useDispatch();
  const storedUser = useSelector((state) => state.user.user);
  const { data: userData, loading: userLoading, error: userError } = useFetch(
    storedUser?._id
      ? `${getEnv("VITE_API_BASE_URL")}/user/get-user/${storedUser._id}`
      : null,
    { method: "get", credentials: "include" },
    [storedUser?._id],
  );
  const currentUser = userData?.user || storedUser;
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      bio: currentUser?.bio || "",
      password: "",
    }),
    [currentUser],
  );

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const avatarSrc = filePreview || currentUser?.avatar || usericon;

  const initials = useMemo(() => {
    const name = currentUser?.name || "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [storedUser?.name]);

  const handleFileSelection = (files) => {
    if (!files?.length) return;

    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    setFilePreview(URL.createObjectURL(files[0]));
    setFile(files[0]);
  };

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("data", JSON.stringify(values));

      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/user/update-user/${currentUser?._id}`,
        {
          method: "put",
          credentials: "include",
          body: formData,
        },
      );
      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }
      dispatch(setUser(data.user));
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex justify-center items-center">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (userError) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex justify-center items-center">
        <p className="text-red-600">Failed to load profile.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 flex justify-center">
      <Card className="w-full max-w-3xl p-8">
        <div className="flex flex-col items-center">
          <Dropzone onDrop={handleFileSelection}>
            {({ getRootProps, getInputProps }) => (
              <section className="mb-6 flex flex-col items-center">
                <div
                  {...getRootProps()}
                  className="relative flex cursor-pointer flex-col items-center"
                >
                  <input {...getInputProps()} />
                  <Avatar size="lg" className="group">
                    <AvatarImage
                      src={avatarSrc}
                      alt={storedUser?.name || "User avatar"}
                    />
                    <div className="absolute inset-0 z-10 hidden items-center justify-center rounded-full bg-black/30 group-hover:flex">
                      <IoCameraOutline color="#fff" size={24} />
                    </div>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </div>
              </section>
            )}
          </Dropzone>

          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="w-11/12 mx-auto grid gap-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Name</FieldLabel>
                    <Input {...field} placeholder="Enter your name" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input {...field} placeholder="Enter your email address" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="bio"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Bio</FieldLabel>
                    <Textarea {...field} placeholder="Enter bio" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-semibold"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
