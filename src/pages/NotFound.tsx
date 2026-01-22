import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-light text-architectural mb-8">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link 
          to="/" 
          className="text-minimal text-foreground hover:text-muted-foreground transition-colors duration-300"
        >
          ← BACK TO HOME
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
