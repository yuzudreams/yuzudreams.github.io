import "./common.css";

// allow the EJS files to import assets via their `asset` function
import.meta.glob("../assets/**");

{
  const nav_details = [
    ...document.querySelectorAll("nav details"),
  ] as HTMLDetailsElement[];
  addEventListener("click", (e) => {
    if (e.target instanceof Node) {
      for (const details of nav_details) {
        if (!details.contains(e.target)) {
          details.open = false;
        }
      }
    }
  });
}
