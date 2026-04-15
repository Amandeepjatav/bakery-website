import * as React from "react";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Clock, CheckCircle, Package, ArrowLeft } from "lucide-react";
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

export default function Admin() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-secondary/10 p-6 md:p-12">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
              <ArrowLeft size={16} />
              Back to Website
            </Link>
            <h1 className="text-4xl font-heading font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your bakery orders in real-time.</p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-full gap-2 bg-white" 
            onClick={fetchOrders}
            disabled={loading}
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Orders
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] shadow-sm">
            <Package size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-xl font-bold">No orders yet.</p>
            <p className="text-muted-foreground">When customers place orders, they will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-4 items-center">
                      {/* Customer Info */}
                      <div className="p-6 border-b md:border-b-0 md:border-r">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Customer</p>
                        <p className="font-bold text-lg">{order.customer_name}</p>
                        <p className="text-sm text-primary">{order.customer_phone}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">
                          {format(new Date(order.created_at), 'MMM d, h:mm a')}
                        </p>
                      </div>

                      {/* Items & Message */}
                      <div className="p-6 md:col-span-2 border-b md:border-b-0 md:border-r space-y-4">
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Items</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((item: any, i: number) => (
                              <Badge key={i} variant="secondary" className="bg-secondary/50 text-xs py-1">
                                {item.quantity}x {item.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {order.message && (
                          <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Notes</p>
                            <p className="text-sm italic text-muted-foreground leading-tight">"{order.message}"</p>
                          </div>
                        )}
                      </div>

                      {/* Status & Actions */}
                      <div className="p-6 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                            <p className="text-2xl font-heading font-bold text-primary">${order.total_price}</p>
                          </div>
                          <Badge 
                            className={
                              order.status === 'completed' 
                                ? "bg-green-100 text-green-700 border-none" 
                                : "bg-yellow-100 text-yellow-700 border-none"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          {order.status === 'pending' ? (
                            <Button 
                              size="sm" 
                              className="w-full rounded-full gap-2 bg-green-600 hover:bg-green-700"
                              onClick={() => updateStatus(order.id, 'completed')}
                            >
                              <CheckCircle size={14} />
                              Complete
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="w-full rounded-full gap-2"
                              onClick={() => updateStatus(order.id, 'pending')}
                            >
                              <Clock size={14} />
                              Re-open
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
