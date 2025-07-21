import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";

interface LandingProps {
  onLoginSuccess: () => void;
}

export const Landing = ({ onLoginSuccess }: LandingProps) => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const handleAuthSuccess = () => {
    setAuthModalOpen(false); // Close modal on success
    onLoginSuccess();      // Notify parent component
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Neptunize</h1>
          <Button onClick={() => setAuthModalOpen(true)}>Login / Sign Up</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Create AI-Powered Podcasts in Minutes
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            From a simple idea to a fully produced podcast. Let our AI enhance your script, generate realistic voices, and deliver ready-to-publish audio.
          </p>
          <Button size="lg" onClick={() => setAuthModalOpen(true)}>
            Get Started for Free
          </Button>
        </section>

        {/* Features Section */}
        <section className="bg-secondary/50 py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold">How It Works</h3>
                    <p className="text-muted-foreground">A simple, three-step process.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <h4 className="text-xl font-semibold mb-2">1. Share Your Idea</h4>
                        <p className="text-muted-foreground">Provide a topic or a basic script. Our AI will brainstorm, structure, and enhance your content.</p>
                    </div>
                    <div className="p-6">
                        <h4 className="text-xl font-semibold mb-2">2. Choose a Voice</h4>
                        <p className="text-muted-foreground">Select from a library of high-quality, realistic AI voices to bring your script to life.</p>
                    </div>
                    <div className="p-6">
                        <h4 className="text-xl font-semibold mb-2">3. Generate & Download</h4>
                        <p className="text-muted-foreground">Receive your complete podcast as an audio file, ready for you to share with the world.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; 2025 Neptunize. All rights reserved.</p>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onAuthSuccess={handleAuthSuccess} 
      />
    </div>
  );
};
