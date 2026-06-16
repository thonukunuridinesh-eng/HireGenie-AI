import { Link } from "react-router-dom";

import Button from "../../components/ui/Button";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-premium-gradient px-4 text-center text-white">
      <div>
        <p className="text-8xl font-black gradient-text">404</p>

        <h1 className="mt-6 text-3xl font-bold">Page not found</h1>

        <p className="mx-auto mt-3 max-w-md text-slate-400">
          The page you are looking for does not exist or has been moved.
        </p>

        <Button as={Link} to="/" className="mt-8">
          Go Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
