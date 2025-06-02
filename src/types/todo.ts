export type SubtaskData = {
  id: string;
  checked: boolean;
  description: string;
};

export type TodoData = {
  id: string;
  checked: boolean;
  dueDate: string;
  description: string;
  subTodos: SubtaskData[];
};
