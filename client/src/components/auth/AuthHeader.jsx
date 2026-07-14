import logo from "@/assets/images/Logo.png";

const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-8 text-center">
      <img src={logo} alt="Blog Logo" className="mx-auto mb-5 h-20" />

      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>

      <p className="mt-2 text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;
