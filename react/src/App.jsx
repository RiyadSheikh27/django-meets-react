import {useState} from 'react'

const INITIAL_TASK = [
  { id: 1, title: "Buy groceries", is_done: false },
  { id: 2, title: "Clean the house", is_done: true },
  { id: 3, title: "Finish the project", is_done: false },
];

const FILTERS = ["all", "done", "undone"];

function Card({ title, children }) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  
  console.log("Counter rendered, count:", count);

  return (
    <div className="space-y-3">
      <p className="text-lg">Count: {count}</p>
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          onClick={() => setCount(count + 1)}>
          +1
        </button>
        <button 
          className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          onClick={() => {
          setCount(count + 1);
          setCount(count + 1);
          setCount(count + 1);
        }}>
          +3(Wrong)
        </button>
        <button
          className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
          onClick={() => {
            setCount((prev) => prev + 1);
            setCount((prev) => prev + 1);
            setCount((prev) => prev + 1);
          }}
        >
          +3(Right)
        </button>
        <button
          className="rounded-lg bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700"
          onClick={() => setCount(0)}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function TaskPlayground() {
  const [tasks, setTasks] = useState(INITIAL_TASK);
  const [filter, setFilter] = useState("all");

  const handleToggle = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, is_done: !task.is_done } : task,
      ),
    );
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleAdd = () => {
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title: `নতুন কাজ ${prev.length + 1}`, is_done: false },
    ]);
  };

  const visibleTasks = tasks.filter((task) => {
    if (filter === "done") return task.is_done;
    if (filter === "undone") return !task.is_done;
    return true; // "all"
  });

  const doneCount = tasks.filter((task) => task.is_done).length;

  return (
    <div className="space-y-4">
      {/* ফিল্টার ট্যাব: map দিয়ে তিনটি বাটন, সক্রিয়টার রং আলাদা */}
      <div className="flex gap-2">
        {FILTERS.map((name) => (
          <button
            key={name}
            onClick={() => setFilter(name)}
            className={
              filter === name
                ? "rounded-full bg-blue-600 px-3 py-1 text-sm text-white"
                : "rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
            }
          >
            {name}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        মোট {tasks.length} টি, শেষ {doneCount} টি
      </p>
      {visibleTasks.length === 0 ? (
        <p className="py-6 text-center text-gray-400">কোনো কাজ নেই</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {visibleTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <span
                className={
                  task.is_done ? "text-gray-400 line-through" : "text-gray-900"
                }
              >
                {task.title}
              </span>
              <div className="flex gap-2">
                <button
                  className="rounded-lg bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                  onClick={() => handleToggle(task.id)}
                >
                  {task.is_done ? "Undo" : "Done"}
                </button>
                <button
                  className="rounded-lg bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        onClick={handleAdd}
      >
        + একটি কাজ যোগ করুন
      </button>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
        <Card title="Counter">
          <Counter />
        </Card>
        <Card title="Tasks">
          <TaskPlayground />
        </Card>
      </div>
    </div>
  );
}

export default App;