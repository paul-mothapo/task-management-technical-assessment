import { useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterCredentials } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FormInput } from "@/components/forms/FormInput";
import { LoadingButton } from "@/components/common/LoadingButton";
import { REGISTER_FORM, REGISTER_TEXTS } from "@/constants/formConstants";

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      setLoading(true);
      await registerUser(data);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-md">
      <div className="flex flex-col items-center mt-20">
        <div className="w-full bg-white rounded-lg p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-2">{REGISTER_TEXTS.TITLE}</h1>
          <p className="text-gray-600 text-center mb-6">
            {REGISTER_TEXTS.SUBTITLE}
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="mb-4">
              <FormInput
                type="text"
                placeholder={REGISTER_TEXTS.NAME_PLACEHOLDER}
                registration={register("name", REGISTER_FORM.NAME)}
                error={errors.name}
              />
            </div>
            <div className="mb-4">
              <FormInput
                type="email"
                placeholder={REGISTER_TEXTS.EMAIL_PLACEHOLDER}
                registration={register("email", REGISTER_FORM.EMAIL)}
                error={errors.email}
              />
            </div>
            <div className="mb-6">
              <FormInput
                type="password"
                placeholder={REGISTER_TEXTS.PASSWORD_PLACEHOLDER}
                registration={register("password", REGISTER_FORM.PASSWORD)}
                error={errors.password}
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>
            <LoadingButton type="submit" loading={loading}>
              {REGISTER_TEXTS.SIGN_UP}
            </LoadingButton>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-neutral-600 hover:text-neutral-800 text-sm"
              >
                {REGISTER_TEXTS.LOGIN_PROMPT}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
