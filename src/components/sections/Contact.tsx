import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form submitted:", data);
    alert("Thank you! We'll get back to you soon.");
    reset();
  };

  return (
    <section id="contact" className="section-padding bg-secondary/20">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Get in Touch</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8">
              Let's Make Your <br />
              <span className="italic text-primary">Celebration</span> Sweeter.
            </h2>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              Have a specific design in mind? Or want to discuss a large order for a party? 
              Fill out the form or reach out to us directly via WhatsApp.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Call Us</h4>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Email</h4>
                  <p className="text-muted-foreground">hello@sweetdelights.com</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Location</h4>
                  <p className="text-muted-foreground">123 Bakery Lane, Sweet City, SC 12345</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Button 
                variant="default" 
                size="lg" 
                className="rounded-full px-8 py-7 text-lg bg-[#25D366] hover:bg-[#128C7E] text-white border-none group"
                onClick={() => window.open("https://wa.me/15551234567", "_blank")}
              >
                <MessageCircle className="mr-2 fill-current" />
                Chat on WhatsApp
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
              <CardContent className="p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Your Name</label>
                    <Input 
                      placeholder="John Doe" 
                      className="rounded-2xl py-6 px-5 bg-secondary/30 border-none focus-visible:ring-primary"
                      {...register("name")}
                    />
                    {errors.name && <p className="text-xs text-destructive ml-1">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Phone Number</label>
                    <Input 
                      placeholder="+1 (555) 000-0000" 
                      className="rounded-2xl py-6 px-5 bg-secondary/30 border-none focus-visible:ring-primary"
                      {...register("phone")}
                    />
                    {errors.phone && <p className="text-xs text-destructive ml-1">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Your Message</label>
                    <Textarea 
                      placeholder="Tell us about your requirements..." 
                      className="rounded-2xl p-5 bg-secondary/30 border-none focus-visible:ring-primary min-h-[150px]"
                      {...register("message")}
                    />
                    {errors.message && <p className="text-xs text-destructive ml-1">{errors.message.message}</p>}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full rounded-full py-7 text-lg group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
