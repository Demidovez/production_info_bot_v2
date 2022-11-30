import { EPageType, IScreen } from "../types/types";

interface IProp {
  [key: string]: IScreen;
}

const SCREENS: IProp = {
  PRODUCTION: { link: "Product_info_product.htm", type: EPageType.photo },
  TREND: { link: "Product_info_trend.htm", type: EPageType.photo },
  ADDITIONAL: { link: "Product_info_2.htm", type: EPageType.photo },
  KAPPA: { link: "Product_kappa.htm", type: EPageType.photo },
  OUTPUT: { link: "Product_8BDEH.htm", type: EPageType.photo },
  LEVELS: { link: "Product_level.htm", type: EPageType.photo },
  BALANCE: { link: "2A_34_GUZ.htm", type: EPageType.file },
};

export default SCREENS;
