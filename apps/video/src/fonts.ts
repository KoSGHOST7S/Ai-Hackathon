import { loadFont as loadCormorant } from "@remotion/google-fonts/Cormorant";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";

const { fontFamily: cormorantFamily } = loadCormorant("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

loadCormorant("italic", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

const { fontFamily: outfitFamily } = loadOutfit("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const FONT = {
  serif: cormorantFamily,
  sans: outfitFamily,
};
