import { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryOptions = ['Hardware', 'Software', 'Network', 'Access Request', 'Email', 'Security', 'Other'];
const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
const assigneeOptions = ['Unassigned', 'Alex Chen', 'Jordan Lee', 'Sam Wilson', 'Morgan Taylor'];
const departmentOptions = ['IT', 'HR', 'Finance', 'Operations', 'Sales', 'Marketing', 'General'];

export function CreateTicket() {
  const [category, setCategory] = useState('Software');
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState('Unassigned');
  const [department, setDepartment] = useState('IT');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <h2 className="border-b border-border bg-background py-4 text-center text-xl font-semibold text-foreground">
        Create Support Ticket
      </h2>

      <div className="flex flex-col md:flex-row">
        {/* Left column: form fields with alternating row backgrounds */}
        <div className="flex flex-1 flex-col border-r border-border">
          {[
            {
              label: 'Category',
              value: category,
              onChange: setCategory,
              options: categoryOptions,
              type: 'select',
            },
            {
              label: 'Priority',
              value: priority,
              onChange: setPriority,
              options: priorityOptions,
              type: 'select',
            },
            {
              label: 'Assigned To',
              value: assignee,
              onChange: setAssignee,
              options: assigneeOptions,
              type: 'select',
            },
            {
              label: 'Department',
              value: department,
              onChange: setDepartment,
              options: departmentOptions,
              type: 'select',
            },
            {
              label: 'Due Date',
              value: dueDate,
              onChange: setDueDate,
              type: 'date',
            },
          ].map((field, index) => (
            <div
              key={field.label}
              className={cn(
                'flex items-center justify-between gap-4 border-b border-border px-4 py-3',
                index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
              )}
            >
              <label className="flex shrink-0 items-center gap-1 text-sm font-medium text-foreground">
                {field.label}
                <span className="text-destructive">*</span>
                <ChevronDown className="size-4 text-foreground" aria-hidden />
              </label>
              {field.type === 'select' ? (
                <select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="relative flex min-w-0 flex-1">
                  <input
                    type="date"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full rounded-md border border-input bg-background py-2 pl-3 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-foreground" aria-hidden />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right column: Issue Description */}
        <div className="flex flex-1 flex-col bg-muted/30 p-4">
          <label className="mb-2 flex items-center gap-1 text-sm font-medium text-foreground">
            Issue Description
            <span className="text-destructive">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail. Include steps to reproduce, any error messages, when it started, and what you've already tried. This helps our support team resolve your ticket faster."
            rows={10}
            className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 border-t border-border bg-background px-4 py-4">
        <button
          type="button"
          className="rounded-md bg-indigo-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        >
          Submit Ticket
        </button>
      </div>
    </div>
  );
}
