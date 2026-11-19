// proxy.ts redirects to /login before this page renders if no one is logged in.

export default function Home() {

  // Todo: Get user recipes

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

      </main>
    </div>
  );
}
