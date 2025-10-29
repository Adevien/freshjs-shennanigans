import { define, State } from "@/utils.ts";
import { Context } from "fresh";
import { AutoPartial } from "../components/AutoPartial.tsx";

export const handler = define.handlers({
  GET(_ctx: Context<State>) {
    console.log("[/index] GET handler running!");
    return {
      data: { message: "Initial Data Index", date: new Date().toISOString() },
    };
  },
});

const Skeleton = () => (
  <div class="space-y-3 animate-pulse h-16">
    <div class="bg-slate-200 p-3 rounded border border-slate-300 h-full">
      <div class="h-2 bg-slate-300 rounded w-3/4" />
      <div class="h-2 bg-slate-300 rounded w-1/2" />
    </div>
  </div>
);

const DataSource = ({ name }: { name: string }) => (
  <section class="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
    <h2 class={`text-2xl font-semibold text-blue-600 mb-4`}>
      Data Source {name}
    </h2>

    <form
      method="POST"
      f-partial={`/partials/dataSource${name}`}
      class="mb-4"
    >
      <input type="hidden" name="action" value="revalidate" />
      <button
        type="submit"
        class={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
      >
        <span class="hidden [form[disabled]_&]:inline-block animate-spin">
          ⟳
        </span>
        <span>Refetch {name}</span>
      </button>
    </form>

    <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
      <AutoPartial name={`dataSource${name}`} f-data-initial-load>
        <Skeleton />
      </AutoPartial>
    </div>
  </section>
);

export default define.page(() => (
  <main class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <h1 class="text-4xl font-bold text-slate-800 mb-8">
        Fresh Partials Shennanigans Demo
      </h1>
      <div class="grid md:grid-cols-2 gap-6">
        <DataSource name="A" />
        <DataSource name="B" />
      </div>

      <form
        method="POST"
        action="/partials/dataSourceA"
        class="mb-4"
      >
        <button
          type="submit"
          class={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
        >
          Independent form updating source A
        </button>
      </form>
    </div>
  </main>
));
