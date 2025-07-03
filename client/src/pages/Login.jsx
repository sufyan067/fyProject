// McgPr7oX7v1mMcbN
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ThreatLensLogo from "@/assets/Logo.jpg";

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signupError, setSignupError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess }] = useRegisterUserMutation();
  const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation();
  const navigate = useNavigate();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const validateEmail = (email) => {
    return /^[a-zA-Z][\w\-\.]*@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    if (type === "signup" && !validateEmail(signupInput.email)) {
      setSignupError("Please enter a valid email address.");
      return;
    } else {
      setSignupError("");
    }
    const result = await action(inputData);
    // Auto-login after signup
    if (type === "signup" && result?.data?.success) {
      await loginUser({ email: signupInput.email, password: signupInput.password });
    }
  };

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup successful.")
    }
    if (registerError) {
      const errorMessage = registerError?.data?.message || "Signup Failed";
      toast.error(errorMessage);
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successful.");
      navigate("/");
    }
    if (loginError) {
      const errorMessage = loginError?.data?.message || "Login Failed";
      toast.error(errorMessage);
    }
  }, [
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
    navigate
  ]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#1a1a40] via-[#2d1e60] to-[#ff0080] font-sans">
      {/* Left: Branding & Illustration */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-[#1a1a40] via-[#2d1e60] to-[#ff0080] relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />
        <img src={ThreatLensLogo} alt="ThreatLens Logo" className="z-10 w-32 h-32 rounded-full shadow-lg mb-6 border-4 border-white/20" />
        <h1 className="z-10 text-4xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">ThreatLens</h1>
        <p className="z-10 text-lg text-white/80 font-medium mb-8 text-center max-w-xs">Empowering Cybersecurity Awareness. Learn, Defend, and Stay Secure with Professional Training.</p>
        {/* Cybersecurity SVG Illustration */}
        <svg className="z-10 w-64 h-64" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="128" cy="128" r="120" fill="url(#cyber-gradient)" fillOpacity="0.15" />
          <rect x="56" y="96" width="144" height="80" rx="16" fill="#fff" fillOpacity="0.08" stroke="#fff" strokeWidth="2" />
          <rect x="88" y="128" width="80" height="32" rx="8" fill="#fff" fillOpacity="0.15" />
          <path d="M128 96v-24a16 16 0 0132 0v24" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="128" cy="144" r="8" fill="#ff0080" />
          <defs>
            <radialGradient id="cyber-gradient" cx="0" cy="0" r="1" gradientTransform="translate(128 128) rotate(90) scale(120)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ff0080" />
              <stop offset="1" stopColor="#1a1a40" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      {/* Right: Auth Form */}
      <div className="flex flex-1 min-h-screen justify-center items-center bg-white/80 dark:bg-[#181828]/80 backdrop-blur-xl shadow-2xl">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white/90 dark:bg-[#23234a]/90 shadow-xl border border-white/20">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signup">Signup</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            {/* Signup Tab */}
            <TabsContent value="signup">
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-[#1a1a40] dark:text-white mb-2">Create Account</h2>
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={signupInput.name}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Your Name"
                    required
                    className="focus:ring-2 focus:ring-[#ff0080]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={signupInput.email}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="you@email.com"
                    required
                    className="focus:ring-2 focus:ring-[#ff0080]"
                  />
                  {signupError && (
                    <p className="text-red-500 text-sm mt-1">{signupError}</p>
                  )}
                </div>
                <div className="space-y-1 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type={showSignupPassword ? "text" : "password"}
                    name="password"
                    value={signupInput.password}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Password"
                    required
                    className="focus:ring-2 focus:ring-[#ff0080] pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-8 text-gray-400 hover:text-[#ff0080]"
                    onClick={() => setShowSignupPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showSignupPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <Button
                  disabled={registerIsLoading}
                  onClick={() => handleRegistration("signup")}
                  className="w-full bg-gradient-to-r from-[#1a1a40] via-[#2d1e60] to-[#ff0080] text-white font-semibold py-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
                >
                  {registerIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </>
                  ) : (
                    "Signup"
                  )}
                </Button>
              </div>
            </TabsContent>
            {/* Login Tab */}
            <TabsContent value="login">
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-[#1a1a40] dark:text-white mb-2">Welcome Back</h2>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={loginInput.email}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="you@email.com"
                    required
                    className="focus:ring-2 focus:ring-[#ff0080]"
                  />
                </div>
                <div className="space-y-1 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    value={loginInput.password}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="Password"
                    required
                    className="focus:ring-2 focus:ring-[#ff0080] pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-8 text-gray-400 hover:text-[#ff0080]"
                    onClick={() => setShowLoginPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <Button
                  disabled={loginIsLoading}
                  onClick={() => handleRegistration("login")}
                  className="w-full bg-gradient-to-r from-[#1a1a40] via-[#2d1e60] to-[#ff0080] text-white font-semibold py-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
                >
                  {loginIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;