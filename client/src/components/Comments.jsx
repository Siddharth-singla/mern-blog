import React from "react";
import * as z from "zod";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { showToast } from "@/helpers/showtoast";
import { getEnv } from "@/helpers/getEnv";
import { RouteSignIn } from "@/helpers/RouteName";

const Comments = ({ props }) => {
  const user = useSelector((state) => state.user);
  const formSchema = z.object({
    comment: z.string().min(1, "Comment should contain at least 1 character"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(values) {
    try {
      const newValues = { ...values, blogid: props.blogid, user: user.user._id }
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/comment/add`,
        {
          method: "post",
          headers: { "Content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify(newValues),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }
      form.reset();
      if (props?.setRefreshKey) props.setRefreshKey((k) => (k || 0) + 1);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    }
  }

  return (
    <div>
      <h4 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <FaComments className="text-violet-500" /> Comments
      </h4>

      {user && user.isLoggedIn ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="comment"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Comment</FieldLabel>
                <Textarea
                  {...field}
                  placeholder="Type your comment..."
                  className="rounded-xl min-h-32"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

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
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      ) : (
        <Button asChild>
          <Link to={RouteSignIn}>Sign In</Link>
        </Button>
      )}
    </div>
  );
};

export default Comments;
