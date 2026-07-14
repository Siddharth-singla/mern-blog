import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/images/Logo.png";
import { IoHomeOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { GrBlog } from "react-icons/gr";
import { FaRegComment } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { GoDot } from "react-icons/go";
import {
  RouteIndex,
  RouteCategoryDetails,
  RouteBlog,
  RouteCategoryBlogs,
  RouteComments,
  RouteUsers,
} from "@/helpers/RouteName";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import { useSelector } from "react-redux";

const AppSidebar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { data: categoryData } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/category/all-categories`,
    {
      method: "get",
      credentials: "include",
    },
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <img src={logo} width={120} className="cursor-pointer" onClick={() => navigate(RouteIndex)} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to={RouteIndex} className="flex items-center gap-2">
                  <IoHomeOutline />
                  Home
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {user.isLoggedIn && user.user.role === 'admin' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to={RouteCategoryDetails}
                    className="flex items-center gap-2"
                  >
                    <BiCategoryAlt />
                    Categories
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {user.isLoggedIn && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={RouteBlog} className="flex items-center gap-2">
                    <GrBlog />
                    Blogs
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {user.isLoggedIn && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={RouteComments} className="flex items-center gap-2">
                    <FaRegComment />
                    Comments
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {user.isLoggedIn && user.user.role === 'admin' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={RouteUsers} className="flex items-center gap-2">
                    <FaRegUser />
                    Users
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarMenu>
            {categoryData &&
              categoryData.category.length > 0 &&
              categoryData.category.map((category) => (
                <SidebarMenuItem key={category._id}>
                  <SidebarMenuButton asChild>
                    <Link to={RouteCategoryBlogs(category.slug)}>
                      <GoDot />
                      {category.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
