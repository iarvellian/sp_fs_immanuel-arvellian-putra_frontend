import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface DraggableWrapperProps {
  id: string;
  data?: any;
  children: React.ReactNode;
}

export function DraggableWrapper({ id, data, children }: DraggableWrapperProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: data,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}