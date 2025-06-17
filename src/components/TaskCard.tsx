"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import TaskModal from "@/components/TaskModal";
import { PencilIcon, Trash2Icon } from "lucide-react";
import Swal from "sweetalert2";
import api from "@/lib/api";
import clsx from "clsx";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  assigneeId?: string | null;
}

interface Props {
  task: Task;
  projectId: string;
  onSuccess: () => void;
}

export default function TaskCard({ task, projectId, onSuccess }: Props) {
  const [editing, setEditing] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Task?",
      text: "This task will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it"
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/tasks/detail/${task.id}`);
      Swal.fire("Deleted!", "Task has been deleted.", "success");
      onSuccess();
    } catch (err) {
      console.error("Failed to delete task", err);
      Swal.fire("Error", "Failed to delete task", "error");
    }
  };

  return (
    <div
      className={clsx(
        "bg-white p-3 rounded shadow-sm border border-gray-200 relative group",
        {
          "border-sky-300": task.status === "in-progress",
          "border-green-300": task.status === "done",
          "border-red-300": task.status === "todo",
        }
      )}
    >
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
          <PencilIcon className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="destructive" onClick={handleDelete}>
          <Trash2Icon className="w-4 h-4" />
        </Button>
      </div>

      <h4 className="font-medium mb-1">{task.title}</h4>
      <p className="text-sm text-gray-500">{task.description}</p>

      {editing && (
        <TaskModal
          projectId={projectId}
          onSuccess={() => {
            setEditing(false);
            onSuccess();
          }}
          task={task}
          open={editing}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setEditing(false);
            }
          }}
        />
      )}
    </div>
  );
}