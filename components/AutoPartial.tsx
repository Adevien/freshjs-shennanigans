import { Partial } from "fresh/runtime";
import type { ComponentChildren } from "preact";

declare global {
  var __AUTOLOAD: Set<string> | undefined;
}

interface AutoPartialProps {
  name: string;
  children?: ComponentChildren;
  ["f-data-initial-load"]?: boolean;
}

export function AutoPartial(props: AutoPartialProps) {
  if (props["f-data-initial-load"]) {
    globalThis.__AUTOLOAD ??= new Set<string>();
    globalThis.__AUTOLOAD.add(props.name);
  }

  // The <template> tag doesn’t affect layout or output, but survives in DOM
  return (
    <Partial name={props.name}>
      <template data-partial-marker={props.name}></template>
      {props.children}
    </Partial>
  );
}
