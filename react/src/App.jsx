function App() {
  return (
    // JSX-এ HTML-এর "class" লেখা হয় "className" নামে, কারণ class শব্দটি JavaScript-এর সংরক্ষিত শব্দ
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
        <p className="mt-2 text-sm text-gray-500">
          API: {import.meta.env.VITE_API_BASE_URL}
        </p>
        <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          Test button
        </button>
      </div>
    </div>
  );
}

export default App;