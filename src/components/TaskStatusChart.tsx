// /components/TaskStatusChart.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TaskStatusChartProps {
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
}

export default function TaskStatusChart({ todoCount, inProgressCount, doneCount }: TaskStatusChartProps) {
  const data = {
    labels: ['Todo', 'In Progress', 'Done'],
    datasets: [
      {
        data: [todoCount, inProgressCount, doneCount],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Red for Todo
          'rgba(54, 162, 235, 0.6)', // Blue for In Progress
          'rgba(75, 192, 192, 0.6)', // Green for Done
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed;
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <div className="relative h-48 w-full md:h-64 lg:h-80">
      {todoCount === 0 && inProgressCount === 0 && doneCount === 0 ? (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 italic">No tasks to display.</p>
      ) : (
        <Pie data={data} options={options} />
      )}
    </div>
  );
}