import { Markup } from "telegraf";

const COMMON = [
  ["Производ.", "Тренд"],
  ["Уровни", "Дополнительно"],
  ["KAPPA", "Баланс"],
];

const VIROBOTKA = [...COMMON, ["Выработка"]];

const TEST = [["Производ."]];

export default {
  COMMON: Markup.keyboard(COMMON).resize(),
  VIROBOTKA: Markup.keyboard(VIROBOTKA).resize(),
  INLINE_LEVEL_HELP: Markup.inlineKeyboard([
    Markup.button.callback("Справка", "level_help"),
  ]),
  TEST: Markup.keyboard(TEST).resize(),
};
