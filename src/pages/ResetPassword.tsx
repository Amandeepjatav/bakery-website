import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

const resetSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
            <CardContent className="p-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} />
                </div>
                <h1 className="text-3xl font-heading font-bold">New Password</h1>
                <p className="text-muted-foreground mt-2">Enter your new password below</p>
              </div>

              {success ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-2">Password Updated!</h3>
                  <p className="text-muted-foreground">Redirecting you to login page...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1 flex items-center gap-2">
                      <Lock size={14} /> New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="rounded-2xl py-6 px-5 bg-secondary/5 border-none focus-visible:ring-primary"
                      {...register('password')}
                    />
                    {errors.password && <p className="text-xs text-destructive ml-1">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1 flex items-center gap-2">
                      <Lock size={14} /> Confirm Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="rounded-2xl py-6 px-5 bg-secondary/5 border-none focus-visible:ring-primary"
                      {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && <p className="text-xs text-destructive ml-1">{errors.confirmPassword.message}</p>}
                  </div>

                  {error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-2xl flex items-center gap-3 text-sm">
                      <AlertCircle size={18} />
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-full py-7 text-lg"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
