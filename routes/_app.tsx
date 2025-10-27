import { define } from "../utils.ts";
import { Partial } from "fresh/runtime";
import "@/assets/styles.css";

export default define.page(function App({ Component }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>freshdemo</title>
        <link rel="stylesheet" href="assets/styles.css" />
      </head>
      <body f-client-nav>
        <Partial name="body">
          <Component />
        </Partial>
      </body>
    </html>
  );
});
