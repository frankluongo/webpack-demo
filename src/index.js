import _ from "lodash";

import "./style.css";
import testImage from "./image.jpg";

function component() {
  const element = document.createElement("div");
  element.innerHTML = _.join(["Hello", "webpack"], " ");
  element.classList.add("hello");

  const myImage = new Image();
  myImage.src = testImage;

  element.appendChild(myImage);

  return element;
}

document.body.appendChild(component());
