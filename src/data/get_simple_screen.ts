import Jimp from "jimp";
import path from "path";
import { IScreen } from "../types/types";
import puppeteer from "puppeteer";

export const getSimpleScreen = async (screen: IScreen): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-web-security",
        ],
        defaultViewport: { width: 1920, height: 1080 },
      });

      const page = await browser.newPage();

      await page.goto(
        `file:${path.join(
          __dirname,
          "../../screens/production_info_product/Product_info_product.htm"
        )}`,
        {
          waitUntil: "networkidle0",
        }
      );

      page
        .screenshot({
          encoding: "base64",
          type: "jpeg",
          quality: 100,
          fullPage: true,
        })
        .then((image) => {
          Jimp.read(Buffer.from(image.toString("base64"), "base64"))
            .then((image) => {
              image
                .crop(430, 0, 1080, 1080)
                .quality(100)
                .getBase64(Jimp.MIME_JPEG, (err, src) => {
                  if (err) {
                    reject(err);
                  } else {
                    const result = src.replace(/^data:image\/jpeg;base64,/, "");

                    resolve(result);
                  }
                });
            })
            .catch((err) => reject(err));
        })
        .finally(() => {
          browser.close();
        });
    } catch (err) {
      reject(err);
    }
  });
};
