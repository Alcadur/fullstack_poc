import TopBar from "@/app/tasks/ui/top-bar";

export default function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
      <section className="mx-auto md:max-w-250 min-w-75">
          <header className="flex justify-center gap-3 p-3 shadow-[0_15px_10px_-15px_#111]">
              <TopBar />
          </header>
          <main className="flex flex-colr justify-center shrink-0">
              {children}
          </main>
      </section>
  );
}
