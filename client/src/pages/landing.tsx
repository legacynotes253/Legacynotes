import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Send, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-serif font-bold text-primary">LegacyNotes</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <a href="/api/login">Log in</a>
          </Button>
          <Button asChild>
            <a href="/api/login">Get Started</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 container mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl lg:text-7xl font-serif font-medium text-primary leading-[1.1]"
          >
            Leave messages for when it matters most.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0"
          >
            A secure digital space to write private letters, notes, and instructions 
            that are only delivered if you become inactive. Peace of mind for you, 
            clarity for them.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Button size="lg" className="h-14 px-8 text-lg" asChild>
              <a href="/api/login">Start Your Legacy</a>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
              How it works
            </Button>
          </motion.div>
        </div>

        <div className="flex-1 w-full max-w-lg lg:max-w-xl">
          {/* Abstract visual representation of a locked note */}
          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative bg-white border border-white/20 shadow-2xl rounded-2xl p-8 lg:p-12 rotate-3"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-medium bg-secondary px-3 py-1 rounded-full text-secondary-foreground">
                  Encrypted
                </span>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-full" />
              </div>
              <div className="mt-8 pt-8 border-t flex items-center justify-between text-muted-foreground text-sm">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Release triggers if inactive
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <Feature 
              icon={Shield} 
              title="Secure & Private" 
              desc="Your data is encrypted. We cannot read your notes. Only your designated recipients will ever see them."
            />
            <Feature 
              icon={Clock} 
              title="Inactivity Detection" 
              desc="We periodically ask you to check in. If you don't respond after a grace period, we initiate the release protocol."
            />
            <Feature 
              icon={Send} 
              title="Automated Delivery" 
              desc="When the time comes, your recipients receive a secure link to access the messages you left for them."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 text-center text-muted-foreground text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} LegacyNotes. Built for peace of mind.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="w-16 h-16 bg-white shadow-sm border rounded-2xl flex items-center justify-center mb-2">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
