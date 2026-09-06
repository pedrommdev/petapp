import { AppHeader } from "@/components/AppHeader";
import { BreedGrid } from "@/components/BreedGrid";
import { getAllBreeds } from "@/lib/catalog";

export default function Home() {
  const breeds = getAllBreeds();

  return (
    <>
      <AppHeader />
      <main>
        <h1 className="mt-2 italic md:mt-6">Find yours</h1>
        <p className="mt-2 text-muted">
          A playful encyclopedia of cat and dog breeds.
        </p>
        <div id="breed-grid" className="mt-6">
          <BreedGrid breeds={breeds} />
        </div>
      </main>
    </>
  );
}
