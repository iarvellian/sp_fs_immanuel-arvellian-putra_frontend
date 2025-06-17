import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

interface Props {
  id: string;
  name: string;
  onDelete?: (id: string) => void;
  onEdit?: () => void;
  onClick?: () => void
}

export default function ProjectCard({ id, name, onDelete, onEdit, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="p-4 border rounded-xl shadow relative group cursor-pointer hover:bg-accent/30 transition"
    >
      <h2 className="font-medium mb-2">{name}</h2>

      <div
        className="absolute top-2 right-2 flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {onEdit && (
          <Button size="sm" variant="outline" onClick={onEdit}>
            <MdEdit />
          </Button>
        )}
        {onDelete && (
          <Button size="sm" variant="destructive" onClick={() => onDelete(id)}>
            <FaTrash />
          </Button>
        )}
      </div>
    </div>
  );
}
