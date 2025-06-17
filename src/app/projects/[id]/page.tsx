"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import clsx from "clsx";
import TaskModal from "@/components/TaskModal";
import InviteMemberModal from "@/components/InviteMemberModal";
import { Button } from "@/components/ui/button";
import TaskCard from "@/components/TaskCard";
import Swal from "sweetalert2";

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { createPortal } from 'react-dom';
import { DraggableWrapper } from "@/components/DraggableWrapper";
import { useDroppable } from '@dnd-kit/core';
import TaskStatusChart from "@/components/TaskStatusChart";

interface Member {
  userId: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  assigneeId?: string | null;
}

interface Project {
  id: string;
  name: string;
  members: Member[];
  tasks: Task[];
}

function DroppableColumn({ id, children, currentStatus }: { id: string, children: React.ReactNode, currentStatus: Task['status'] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "bg-gray-100 rounded-lg p-4 min-h-[300px]",
        {
          "ring-2 ring-blue-500 ring-offset-2": isOver,
          "border-sky-300": currentStatus === "in-progress",
          "border-green-300": currentStatus === "done",
          "border-red-300": currentStatus === "todo",
        }
      )}
    >
      {children}
    </div>
  );
}


export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    })
  );

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.data);
    } catch (err) {
      console.error("Failed to load project", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const groupTasks = (status: Task["status"]) =>
    project?.tasks.filter((t) => t.status === status) || [];

  const todoCount = project?.tasks.filter(task => task.status === 'todo').length || 0;
  const inProgressCount = project?.tasks.filter(task => task.status === 'in-progress').length || 0;
  const doneCount = project?.tasks.filter(task => task.status === 'done').length || 0;


  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskBeingDragged = project?.tasks.find(t => t.id === active.id);
    if (taskBeingDragged) {
      setActiveTask(taskBeingDragged);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const draggedTaskId = String(active.id);
    const newStatus = String(over.id) as Task["status"];

    const validStatuses: Task["status"][] = ["todo", "in-progress", "done"];
    if (!validStatuses.includes(newStatus)) {
        console.warn(`Invalid drop target ID: ${newStatus}`);
        return;
    }

    if (!project) return;

    const updatedTasks = project.tasks.map(task =>
      task.id === draggedTaskId ? { ...task, status: newStatus } : task
    );
    setProject(prev => prev ? { ...prev, tasks: updatedTasks } : null);

    try {
      await api.put(`/tasks/detail/${draggedTaskId}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update task status via drag and drop", err);
      setProject(prev => prev ? { ...prev, tasks: project.tasks } : null);
      Swal.fire("Error", "Failed to update task status. Please try again.", "error");
    }
  };

  if (loading) return <p className="p-6">Loading project...</p>;
  if (!project) return <p className="p-6">Project not found.</p>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <div className="flex gap-2">
              <TaskModal
              projectId={project.id}
              onSuccess={fetchProject}
              trigger={<Button>+ Task</Button>}
              />
              <InviteMemberModal
              projectId={project.id}
              onSuccess={fetchProject}
              trigger={<Button variant="outline">+ Member</Button>}
              />
          </div>
        </div>

        {/* New section for Members and Task Status Overview, side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Members List Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Members</h2>
            {project.members.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No members</p>
            ) : (
              <ul className="list-disc list-inside text-sm text-gray-700">
              {project.members.map((member) => (
                <li key={member.userId}>{member.email}</li>
              ))}
              </ul>
            )}
          </div>

          {/* Task Analytics Chart Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Task Status Overview</h2>
            {project.tasks.length > 0 ? (
              <TaskStatusChart
                todoCount={todoCount}
                inProgressCount={inProgressCount}
                doneCount={doneCount}
              />
            ) : (
              <p className="text-sm text-gray-400 italic">No tasks to display analytics.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["todo", "in-progress", "done"].map((status) => (
              <DroppableColumn key={status} id={status} currentStatus={status as Task['status']}>
                <h3 className="text-base font-semibold capitalize mb-4">
                  {status.replace("-", " ")}
                </h3>

                <div className="space-y-3">
                  {groupTasks(status as Task["status"]).map((task) => (
                    <DraggableWrapper key={task.id} id={task.id} data={task}>
                      <TaskCard
                        task={task}
                        projectId={project.id}
                        onSuccess={fetchProject}
                      />
                    </DraggableWrapper>
                  ))}

                  {groupTasks(status as Task["status"]).length === 0 && (
                    <p className="text-sm text-gray-400 italic">No tasks</p>
                  )}
                </div>
              </DroppableColumn>
            ))}
          </div>
        </div>
      </main>

      {createPortal(
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              projectId={project.id}
              onSuccess={() => {}}
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}