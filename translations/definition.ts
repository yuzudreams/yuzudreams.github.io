export function translation(t: Translation): Translation {
  return t;
}

export type Translation = {
  language: string;
  title: string;

  series: string;
  about: string;

  by: string;
  coming_soon: string;

  asuka_and_misaki: {
    name: string;
    released: string;
  };
  ame_nochi_yuki: {
    name: string;
    available: string;
  };
  blooddiary0: string;
  devils_lover_1: string;
  devils_lover_2: string;
  lonely_lose: string;
  the_secret_sleepover: string;
  wanting_more: string;

  anjinneko: string;
  shirainu: string;
  yaya: string;
};
