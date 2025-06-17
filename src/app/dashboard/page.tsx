"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the project permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/projects/${id}`);
      await fetchProjects();
      Swal.fire("Deleted!", "Project has been deleted.", "success");
    } catch (err) {
      console.error("Failed to delete project:", err);
      Swal.fire("Error", "Failed to delete project", "error");
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-2">
        Welcome, {user?.email} 👋
      </h1>
      <p className="text-muted-foreground mb-6">Here are your projects:</p>

      <ProjectModal
        trigger={<Button className="mb-4">+ New Project</Button>}
        onSuccess={fetchProjects}
      />

      {editProject && (
        <ProjectModal
          project={editProject}
          open={!!editProject}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setEditProject(null);
            }
          }}
          onSuccess={() => {
            fetchProjects();
            setEditProject(null);
          }}
        />
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-gray-500">You have no projects.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              onDelete={handleDelete}
              onEdit={() => setEditProject(project)}
              onClick={() => router.push(`/projects/${project.id}`)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
