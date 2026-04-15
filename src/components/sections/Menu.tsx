import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

const menuCategories = [
  {
    title: "Signature Cakes",
    description: "Our most loved creations for every occasion.",
    items: [
      { name: "Classic Vanilla Bean", price: "$45", tag: "Bestseller" },
      { name: "Double Chocolate Truffle", price: "$50", tag: "Rich" },
      { name: "Red Velvet with Cream Cheese", price: "$55", tag: "Classic" },
      { name: "Lemon Raspberry Zest", price: "$50", tag: "Fresh" },
    ]
  },
  {
    title: "Gourmet Cupcakes",
    description: "Perfect bite-sized treats for parties.",
    items: [
      { name: "Box of 6 Assorted", price: "$24", tag: "Popular" },
      { name: "Box of 12 Assorted", price: "$45", tag: "Value" },
      { name: "Custom Theme (Dozen)", price: "$55", tag: "Custom" },
      { name: "Mini Cupcakes (24)", price: "$40", tag: "Party" },
    ]
  },
  {
    title: "Specialty Items",
    description: "Unique treats for your sweet tooth.",
    items: [
      { name: "Macaron Gift Box (12)", price: "$30", tag: "Elegant" },
      { name: "Brownie Platter", price: "$35", tag: "Fudgy" },
    ]
  }
];

export function Menu() {
  const { addItem } = useCart();

  return (
    <section id="menu" className="section-padding bg-secondary/20">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
          >
            Our Menu
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-heading font-bold mb-6"
          >
            A Taste of <span className="italic text-primary">Perfection.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Explore our range of handcrafted delights. Click the plus icon to add items to your order.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-heading font-bold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-8">{category.description}</p>
                  
                  <div className="space-y-6">
                    {category.items.map((item) => (
                      <div key={item.name} className="flex justify-between items-start group">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{item.name}</h4>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary-foreground border-none">
                              {item.tag}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-primary">{item.price}</p>
                        </div>
                        <Button 
                          variant="default" 
                          size="icon-sm" 
                          className="rounded-full shadow-sm hover:scale-110 transition-transform"
                          onClick={() => addItem(item.name, item.price)}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground italic">
            * Dietary requirements? We offer Gluten-Free and Vegan options upon request.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

