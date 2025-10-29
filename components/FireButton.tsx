// islands/FireButton.tsx
import { useEffect } from "preact/hooks";

export default function FireButton(
  { url, payload }: { url: string; payload?: Record<string, string> },
) {
  useEffect(() => {
    // ensure Fresh hydration actually ran
    console.log("[FireButton] hydrated");
  }, []);

  async function handleClick() {
    try {
      const body = new URLSearchParams(payload ?? { action: "fire" });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      console.log("[FireButton] POST", url, res.status);
    } catch (e) {
      console.error("[FireButton] error", e);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      class="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg shadow active:scale-95 transition"
    >
      Fire Once
    </button>
  );
}
