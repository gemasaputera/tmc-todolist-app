export type SubtaskData = {
  subtaskId: string;
  checked: boolean;
  title: string;
};

export type TodoData = {
  id: string;
  checked: boolean;
  duedate: string;
  title: string;
  subtask: SubtaskData[];
};
