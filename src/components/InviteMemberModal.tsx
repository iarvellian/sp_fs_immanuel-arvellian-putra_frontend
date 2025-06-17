"use client";

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

interface Props {
  projectId: string;
  onSuccess: () => void;
  trigger: React.ReactNode;
}

export default function InviteMemberModal({ projectId, onSuccess, trigger }: Props) {
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
  const [open, setOpen] = useState(false);
  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ email: string }>();

  useEffect(() => {
    if (open) {
      api.get("/users").then((res) => setUsers(res.data.data));
    }
  }, [open]);

  const onSubmit = async (data: { email: string }) => {
    try {
      await api.post(`/projects/${projectId}/invite`, data);
      Swal.fire("Success", "Member invited!", "success");
      onSuccess();
      setOpen(false);
    } catch (err: any) {
      const message =
        err?.response?.data?.errors?.email?.[0] ||
        err?.response?.data?.message ||
        "Failed to invite member";
      Swal.fire("Error", message, "error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Invite Member</DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label>Email</Label>
            <Select onValueChange={(val) => setValue("email", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select user to invite" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.email}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Inviting..." : "Invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
