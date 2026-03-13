// In class practice using clay.text
// This is a simple keyboard

import { texts } from "../util/texts.js";

let my_text = "A";

export const init = async model => {
   model.animate(() => {
      let myText = clay.text(my_text);//texts[4]);
      while (model.nChildren())
         model.remove(0);

      // keboard top row
      model.add('square').move(.0065,1.4905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("Q")).move(0,1.5 ,0).color(1,1,1).scale(1);

      model.add('square').move(.0565,1.4905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("W")).move(.05,1.5 ,0).color(1,1,1).scale(1);

      model.add('square').move(.1065,1.4905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("E")).move(.10,1.5 ,0).color(1,1,1).scale(1);

      model.add('square').move(.1565,1.4905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("R")).move(.15,1.5 ,0).color(1,1,1).scale(1);

      model.add('square').move(.2065,1.4905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("T")).move(.20,1.5 ,0).color(1,1,1).scale(1);

      model.add('square').move(.2565,1.4905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("Y")).move(.25,1.5 ,0).color(1,1,1).scale(1);

      model.add('square').move(.3065,1.4905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("U")).move(.30,1.5 ,0).color(1,1,1).scale(1);

      model.add('square').move(.3565,1.4905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("I")).move(.35,1.5 ,0).color(1,1,1).scale(1);

      model.add('square').move(.4065,1.4905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("O")).move(.40,1.5 ,0).color(1,1,1).scale(1);

      model.add('square').move(.4565,1.4905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("P")).move(.45,1.5 ,0).color(1,1,1).scale(1);

      // keyboard middle row
      model.add('square').move(.0265,1.4405,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("A")).move(.02,1.45 ,0).color(1,1,1).scale(1);

      model.add('square').move(.0765,1.4405,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("S")).move(.07,1.45 ,0).color(1,1,1).scale(1);

      model.add('square').move(.1265,1.4405,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("D")).move(.12,1.45 ,0).color(1,1,1).scale(1);

      model.add('square').move(.1765,1.4405,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("F")).move(.17,1.45 ,0).color(1,1,1).scale(1);

      model.add('square').move(.2265,1.4405,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("G")).move(.22,1.45 ,0).color(1,1,1).scale(1);

      model.add('square').move(.2765,1.4405,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("H")).move(.27,1.45 ,0).color(1,1,1).scale(1);

      model.add('square').move(.3265,1.4405,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("J")).move(.32,1.45 ,0).color(1,1,1).scale(1);

      model.add('square').move(.3765,1.4405,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("K")).move(.37,1.45 ,0).color(1,1,1).scale(1);

      model.add('square').move(.4265,1.4405,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("L")).move(.42,1.45 ,0).color(1,1,1).scale(1);

      model.add('square').move(.4765,1.4405,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text(";")).move(.47,1.45 ,0).color(1,1,1).scale(1);

      model.add('square').move(.5265,1.4405,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("'")).move(.52,1.45 ,0).color(1,1,1).scale(1);

      // keyboard bottom row
      model.add('square').move(.0465,1.3905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("Z")).move(.04,1.40 ,0).color(1,1,1).scale(1);

      model.add('square').move(.0965,1.3905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("X")).move(.09,1.40 ,0).color(1,1,1).scale(1);

      model.add('square').move(.1465,1.3905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("C")).move(.14,1.40 ,0).color(1,1,1).scale(1);

      model.add('square').move(.1965,1.3905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("V")).move(.19,1.40 ,0).color(1,1,1).scale(1);

      model.add('square').move(.2465,1.3905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("B")).move(.24,1.40 ,0).color(1,1,1).scale(1);

      model.add('square').move(.2965,1.3905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("N")).move(.29,1.40 ,0).color(1,1,1).scale(1);

      model.add('square').move(.3465,1.3905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("M")).move(.34,1.40 ,0).color(1,1,1).scale(1);

      model.add('square').move(.3965,1.3905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text(",")).move(.39,1.40 ,0).color(1,1,1).scale(1);

      model.add('square').move(.4465,1.3905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text(".")).move(.44,1.40 ,0).color(1,1,1).scale(1);

      model.add('square').move(.4965,1.3905,0).scale(.02).color(0,0,0).opacity(.8);
      model.add(clay.text("/")).move(.49,1.40 ,0).color(1,1,1).scale(1);

      // keyboard space bar
      model.add('square').move(.065,1.3405,0).scale(.08,.02,.02).color(0,0,0).opacity(.8);
      //model.add(clay.text(" ")).move(.04,1.35 ,0).color(1,1,1).scale(1);
   });
}



