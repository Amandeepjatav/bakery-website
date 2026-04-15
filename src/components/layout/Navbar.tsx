import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Cake } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Menu", href: "#menu" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" },
  { name: "Track Order", href: "/history", isRoute: true },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass py-3 shadow-sm" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform">
            <Cake size={24} />
          </div>
          <span className="font-heading text-xl font-bold tracking-tighter">
            Sweet Delights
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            item.isRoute ? (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium hover:text-primary transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ) : (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-sm font-medium hover:text-primary transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
            )
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="rounded-full gap-2">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={handleSignOut}>
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-full gap-2">
                <LogIn size={16} />
                Admin Login
              </Button>
            </Link>
          )}

          <Button 
            variant="default" 
            size="sm" 
            className="rounded-full px-6"
            onClick={() => document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Order Now
          </Button>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-8 mt-12">
                {navItems.map((item) => (
                  item.isRoute ? (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-2xl font-heading font-medium hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => scrollToSection(e, item.href)}
                      className="text-2xl font-heading font-medium hover:text-primary transition-colors"
                    >
                      {item.name}
                    </a>
                  )
                ))}

                {user ? (
                  <>
                    <Link
                      to="/admin"
                      className="text-2xl font-heading font-medium hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard size={20} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-2xl font-heading font-medium hover:text-primary transition-colors flex items-center gap-2 text-left"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="text-2xl font-heading font-medium hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <LogIn size={20} />
                    Admin Login
                  </Link>
                )}

                <Button 
                  className="w-full rounded-full py-6 text-lg"
                  onClick={() => {
                    document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Order Now
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
