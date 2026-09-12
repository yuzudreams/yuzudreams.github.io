import "./common";
import "./index.css";
import "@splidejs/splide/css";
import Splide from "@splidejs/splide";

{
  const splide_elem = document.querySelector(
    "header > .series-carousel > .splide",
  ) as HTMLElement;
  const splide = new Splide(splide_elem, {
    type: "loop",
    arrows: false,
    padding: getComputedStyle(splide_elem).getPropertyValue("--padding"),
  });
  splide.mount();
  for (const slide of splide.root.querySelectorAll(".splide__slide")) {
    slide.addEventListener("click", () => {
      if (slide.classList.contains("is-next")) {
        splide.go(">");
      } else if (slide.classList.contains("is-prev")) {
        splide.go("<");
      }
    });
  }
}

{
  const fullscreen_div = document.getElementById("fullscreen")!;
  const fullscreen_splide = new Splide(fullscreen_div, {
    type: "loop",
  });
  let fullscreen_splide_init = false;

  const exit_fullscreen = () => {
    fullscreen_div.classList.remove("shown");
    document.body.style.removeProperty("overflow");
  };

  fullscreen_splide.root
    .querySelector("& > .fullscreen")!
    .addEventListener("click", exit_fullscreen);

  fullscreen_splide.root
    .querySelector("& > .splide__track")!
    .addEventListener("click", (e) => {
      if (e.target instanceof HTMLImageElement) return;
      exit_fullscreen();
    });

  addEventListener("keydown", (e) => {
    if (!fullscreen_div.classList.contains("shown")) return;
    switch (e.key) {
      case "Escape":
        exit_fullscreen();
        break;
      case "ArrowLeft":
        fullscreen_splide.go("<");
        break;
      case "ArrowRight":
        fullscreen_splide.go(">");
        break;
    }
  });

  for (const splide_elem of document.querySelectorAll(".preview.splide")) {
    const splide = new Splide(splide_elem as HTMLElement, {
      type: "loop",
    });
    splide.mount();

    const go_fullscreen = () => {
      document.body.style.overflow = "hidden";
      fullscreen_div.classList.add("shown");

      // Initialize after the splide is shown to make sure it initializes correctly
      if (!fullscreen_splide_init) {
        fullscreen_splide.mount();
        fullscreen_splide_init = true;
      }

      const i = parseInt(splide.root.dataset.startI!) + splide.index;
      fullscreen_splide.Components.Controller.setIndex(i);
      fullscreen_splide.Components.Move.jump(i);
    };

    splide.root
      .querySelector(".fullscreen")!
      .addEventListener("click", go_fullscreen);

    splide.root
      .querySelector(".splide__track")!
      .addEventListener("click", go_fullscreen);
  }
}
