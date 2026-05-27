import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Users, Globe, Rocket, Shield, Brain, Cpu, Database, ChevronRight } from "lucide-react";

export default function GuildsPage() {
  const guilds = [
    { name: "Web Guild", icon: Globe, color: "text-blue-400", bg: "bg-blue-400/10", members: "4.2K", projects: 124, desc: "Building the next generation of performant, accessible web applications and frameworks." },
    { name: "AI Guild", icon: Brain, color: "text-purple-400", bg: "bg-purple-400/10", members: "3.1K", projects: 86, desc: "Exploring machine learning, neural networks, and generative AI systems." },
    { name: "Cloud Guild", icon: Rocket, color: "text-cyan-400", bg: "bg-cyan-400/10", members: "2.8K", projects: 92, desc: "Focusing on distributed systems, kubernetes, and cloud-native architecture." },
    { name: "Security", icon: Shield, color: "text-red-400", bg: "bg-red-400/10", members: "1.9K", projects: 45, desc: "Advancing cyber security, cryptography, and secure coding practices." },
    { name: "Systems", icon: Cpu, color: "text-emerald-400", bg: "bg-emerald-400/10", members: "2.2K", projects: 68, desc: "Low-level programming, operating systems, and performance optimization." },
    { name: "Data Science", icon: Database, color: "text-orange-400", bg: "bg-orange-400/10", members: "1.5K", projects: 32, desc: "Large scale data processing, visualization, and statistical modeling." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
            <Badge variant="purple" className="py-1 px-4">Guild Ecosystem</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              Join Your <span className="gradient-text">Domain Guild</span>
            </h1>
            <p className="text-xl text-[var(--muted)] leading-relaxed">
              Guilds are specialized micro-communities where experts and enthusiasts 
              collaborate on niche technologies and industry-grade projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guilds.map((guild, i) => (
              <Card key={i} className="group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                   <guild.icon size={120} />
                </div>
                
                <CardBody className="p-8 space-y-6 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${guild.bg} ${guild.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                    <guild.icon size={28} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-[var(--accent)] transition-colors">
                      {guild.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                      <span className="flex items-center gap-1.5">
                        <Users size={14} />
                        {guild.members}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Zap size={14} />
                        {guild.projects} Projects
                      </span>
                    </div>
                  </div>

                  <p className="text-[var(--muted)] leading-relaxed">
                    {guild.desc}
                  </p>

                  <div className="pt-4 flex items-center justify-between">
                    <Button variant="ghost" className="px-0 group/btn">
                      Explore Guild
                      <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" size="sm">
                      Join Guild
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-24 p-12 glass-strong rounded-[2rem] text-center space-y-8 relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
             <h2 className="text-3xl font-bold text-white">Can't find your domain?</h2>
             <p className="text-[var(--muted)] max-w-xl mx-auto">
               The DevLink ecosystem is constantly growing. If you have the expertise, 
               you can apply to lead and establish a new specialized guild.
             </p>
             <Button className="h-12 px-8">
               Propose a New Guild
             </Button>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
