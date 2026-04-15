import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface Order {
  id: number;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  items: any[];
  total_price: number;
  status: string;
  message?: string;
}

export default function History() {
  const [phone, setPhone] = React.useState("");
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  const fetchOrders = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phone) return;

    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_phone', phone)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10 p-6 md:p-12">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4">Track Your Orders</h1>
          <p className="text-muted-foreground">Enter your phone number to see your order history.</p>
        </div>

        <form onSubmit={fetchOrders} className="max-w-md mx-auto mb-12 flex gap-2">
          <Input
            placeholder="Enter phone number (e.g. 1234567890)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-full py-6 px-6 bg-white border-none shadow-sm focus-visible:ring-primary"
          />
          <Button type="submit" className="rounded-full px-8 py-6" disabled={loading}>
            {loading ? <Clock className="animate-spin" /> : <Search size={20} />}
          </Button>
        </form>

        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : searched && orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[40px] shadow-sm">
              <Package size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-xl font-bold">No orders found.</p>
              <p className="text-muted-foreground">Make sure you entered the correct phone number used during checkout.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="border-none shadow-sm overflow-hidden bg-white">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Badge className={
                              order.status === 'completed' 
                                ? "bg-green-100 text-green-700 border-none" 
                                : "bg-yellow-100 text-yellow-700 border-none"
                            }>
                              {order.status === 'completed' ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                              {order.status.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Order #{order.id} • {format(new Date(order.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="font-bold text-lg">Items Ordered:</p>
                            <div className="flex flex-wrap gap-2">
                              {order.items.map((item: any, i: number) => (
                                <Badge key={i} variant="secondary" className="bg-secondary/50">
                                  {item.quantity}x {item.name}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {order.message && (
                            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Your Notes</p>
                              <p className="text-sm italic">"{order.message}"</p>
                            </div>
                          )}
                        </div>

                        <div className="text-left md:text-right flex flex-col justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                            <p className="text-3xl font-heading font-bold text-primary">${order.total_price}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-4">
                            Ordered at {format(new Date(order.created_at), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
