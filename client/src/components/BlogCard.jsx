import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FaRegCalendarAlt } from "react-icons/fa";
import usericon from "@/assets/images/user.png";
import { Link } from "react-router-dom";
import { RouteBlogDetails } from "@/helpers/RouteName";

const BlogCard = ({ blog }) => {
  const user = useSelector((state) => state.user);

  const formattedDate = blog?.createdAt
    ? new Date(blog.createdAt)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-")
    : "";

  return (
<Link to ={RouteBlogDetails(blog?.category?.slug, blog?.slug)}>
    <Card className="pt-5 gap-3">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Avatar className="w-9 h-9">
              <AvatarImage
                src={blog?.author?.avatar || usericon}
                className="object-cover"
              />
            </Avatar>
            <span className="font-medium">{blog?.author?.name}</span>
          </div>
          {blog?.author?.role === "admin" && (
            <Badge variant="outline" className="bg-violet-500 text-white">
              Admin
            </Badge>
          )}
        </div>

        <div className="rounded-lg overflow-hidden h-40 w-full">
          <img
            src={blog?.featuredImage}
            alt={blog?.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-1">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <FaRegCalendarAlt />
            <span>{formattedDate}</span>
          </p>
          <h2 className="text-2xl font-bold line-clamp-2">{blog?.title}</h2>
        </div>
      </CardContent>
    </Card>
</Link>
    
  );
};

export default BlogCard;
