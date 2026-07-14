import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { showToast } from "@/helpers/showtoast";
import { getEnv } from "@/helpers/getEnv";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RouteBlog } from "@/helpers/RouteName";

const EditBlog = () => {

  const navigate = useNavigate();
  const { blogid } = useParams();
  const user = useSelector((state) => state.user);
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);

  const {
    data: categoryData,
  } = useFetch(`${getEnv("VITE_API_BASE_URL")}/category/all-categories`, {
    method: "get",
    credentials: "include",
  });

  const { data: blogData } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/edit/${blogid}`, {
    method: 'get',
    credentials: 'include'
  }, [blogid])

  const formSchema = z.object({
    category: z
      .string()
      .min(3, "Category should contain at least 3 characters"),
    title: z.string().min(3, "Title should contain at least 3 characters"),
    slug: z.string().min(3, "Slug should contain at least 3 characters"),
    blogContent: z
      .string()
      .min(3, "Blog content should contain at least 3 characters"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),

    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });

  const blogTitle = form.watch("title");

  useEffect(() => {
    if (!blogTitle) return;
    const slug = slugify(blogTitle, { lower: true });
    form.setValue("slug", slug);
  }, [blogTitle, form]);

  // Populate the form once the existing blog data arrives
  useEffect(() => {
    if (blogData && blogData.blog) {
      form.setValue("category", blogData.blog.category?._id || blogData.blog.category);
      form.setValue("title", blogData.blog.title);
      form.setValue("slug", blogData.blog.slug);
      form.setValue("blogContent", blogData.blog.blogContent);
      setFilePreview(blogData.blog.featuredImage);
    }
  }, [blogData, form]);

  async function onSubmit(values) {
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("data", JSON.stringify(values));

      const response = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/update/${blogid}`, {
        method: "put",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }
      navigate(RouteBlog);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    }
  }

  const handleFileSelection = (files) => {
    if (!files?.length) return;

    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    setFilePreview(URL.createObjectURL(files[0]));
    setFile(files[0]);
  };

  return (
    <Card className="mx-auto p-8">
      <h1 className="mb-6 text-2xl font-semibold">Edit Blog</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Category */}

        <Controller
          name="category"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Category</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categoryData &&
                    categoryData.category.length > 0 &&
                    categoryData.category.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="relative"></div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Title */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Title</FieldLabel>

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
        <span className="mb-2 block">Featured Image</span>
        <Dropzone onDrop={handleFileSelection}>
          {({ getRootProps, getInputProps }) => (
            <section className="mb-6 flex flex-col">
              <div
                {...getRootProps()}
                className="relative flex cursor-pointer flex-col"
              >
                <input {...getInputProps()} />
                <div className="flex justify-center items-center w-36 h-28 border-2 border-dashed rounded overflow-hidden">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>
          )}
        </Dropzone>

        <Controller
          name="blogContent"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Blog Content</FieldLabel>
              <div className="rounded-xl border border-input bg-white p-2">
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value || ""}
                  config={{
                    toolbar: [
                      "heading",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "blockQuote",
                      "undo",
                      "redo",
                    ],
                    placeholder: "Write your blog content here...",
                  }}
                  onChange={(_, editor) => field.onChange(editor.getData())}
                  onBlur={() => field.onBlur()}
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

export default EditBlog;