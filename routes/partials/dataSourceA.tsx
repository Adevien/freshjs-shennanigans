import { define, State } from "@/utils.ts";
import { Context } from "fresh";
import { AutoPartial } from "../../components/AutoPartial.tsx";

export const handler = define.handlers({
  GET(_ctx: Context<State>) {
    return {
      data: { message: "Initial Data A", date: new Date().toISOString() },
    };
  },
  POST(_ctx: Context<State>) {
    return {
      data: {
        message: "Updated New Data",
        date: new Date().toISOString(),
      },
    };
  },
});

export default define.page<typeof handler>((ctx) => {
  return (
    <AutoPartial name="dataSourceA" f-data-initial-load>
      <div>
        <pre class="text-xs text-slate-600">
          {JSON.stringify(ctx.data, null, 2)}
        </pre>
      </div>
    </AutoPartial>
  );
});
