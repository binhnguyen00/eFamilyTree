import React from "react";
import Handlebars from "handlebars";
import DOMPurify from "dompurify";

import TEMPLATE   from "assets/template/vu-lan.hbs?raw";
import TAM_BAO    from "assets/img/petition/ancestral-offering/tam-bao.png";
import BACKGROUND from "assets/img/petition/ancestral-offering/background.jpg"

interface UIVuLanTemplateProps {
  form: any;
}

export function UIVuLanTemplate(props: UIVuLanTemplateProps) {
  const {  } = props;

  Handlebars.registerHelper('tamBao', function() {
    return (`<img id="letter-stamp" src="${TAM_BAO}">`)
  });

  const compiledTemplate = Handlebars.compile(TEMPLATE);
  const placeHolder = {

  }
  const raw = compiledTemplate(placeHolder);
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