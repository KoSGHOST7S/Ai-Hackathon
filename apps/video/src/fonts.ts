import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadDMSerif } from "@remotion/google-fonts/DMSerifDisplay";

const { fontFamily: dmSansFamily } = loadDMSans("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const { fontFamily: dmSerifFamily } = loadDMSerif("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const FONT = {
  sans: dmSansFamily,
  serif: dmSerifFamily,
};
