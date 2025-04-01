import React from "react";
import Handlebars from "handlebars";
import DOMPurify from "dompurify";

import TEMPLATE   from "assets/template/vu-lan.hbs?raw";
import TAM_BAO    from "assets/img/petition/ancestral-offering/tam-bao.png";
import BACKGROUND from "assets/img/petition/ancestral-offering/background.jpg"

import { VuLanForm } from "./UIForm";

interface UIVuLanTemplateProps {
  form: VuLanForm;
}

export function UIVuLanTemplate(props: UIVuLanTemplateProps) {
  const { form } = props;

  Handlebars.registerHelper('tamBao', function() {
    return (`<img id="letter-stamp" src="${TAM_BAO}">`)
  });

  const templateCompiler = Handlebars.compile(TEMPLATE);
  const placeHolder = {
    whoAmI: form.whoAmI,
    whereILive: form.whereILive,
    whatIWant: form.whatIWant,
    whereISubmit: form.whereISubmit
  }
  const raw = templateCompiler(placeHolder);
  const purified = DOMPurify.sanitize(raw);

  return (
    <div
      id="vu-lan-script"
      style={{ 
        backgroundImage: `url(${BACKGROUND})`,
        backgroundClip: "content-box",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: purified }}
        className="text-base"
      />
    </div>
  )
}