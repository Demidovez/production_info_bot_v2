import { Telegraf, Scenes } from "telegraf";
import LocalSession from "telegraf-session-local";
import { getSimpleScreen } from "./data/get_simple_screen";
import {
  getLevelHelp,
  getMarkup,
  replyError,
  replyUnaccess,
  replyWithPhoto,
  replyWithPhotoFile,
  sendDataWithInterval,
} from "./utils/utils";
import { getFullScreen } from "./data/get_full_screen";
import { ROLES, UserContext } from "./types/types";
import { getUser } from "./data/get_user";
import MARKUPS from "./markups/markups";
import { sendRequestToLog } from "./data/send_request_to_log";
import { generatePages } from "./data/generate_pages";
import SCREENS from "./screens/screens";

const main = async () => {
  // Инициализируем бота
  const bot = new Telegraf<UserContext>(process.env.BOT_TOKEN as string);
  const localSession = new LocalSession({
    database: process.env.SESSION_DB as string,
  });

  bot.use(localSession.middleware());

  // Создаем сцены
  const stage = new Scenes.Stage<UserContext>([]);

  // Подключаем сцены к боту
  bot.use(stage.middleware());

  // Определяем роли доступа пользователя
  bot.use((ctx, next) => {
    // Запись в логи
    sendRequestToLog(ctx);

    getUser(ctx.from!.id)
      .then((user) => {
        if (user) {
          ctx.session.roles = user.roles;
          next();
        } else {
          ctx.reply("У Вас нет доступа!");
        }
      })
      .catch((err) => {
        console.log(err);
        ctx.reply("Ошибка доступа!");
      });
  });

  bot.start((ctx) => {
    ctx.reply("Выберите пункт меню!", getMarkup(ctx.session.roles));
  });

  // Добавление нового пользователя
  bot.action(/addUser \|(.+)\| \|(.+)\| \|(.+)\|/, async (ctx) => {
    try {
      const id = ctx.match[1];
      const username = ctx.match[2];
      const fio = ctx.match[3];

      const lineToFile = `${id}|${username}|${fio}\n`;

      ctx.reply(lineToFile);
    } catch (err) {
      console.log(err);
    }
  });

  // Запуск рассылки экранов с периодичностью
  // sendDataInterval(bot, 1);
  // sendDataInterval(bot, 4, 10);

  // const pages = await generatePages();

  // Реакция на запрос экрана производительности
  bot.hears(/Производ./i, (ctx) => {
    try {
      ctx.replyWithChatAction("upload_photo");

      if (ctx.session.roles?.includes(ROLES.common)) {
        getSimpleScreen(SCREENS.PRODUCTION)
          .then((image64) =>
            replyWithPhoto(ctx, image64, getMarkup(ctx.session.roles))
          )
          .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
      } else {
        replyUnaccess(ctx, getMarkup(ctx.session.roles));
      }
    } catch (err) {
      console.log(err);
    }
  });

  // Реакция на запрос экрана с трендом
  // bot.hears(/Тренд/i, (ctx) => {
  //   try {
  //     ctx.replyWithChatAction("upload_photo");

  //     if (ctx.session.roles?.includes(ROLES.common)) {
  //       getSimpleScreen(pages["TREND"].page)
  //         .then((image64) =>
  //           replyWithPhoto(ctx, image64, getMarkup(ctx.session.roles))
  //         )
  //         .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  //     } else {
  //       replyUnaccess(ctx, getMarkup(ctx.session.roles));
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });

  // Реакция на запрос экрана с уровнями баков
  // bot.hears(/Уровни/i, (ctx) => {
  //   try {
  //     ctx.replyWithChatAction("upload_photo");

  //     if (ctx.session.roles?.includes(ROLES.common)) {
  //       getSimpleScreen(pages["LEVELS"].page)
  //         .then((image64) =>
  //           replyWithPhoto(ctx, image64, MARKUPS.INLINE_LEVEL_HELP)
  //         )
  //         .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  //     } else {
  //       replyUnaccess(ctx, getMarkup(ctx.session.roles));
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });

  // Реакция на запрос экрана с дополнительной информацией
  // bot.hears(/Дополнительно/i, (ctx) => {
  //   try {
  //     ctx.replyWithChatAction("upload_photo");

  //     if (ctx.session.roles?.includes(ROLES.common)) {
  //       getSimpleScreen(pages["ADDITIONAL"].page)
  //         .then((image64) =>
  //           replyWithPhoto(ctx, image64, getMarkup(ctx.session.roles))
  //         )
  //         .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  //     } else {
  //       replyUnaccess(ctx, getMarkup(ctx.session.roles));
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });

  // Реакция на запрос экрана данных по KAPPA
  // bot.hears(/KAPPA/i, (ctx) => {
  //   try {
  //     ctx.replyWithChatAction("upload_photo");

  //     if (ctx.session.roles?.includes(ROLES.common)) {
  //       getSimpleScreen(pages["KAPPA"].page)
  //         .then((image64) =>
  //           replyWithPhoto(ctx, image64, getMarkup(ctx.session.roles))
  //         )
  //         .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  //     } else {
  //       replyUnaccess(ctx, getMarkup(ctx.session.roles));
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });

  // Реакция на запрос экрана по балансу на варке
  // bot.hears(/Баланс/i, (ctx) => {
  //   try {
  //     ctx.replyWithChatAction("upload_photo");

  //     if (ctx.session.roles?.includes(ROLES.common)) {
  //       getFullScreen(pages["BALANCE"].page)
  //         .then((image64) =>
  //           replyWithPhotoFile(
  //             ctx,
  //             image64,
  //             "Баланс",
  //             getMarkup(ctx.session.roles)
  //           )
  //         )
  //         .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  //     } else {
  //       replyUnaccess(ctx, getMarkup(ctx.session.roles));
  //     }

  //     // ctx.reply("Данных пока нет", getMarkup(ctx.session.roles));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });

  // Реакция на запрос экрана выработки
  // bot.hears(/Выработка/i, (ctx) => {
  //   try {
  //     ctx.replyWithChatAction("upload_photo");

  //     if (ctx.session.roles?.includes(ROLES.virabotka)) {
  //       getSimpleScreen(pages["OUTPUT"].page)
  //         .then((image64) =>
  //           replyWithPhoto(ctx, image64, getMarkup(ctx.session.roles))
  //         )
  //         .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  //     } else {
  //       replyUnaccess(ctx, getMarkup(ctx.session.roles));
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });

  // Ответ на запрос справки для обозначений на экране Уровни
  // bot.action(/level_help/i, (ctx) => {
  //   try {
  //     if (ctx.session.roles?.includes(ROLES.common)) {
  //       ctx.reply(getLevelHelp(), getMarkup(ctx.session.roles));
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });

  // Проверка пользователем на работоспособность
  bot.on("text", (ctx) => {
    ctx.reply("Неизвестная команда", getMarkup(ctx.session.roles));
  });

  // setTimeout(() => {
  //   sendDataWithInterval(bot, [
  //     {
  //       page: pages["PRODUCTION"].page,
  //       users_id: [924044537, 321438949],
  //     },
  //     {
  //       page: pages["LEVELS"].page,
  //       users_id: [924044537, 321438949],
  //     },
  //   ]);
  // }, 5000);

  bot.launch();
  console.log(`Started ${process.env.BOT_NAME} :: ${new Date()}`);
};

main();
