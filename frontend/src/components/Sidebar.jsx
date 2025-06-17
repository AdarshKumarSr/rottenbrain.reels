export default function Sidebar() {
  return (
    <aside className="hidden md:block w-full max-w-[320px] px-4 py-6 border-r border-[#dcd6c9]">
      <button className="bg-[#3e3527] text-white w-full py-2 rounded mb-4">Library</button>
      <hr className="border-t border-[#3e3527] mb-4" />
      <h2 className="text-xl font-semibold mb-2">Workspaces</h2>
      <div className="flex flex-col gap-2 mb-4">
        <button className="bg-[#3e3527] text-white py-2 px-4 rounded">~~~~~~~~~~~</button>
        <button className="bg-[#3e3527] text-white py-2 px-4 rounded">~~~~~~~~~~~</button>
      </div>
      <button className="border border-[#3e3527] py-2 px-4 rounded hover:bg-[#f2ece2]">Create New</button>
    </aside>
  );
}
