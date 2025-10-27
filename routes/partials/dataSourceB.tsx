import { define, delay, State } from "@/utils.ts";
import { Partial } from "fresh/runtime";
import { Context, RouteConfig } from "fresh";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export const handler = define.handlers({
  async GET(_ctx: Context<State>) {
    await delay(2000);
    console.log("[/partials/dataSourceB] GET handler running!");
    return {
      data: { message: "Initial Data", date: new Date().toISOString() },
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
    <Partial name="dataSourceB">
      <div>
        <pre class="text-xs text-slate-600">
          {JSON.stringify(ctx.data, null, 2)}
        </pre>
      </div>
    </Partial>
  );
});
