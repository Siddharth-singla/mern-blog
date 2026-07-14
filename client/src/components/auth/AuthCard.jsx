import { motion } from "motion/react";

const AuthCard = ({ children }) => {
  return (
    <div
      className="
    relative
    w-full
    max-w-md
    rounded-[32px]
    border
    border-white/30
    bg-white/60
    p-8
    shadow-[0_20px_80px_rgba(124,58,237,0.15)]
    backdrop-blur-2xl
  "
    >
      {children}
    </div>
  );
};

<motion.div
  initial={{ opacity: 0, y: 30, scale: 0.96 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.5 }}
>
  <AuthCard />
</motion.div>;

export default AuthCard;
