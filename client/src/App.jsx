import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import { RouteAddCategory, RouteBlog, RouteBlogAdd, RouteBlogDetails, RouteBlogEdit, RouteCategoryBlogs, RouteCategoryDetails, RouteComments, RouteEditCategory, RouteIndex, RouteProfile, RouteSearch, RouteSignIn, RouteSignUp, RouteUsers } from "./helpers/RouteName";
import Index from "./pages/Index";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import CategoryDetails from "./pages/Category/CategoryDetails";
import AddCategory from "./pages/Category/AddCategory";
import EditCategory from "./pages/Category/EditCategory";
import BlogDetails from "./pages/Blog/BlogDetails";
import AddBlog from "./pages/Blog/AddBlog";
import EditBlog from "./pages/Blog/EditBlog";
import SingleBlog from "./pages/SingleBlog";
import CategoryBlogs from "./pages/CategoryBlogs";
import SearchResults from "./pages/SearchResults";
import AllComments from "./pages/AllComments";
import AllUsers from "./pages/AllUsers";
import AuthGuard from "./components/AuthGuard";
import AdminGuard from "./components/AdminGuard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RouteIndex} element={<Layout />}>
          {/* Public routes */}
          <Route index element={<Index />}></Route>
          <Route path={RouteBlogDetails()} element={<SingleBlog />}></Route>
          <Route path={RouteCategoryBlogs()} element={<CategoryBlogs />}></Route>
          <Route path={RouteSearch} element={<SearchResults />}></Route>

          {/* Auth-protected routes (must be logged in) */}
          <Route element={<AuthGuard />}>
            <Route path={RouteProfile} element={<Profile />}></Route>
            <Route path={RouteBlogAdd} element={<AddBlog />}></Route>
            <Route path={RouteBlogEdit()} element={<EditBlog />}></Route>
            <Route path={RouteBlog} element={<BlogDetails />}></Route>
            <Route path={RouteComments} element={<AllComments />}></Route>
          </Route>

          {/* Admin-only routes */}
          <Route element={<AdminGuard />}>
            <Route path={RouteCategoryDetails} element={<CategoryDetails />}></Route>
            <Route path={RouteAddCategory} element={<AddCategory />}></Route>
            <Route path={RouteEditCategory()} element={<EditCategory />}></Route>
            <Route path={RouteUsers} element={<AllUsers />}></Route>
          </Route>
        </Route>
        <Route path={RouteSignIn} element={<Signin />}></Route>
        <Route path={RouteSignUp} element={<Signup />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
