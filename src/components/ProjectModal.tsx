"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import Swal from "sweetalert2";

interface Props {
  project?: { id: string; name: string };
  onSuccess: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ProjectModal({ project, onSuccess, trigger, open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOpen = open !== undefined ? open : internalOpen;
  const handleOpenChange = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  useEffect(() => {
    if (isOpen) {
      setName(project?.name || "");
      setError(null);
    } else {
      setName("");
      setError(null);
    }
  }, [isOpen, project]);

  const handleSubmit = async () => {
    // if (!name.trim()) {
    //   setError("Name is required");
    //   return;
    // }

    setLoading(true);
    setError(null);
    try {
      if (project) {
        await api.put(`/projects/${project.id}`, { name });
        Swal.fire("Success", "Project updated!", "success");
      } else {
        await api.post("/projects", { name });
        Swal.fire("Success", "Project created!", "success");
      }

      onSuccess();
      handleOpenChange(false);
      setName("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.name?.[0] ||
        err?.response?.data?.message ||
        "Failed to save project";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="space-y-4">
        <DialogTitle>{project ? "Edit Project" : "Create Project"}</DialogTitle>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
            {loading ? "Saving..." : project ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
