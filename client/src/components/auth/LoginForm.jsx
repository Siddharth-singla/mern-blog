import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "@/assets/images/Logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import PasswordInput from "./PasswordInput";
import { showToast } from "@/helpers/showtoast";
import { RouteIndex } from "@/helpers/RouteName";
import { getEnv } from "@/helpers/getEnv";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/helpers/firebase";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/login`,
        {
          method: "post",
          headers: { "Content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
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
  }

  return (
    <>
      <div className="mb-8 text-center">
        <img src={logo} alt="Blog Logo" className="mx-auto mb-5 h-20 w-auto" />

        <h1 className="text-4xl font-bold tracking-tight">Welcome Back 👋</h1>

        <p className="mt-2 text-muted-foreground">
          Sign in to continue your blogging journey.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
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

        <div className="flex items-center justify-between">
          <Controller
            name="remember"
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
                    Remember
                  </label>
                </div>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <button
            type="button"
            className="text-fuchsia-600 hover:underline  whitespace-nowrap"
          >
            Forgot Password?
          </button>
        </div>

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
          {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
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
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="font-semibold text-fuchsia-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </>
  );
}
