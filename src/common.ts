import "./common.css";

// allow the EJS files to import assets via their `asset` function
import.meta.glob("../assets/**");

{
  const nav_details = document.querySelector(
    "nav .lang-select",
  ) as HTMLDetailsElement;
  addEventListener("click", (e) => {
    if (e.target instanceof Node) {
      if (!nav_details.contains(e.target)) {
        nav_details.open = false;
      }
    }
  });
}
