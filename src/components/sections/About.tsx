import { motion } from "motion/react";

export function About() {
  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="rounded-3xl overflow-hidden aspect-square shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop" 
                    alt="Baking Process" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600&auto=format&fit=crop" 
                    alt="Ingredients" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1519340333755-56e9c1d04579?q=80&w=600&auto=format&fit=crop" 
                    alt="Finished Cake" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden aspect-square shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=600&auto=format&fit=crop" 
                    alt="Cupcakes" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8 leading-tight">
              Baked with Passion, <br />
              Shared with <span className="italic text-primary">Joy.</span>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                What started as a small kitchen experiment in 2018 has blossomed into a beloved local home bakery. 
                Our founder, Sarah, believed that every celebration deserves a centerpiece that tastes as good as it looks.
              </p>
              <p>
                We don't just bake cakes; we create memories. Every order is handled with meticulous attention to detail, 
                using only the finest organic flour, farm-fresh eggs, and premium Belgian chocolate.
              </p>
              <p>
                Whether it's a first birthday, a wedding, or just a Tuesday treat, we're here to make your moments 
                a little sweeter.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <p className="text-3xl font-heading font-bold text-primary">5+</p>
                <p className="text-sm text-muted-foreground">Years of Experience</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-bold text-primary">1k+</p>
                <p className="text-sm text-muted-foreground">Cakes Delivered</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Happy Reviews</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
