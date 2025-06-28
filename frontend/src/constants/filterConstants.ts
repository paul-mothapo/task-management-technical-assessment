import { TaskStatus, TaskPriority, DateRange } from "@/types";

export const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: TaskStatus.PENDING, label: "Pending" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.COMPLETED, label: "Completed" },
];

export const PRIORITY_OPTIONS = [
  { value: "", label: "All Priority" },
  { value: TaskPriority.LOW, label: "Low" },
  { value: TaskPriority.MEDIUM, label: "Medium" },
  { value: TaskPriority.HIGH, label: "High" },
];

export const DATE_RANGE_OPTIONS = [
  { value: "", label: "All Time" },
  { value: "today" as DateRange, label: "Today" },
  { value: "yesterday" as DateRange, label: "Yesterday" },
  { value: "this_week" as DateRange, label: "This Week" },
  { value: "last_week" as DateRange, label: "Last Week" },
  { value: "this_month" as DateRange, label: "This Month" },
  { value: "last_month" as DateRange, label: "Last Month" },
]; 