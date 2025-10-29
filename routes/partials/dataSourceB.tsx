import { define, delay, State } from "@/utils.ts";
import { Context, RouteConfig } from "fresh";
import { AutoPartial } from "../../components/AutoPartial.tsx";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export const handler = define.handlers({
  async GET(_ctx: Context<State>) {
    await delay(2000);
    console.log("[/partials/dataSourceB] GET handler running!");
    return {
      data: { message: "Initial Data B", date: new Date().toISOString() },
    };
  },
  async POST(_ctx: Context<State>) {
    await delay(2000);
    console.log("[/partials/dataSourceB] POST handler running!");
    return {
      data: { message: "Refetched Data", date: new Date().toISOString() },
    };
  },
});

export default define.page<typeof handler>((ctx) => {
  return (
    <AutoPartial name="dataSourceB" f-data-initial-load>
      <div>
        <pre class="text-xs text-slate-600">
          {JSON.stringify(ctx.data, null, 2)}
        </pre>
      </div>
    </AutoPartial>
  );
});
