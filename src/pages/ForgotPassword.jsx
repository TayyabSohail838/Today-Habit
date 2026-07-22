import { useState } from "react";
import { Link } from "react-router-dom";
import * as authService from "../services/authService";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-1">Password reset</h1>
        <p className="text-muted-foreground text-sm mb-6">This option is currently unavailable.</p>
        <Link to="/login">
          <Button variant="outline" className="w-full">Back to Login</Button>
        </Link>
      </Card>
    </div>
  );
}
