"use client";

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Swal from "sweetalert2";
import { Textarea } from "@/components/ui/textarea";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  assigneeId?: string | null;
}

interface Props {
  projectId: string;
  onSuccess: () => void;
  trigger?: React.ReactNode;
  task?: Task;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function TaskModal({ projectId, onSuccess, trigger, task, open, onOpenChange }: Props) {
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const handleOpenChange = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
    reset,
    watch,
    setError,
  } = useForm<{
    title: string;
    description: string;
    status: string;
    assigneeId: string;
  }>();

  const watchedAssigneeId = watch("assigneeId");

  useEffect(() => {
    if (isOpen) {
      api.get("/users").then((res) => setUsers(res.data.data)).catch(err => {
        console.error("Failed to fetch users:", err);
        Swal.fire("Error", "Failed to load users for assignee.", "error");
      });

      if (task) {
        setValue("title", task.title);
        setValue("description", task.description);
        setValue("status", task.status);
        setValue("assigneeId", task.assigneeId || "__none__");
      } else {
        reset({
          title: "",
          description: "",
          status: "todo",
          assigneeId: "__none__",
        });
      }
    } else {
      reset();
    }
  }, [isOpen, task, setValue, reset]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      if (payload.assigneeId === "__none__") {
        delete payload.assigneeId;
      }

      if (task) {
        await api.put(`/tasks/detail/${task.id}`, payload);
        Swal.fire("Success", "Task updated!", "success");
      } else {
        await api.post(`/tasks/${projectId}`, payload);
        Swal.fire("Success", "Task created!", "success");
      }

      onSuccess();
      handleOpenChange(false);
    } catch (err: any) {
      let hasSpecificFieldErrors = false;

      if (err?.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        for (const fieldName in backendErrors) {
          if (backendErrors.hasOwnProperty(fieldName)) {
            const errorMessage = backendErrors[fieldName][0];
            setError(fieldName as keyof typeof errors, { type: 'manual', message: errorMessage });
            hasSpecificFieldErrors = true;
          }
        }
      }

      if (!hasSpecificFieldErrors) {
        const swalMessage = err?.response?.data?.message || "Failed to save task.";
        Swal.fire("Error", swalMessage, "error");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(val) => setValue("status", val)}
              defaultValue={task?.status || "todo"}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
          </div>

          <div>
            <Label htmlFor="assigneeId">Assignee For</Label>
            <Select
              onValueChange={(val) => setValue("assigneeId", val)}
              value={watchedAssigneeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user to assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No Assignee</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assigneeId && <p className="text-sm text-red-500">{errors.assigneeId.message}</p>}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (task ? "Update Task" : "Create Task")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}