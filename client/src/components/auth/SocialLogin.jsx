import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

const SocialLogin = () => {
  return (
    <Button
      variant="outline"
      className="
        h-12
        w-full
        rounded-xl
        border-white/30
        bg-white/60
        backdrop-blur
        hover:bg-white"
    >
      <FcGoogle className="mr-3 text-xl" />
      Continue with Google
    </Button>
  );
};

export default SocialLogin;
