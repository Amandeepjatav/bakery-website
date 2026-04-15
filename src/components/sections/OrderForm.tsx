import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShoppingBag, Trash2, CheckCircle2, AlertCircle, Plus, Minus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

const orderSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export function OrderForm() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
  });

  const onSubmit = async (data: OrderFormValues) => {
    if (items.length === 0) return;

    setStatus('loading');
    setErrorMessage("");

    try {
      const { error } = await supabase.from('orders').insert([
        {
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          message: data.message || "",
          items: items,
          total_price: totalPrice,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setStatus('success');
      clearCart();
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      console.error("Order submission error:", err);
      setStatus('error');
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  if (items.length === 0 && status !== 'success') {
    return (
      <section id="order" className="section-padding bg-white">
        <div className="container mx-auto max-w-4xl text-center py-20 bg-secondary/10 rounded-[40px]">
          <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
          <h2 className="text-2xl font-heading font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Add some delicious treats from our menu to get started!</p>
          <Button 
            onClick={() => document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-full px-8"
          >
            Browse Menu
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="section-padding bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold mb-4">Your Order</h2>
          <p className="text-muted-foreground">Review your selection and provide your details to place an order.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Cart Items */}
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                Selected Items
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-destructive"
                onClick={clearCart}
              >
                Clear All
              </Button>
            </div>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex justify-between items-center p-4 bg-secondary/20 rounded-2xl"
                  >
                    <div className="flex-1">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price} each
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 shadow-sm">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-6 w-6 rounded-full"
                          onClick={() => updateQuantity(item.name, -1)}
                        >
                          <Minus size={12} />
                        </Button>
                        <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-6 w-6 rounded-full"
                          onClick={() => updateQuantity(item.name, 1)}
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                      <p className="font-bold text-primary w-16 text-right">${item.price * item.quantity}</p>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.name)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="pt-6 border-t border-dashed flex justify-between items-center">
              <span className="text-xl font-bold">Total Price</span>
              <span className="text-3xl font-heading font-bold text-primary">${totalPrice}</span>
            </div>
          </div>

          {/* Form */}
          <div>
            <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-secondary/10">
              <CardContent className="p-10">
                {status === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-2">Order Placed!</h3>
                    <p className="text-muted-foreground">We've received your order and will contact you shortly to confirm.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1">Full Name</label>
                      <Input
                        placeholder="Enter your name"
                        className="rounded-2xl py-6 px-5 bg-white border-none focus-visible:ring-primary"
                        {...register("customer_name")}
                      />
                      {errors.customer_name && <p className="text-xs text-destructive ml-1">{errors.customer_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1">Phone Number</label>
                      <Input
                        placeholder="Enter your phone number"
                        className="rounded-2xl py-6 px-5 bg-white border-none focus-visible:ring-primary"
                        {...register("customer_phone")}
                      />
                      {errors.customer_phone && <p className="text-xs text-destructive ml-1">{errors.customer_phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1 flex items-center gap-2">
                        <MessageSquare size={14} /> Custom Message / Notes
                      </label>
                      <Textarea
                        placeholder="Any special instructions for your order?"
                        className="rounded-2xl py-4 px-5 bg-white border-none focus-visible:ring-primary min-h-[100px]"
                        {...register("message")}
                      />
                    </div>

                    {status === 'error' && (
                      <div className="p-4 bg-destructive/10 text-destructive rounded-2xl flex items-center gap-3 text-sm">
                        <AlertCircle size={18} />
                        {errorMessage}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full rounded-full py-7 text-lg"
                      disabled={status === 'loading' || items.length === 0}
                    >
                      {status === 'loading' ? "Processing..." : "Confirm Order"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
