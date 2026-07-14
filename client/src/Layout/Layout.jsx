import AppSidebar from "@/components/AppSidebar";
import Footer from "@/components/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import Topbar from "@/components/Topbar";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <SidebarProvider>
      <Topbar />
      <AppSidebar />
      <main className="w-full pt-28 px-4 md:px-6 lg:px-8">
        <div className="w-full min-h-[calc(100vh-80px)]">
          <Outlet />
        </div>
        <Footer />
      </main>
    </SidebarProvider>
  );
};

export default Layout;