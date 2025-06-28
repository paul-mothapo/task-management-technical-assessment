import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DEFAULT_VALUES, STATUS_OPTIONS, PRIORITY_OPTIONS, TaskFormData, TaskFormProps } from "@/constants/formConstants";


export const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingTask,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TaskFormData>({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (editingTask) {
      setValue("title", editingTask.title);
      setValue("description", editingTask.description);
      setValue("status", editingTask.status);
      setValue("priority", editingTask.priority);
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [editingTask, setValue, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="Task Title"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.title
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Task Description"
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.description
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                {...register("status")}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                {...register("priority")}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors duration-200"
              >
                {editingTask ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
