import React, { useEffect } from "react";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { showToast } from "@/helpers/showtoast";
import { getEnv } from "@/helpers/getEnv";

const AddCategory = () => {
  const formSchema = z.object({
    name: z.string().min(3, "Name should contain at least 3 characters"),
    slug: z.string().min(3, "Slug should contain at least 3 characters"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const categoryName = form.watch("name");

  useEffect(() => {
    if (!categoryName) return;
    const slug = slugify(categoryName, { lower: true });
    form.setValue("slug", slug);
  }, [categoryName, form]);

  async function onSubmit(values) {
      try {
        const response = await fetch(
          `${getEnv("VITE_API_BASE_URL")}/category/add`,
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
        form.reset();
        showToast("success", data.message);
      } catch (error) {
        showToast("error", error.message);
      }
  }

  return (
    <Card className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Add Category</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Name</FieldLabel>

              <div className="relative">
                <Input
                  {...field}
                  placeholder="John Doe"
                  className="h-12 rounded-xl pl-3"
                />
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Slug */}

        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Slug</FieldLabel>

              <div className="relative">
                <Input
                  {...field}
                  placeholder="Slug"
                  className="h-12 rounded-xl pl-3"
                />
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
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Card>
  );
};

export default AddCategory;
