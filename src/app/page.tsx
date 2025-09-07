import Link from 'next/link'

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center text-center p-4">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
      <p className="mb-6">Simple full‑stack app to manage your tasks.</p>
      <div>
        <button className="bg-black text-white px-4 py-2 rounded-md mr-2">
          <Link href="/login">Login</Link>
        </button>
        <button className="bg-black text-white px-4 py-2 rounded-md">
          <Link href="/signup">Signup</Link>
        </button>
      </div>
    </div>
  );
}
