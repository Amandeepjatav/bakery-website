import * as React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, LogIn, Mail, Lock, ArrowLeft } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [forgotPassword, setForgotPassword] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues('email');
    if (!email || !z.string().email().safeParse(email).success) {
      setError('Please enter a valid email address first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
            <CardContent className="p-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn size={32} />
                </div>
                <h1 className="text-3xl font-heading font-bold">Admin Login</h1>
                <p className="text-muted-foreground mt-2">
                  {forgotPassword ? 'Reset your password' : 'Enter your credentials to access the dashboard'}
                </p>
              </div>

              {resetSent ? (
                <div className="text-center py-4">
                  <div className="bg-green-100 text-green-700 p-4 rounded-2xl mb-6">
                    Password reset link has been sent to your email.
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full py-6"
                    onClick={() => setResetSent(false)}
                  >
                    Back to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1 flex items-center gap-2">
                      <Mail size={14} /> Email Address
                    </label>
                    <Input
                      placeholder="admin@bakery.com"
                      className="rounded-2xl py-6 px-5 bg-secondary/5 border-none focus-visible:ring-primary"
                      {...register('email')}
                    />
                    {errors.email && <p className="text-xs text-destructive ml-1">{errors.email.message}</p>}
                  </div>

                  {!forgotPassword && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-bold flex items-center gap-2">
                          <Lock size={14} /> Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setForgotPassword(true)}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="rounded-2xl py-6 px-5 bg-secondary/5 border-none focus-visible:ring-primary"
                        {...register('password')}
                      />
                      {errors.password && <p className="text-xs text-destructive ml-1">{errors.password.message}</p>}
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-2xl flex items-center gap-3 text-sm">
                      <AlertCircle size={18} />
                      {error}
                    </div>
                  )}

                  {forgotPassword ? (
                    <div className="space-y-4">
                      <Button
                        type="button"
                        className="w-full rounded-full py-7 text-lg"
                        disabled={loading}
                        onClick={handleForgotPassword}
                      >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full rounded-full py-7"
                        onClick={() => setForgotPassword(false)}
                      >
                        Back to Login
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full rounded-full py-7 text-lg"
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
