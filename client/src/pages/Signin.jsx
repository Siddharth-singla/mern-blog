import BackgroundBlobs from "@/components/auth/BackgroundBlobs";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

const Signin = () => {
  return (
    <div
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[radial-gradient(circle_at_top_left,#e9d5ff,transparent_30%),radial-gradient(circle_at_bottom_right,#c4b5fd,transparent_35%),linear-gradient(to_bottom_right,#faf5ff,#fdf2f8,#eef2ff)]
        px-4
      "
    >
      <BackgroundBlobs />

      <AuthCard>
        <LoginForm />
      </AuthCard>
    </div>
  );
};

export default Signin;
