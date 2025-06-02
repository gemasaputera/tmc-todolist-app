export type SubtaskData = {
  id: string;
  checked: boolean;
  description: string;
};

export type TodoData = {
  id: string;
  checked: boolean;
  duedate: string;
  description: string;
  subTodos: SubtaskData[];
};
