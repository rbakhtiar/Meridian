const STORAGE_KEY = "meridian_workspace_v1";

const initialData = {
  projects: [
    {
      id: 1,
      name: "Build Meridian",
      description: "Create a connected productivity system.",
      progress: 25,
      status: "Active",
      deadline: ""
    },
    {
      id: 2,
      name: "Personal portfolio",
      description: "Develop a professional project portfolio.",
      progress: 60,
      status: "Active",
      deadline: ""
    }
  ],

  goals: [
    {
      id: 1,
      name: "Launch a complete product",
      description: "Build and publish a finished application.",
      progress: 30
    }
  ],

  tasks: [
    {
      id: 1,
      title: "Design the Meridian dashboard",
      project: "Build Meridian",
      due: "",
      done: false
    },
    {
      id: 2,
      title: "Create project architecture",
      project: "Build Meridian",
      due: "",
      done: true
    }
  ]
};

export function getData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : structuredClone(initialData);
  } catch {
    return structuredClone(initialData);
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addItem(type, item) {
  const data = getData();

  const nextId = Math.max(
    0,
    ...Object.values(data).flat().map(x => x.id || 0)
  ) + 1;

  data[type].push({ id: nextId, ...item });
  saveData(data);

  return data;
}

export function updateItem(type, id, updates) {
  const data = getData();

  data[type] = data[type].map(item =>
    item.id === Number(id) ? { ...item, ...updates } : item
  );

  saveData(data);
  return data;
}

export function deleteItem(type, id) {
  const data = getData();
  data[type] = data[type].filter(item => item.id !== Number(id));
  saveData(data);
  return data;
}
