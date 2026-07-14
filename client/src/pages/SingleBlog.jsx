import React from "react";
import { useParams } from "react-router-dom";
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from "@/helpers/getEnv";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { decode } from "entities";
import Loading from "@/components/Loading";
import Comments from "../components/Comments";
import CommentList from "@/components/CommentList";
import { useState } from "react";
import CommentCount from "@/components/CommentCount";
import LikeCount from "@/components/LikeCount";
import RelatedBlog from "@/components/RelatedBlog";

const SingleBlogDetails = () => {
  const { blog, category } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, loading, error } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-blog/${blog}`,
    {
      method: "get",
      credentials: "include",
    },
    [blog, category],
  );

  if (loading) return <Loading />;

  return (
    <div className="flex justify-between gap-5">
      <div className="border rounded w-[70%] p-5">
        {data && data.blog && (
          <>
            <h1 className="text-3xl font-bold mb-4">{data.blog.title}</h1>

            <div className="flex justify-between items-center">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={data.blog.author.avatar} />
                </Avatar>
                <div>
                  <p className="font-medium">{data.blog.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Date:{" "}
                    {new Date(data.blog.createdAt)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      .replace(/\//g, "-")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LikeCount props={{ blogid: data.blog._id }} />
                <CommentCount props={{ blogid: data.blog._id, refreshKey: refreshKey }} />
              </div>
            </div>

            <div className="my-5">
              <img src={data.blog.featuredImage} className="rounded" />
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: decode(decode(data.blog.blogContent)),
              }}
            />
            <div className="border-t-2 mt-5 pt-5">
              <Comments
                props={{ blogid: data.blog._id, setRefreshKey: setRefreshKey }}
              />
            </div>
            <div className="border-t mt-5 pt-5">
              <CommentList
                props={{ blogid: data.blog._id, refreshKey: refreshKey }}
              />
            </div>
          </>
        )}
      </div>
      <div className="border rounded w-[30%] h-fit sticky top-5">
        {data && data.blog && (
          <RelatedBlog props={{ category: data.blog.category, blog: blog }} />
        )}
      </div>
    </div>
  );
};

export default SingleBlogDetails;