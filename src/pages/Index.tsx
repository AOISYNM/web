import FireBackground from "@/components/FireBackground";

function Index() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <FireBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <h1 className="text-6xl font-bold text-white">
          PUNJAN
        </h1>
      </div>
    </main>
  );
}

export default Index;