import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import logo from "@/assets/images/Logo.png";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import PasswordInput from "./PasswordInput";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showtoast";
import { RouteIndex, RouteSignIn } from "@/helpers/RouteName";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/helpers/firebase";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";

const signUpSchema = z
  .object({
    name: z.string().min(3, "Name should contain at least 3 characters"),

    email: z.email("Please enter a valid email"),

    password: z.string().min(8, "Password should be at least 8 characters"),

    confirmPassword: z.string(),

    terms: z.literal(true, {
      errorMap: () => ({
        message: "Please accept Terms & Conditions",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const handleGoogleLogin = async () => {
      try {
        const googleResponse = await signInWithPopup(auth, provider);
        const user = googleResponse.user;
        const bodyData = {
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        };
        const response = await fetch(
          `${getEnv("VITE_API_BASE_URL")}/auth/google-login`,
          {
            method: "post",
            headers: { "Content-type": "application/json" },
            credentials: "include",
            body: JSON.stringify(bodyData),
          },
        );
        const data = await response.json();
        if (!response.ok) {
          showToast("error", data.message);
          return;
        }
  
        dispatch(setUser(data.user));
        navigate(RouteIndex);
        showToast("success", data.message);
      } catch (error) {
        showToast("error", error.message);
      }
    };

  const form = useForm({
    resolver: zodResolver(signUpSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },

    mode: "onChange",
  });

  async function onSubmit(values) {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/register`,
        {
          method: "post",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        showToast("error", data.message);
        return;
      }

      navigate(RouteSignIn);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    }
  }

  return (
    <>
      {/* Header */}

      <div className="mb-8 text-center">
        <img src={logo} alt="Blog Logo" className="mx-auto mb-5 h-20 w-auto" />

        <h1 className="text-4xl font-bold tracking-tight">Create Account ✨</h1>

        <p className="mt-2 text-muted-foreground">
          Join our blogging community.
        </p>
      </div>

      {/* Form */}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Name</FieldLabel>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  {...field}
                  placeholder="John Doe"
                  className="h-12 rounded-xl pl-11"
                />
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Email */}

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Email</FieldLabel>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  {...field}
                  type="email"
                  placeholder="john@example.com"
                  aria-invalid={fieldState.invalid}
                  className="
                    h-12
                    rounded-xl
                    border-white/30
                    bg-white/70
                    backdrop-blur-md
                    focus-visible:ring-fuchsia-500
"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password */}

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <PasswordInput
              field={field}
              fieldState={fieldState}
              label="Password"
              placeholder="Enter password"
            />
          )}
        />

        {/* Confirm Password */}

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <PasswordInput
              field={field}
              fieldState={fieldState}
              label="Password"
              placeholder="Enter password"
            />
          )}
        />

        {/* Checkbox */}

        <Controller
          name="terms"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="terms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />

                <label htmlFor="terms" className="text-sm">
                  I agree to the Terms & Conditions
                </label>
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Submit */}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="
            h-12
            w-full
            rounded-xl
            bg-linear-to-r
            from-violet-600
            via-fuchsia-600
            to-pink-600
            text-white
            font-semibold
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-xl
            hover:shadow-fuchsia-500/30
            active:scale-95
            "
        >
          {form.formState.isSubmitting
            ? "Creating Account..."
            : "Create Account"}
        </Button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          type="button"
          className="h-12 w-full rounded-xl"
        >
          <FcGoogle />
          Continue with Google
        </Button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="font-semibold text-fuchsia-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </>
  );
};

export default SignupForm;
