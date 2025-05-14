import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

// Create a signup schema useing zod
const SignupSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
});

const SignupPage = () => {
  return <div>SignupPage</div>;
};

export default SignupPage;
