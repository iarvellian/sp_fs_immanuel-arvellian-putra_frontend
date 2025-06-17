"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow px-6 py-4 mb-4">
      <div className="container mx-auto flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => window.location.href = "/dashboard"}
          disabled={!user}
          className={!user ? "cursor-not-allowed" : ""}
        >
          <span className="text-lg font-bold">Project Manager</span>
        </Button>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">{user.email}</span>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}