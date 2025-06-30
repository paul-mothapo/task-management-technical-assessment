import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoginCredentials } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '@/components/forms/FormInput';
import { LoadingButton } from '@/components/common/LoadingButton';
import { LOGIN_FORM, LOGIN_TEXTS } from '@/constants/formConstants';

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setLoading(true);
      await login(data);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-md">
      <div className="flex flex-col items-center mt-20">
        <div className="w-full bg-white rounded-lg p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-2">{LOGIN_TEXTS.TITLE}</h1>
          <p className="text-gray-600 text-center mb-6">{LOGIN_TEXTS.SUBTITLE}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="mb-4">
              <FormInput
                type="email"
                placeholder={LOGIN_TEXTS.EMAIL_PLACEHOLDER}
                registration={register('email', LOGIN_FORM.EMAIL)}
                error={errors.email}
              />
            </div>
            <div className="mb-6">
              <FormInput
                type="password"
                placeholder={LOGIN_TEXTS.PASSWORD_PLACEHOLDER}
                registration={register('password', LOGIN_FORM.PASSWORD)}
                error={errors.password}
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>
            <LoadingButton type="submit" loading={loading}>
              {LOGIN_TEXTS.SIGN_IN}
            </LoadingButton>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-neutral-600 hover:text-neutral-800 text-sm"
              >
                {LOGIN_TEXTS.REGISTER_PROMPT}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
