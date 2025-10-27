import { useEffect } from "preact/hooks";

export default function InitialPartialLoader() {
  useEffect(() => {
    const partialForms = document.querySelectorAll(
      "form[f-partial]",
    ) as NodeListOf<HTMLFormElement>;

    partialForms.forEach((form) => {
      const originalMethod = form.method;
      form.method = "GET";
      form.requestSubmit();
      form.method = originalMethod;
    });
  }, []);

  return null;
}
