import Link from "next/link"
import { Sparkles, History, Settings, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    // <CHANGE> Applied glass-header styling with enhanced visual effects
    <header className="sticky top-0 z-50 w-full glass-header">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            AI Content Studio
          </span>
        </Link>

        <nav className="flex items-center gap-1.5">
          {/* <CHANGE> Enhanced navigation buttons with hover-lift effects */}
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="hidden md:flex hover-lift hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <Link href="/">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="hidden md:flex hover-lift hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <Link href="/history">
              <History className="h-4 w-4 mr-2" />
              History
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="hidden md:flex hover-lift hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <Link href="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>

          <div className="h-6 w-px bg-border/50 mx-2 hidden md:block" />

          {/* <CHANGE> Modern notification bell with pulsing indicator */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover-lift hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full border-2 border-background animate-pulse" />
          </Button>

          {/* <CHANGE> Elevated user profile button with gradient border */}
          <Button 
            variant="ghost" 
            size="icon" 
            asChild 
            className="rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover-lift ml-1"
          >
            <Link href="/profile">
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center hover:from-primary/30 hover:to-accent/30 transition-all duration-300">
                <User className="h-5 w-5 text-primary" />
              </div>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
