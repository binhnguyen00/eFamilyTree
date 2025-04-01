import React from "react";
import Handlebars from "handlebars";
import DOMPurify from "dompurify";

import TEMPLATE   from "assets/template/gia-tien.hbs?raw";
import TAM_BAO    from "assets/img/petition/ancestral-offering/tam-bao.png";
import BACKGROUND from "assets/img/petition/ancestral-offering/background.jpg"

/** Sớ Lễ Gia Tiên */
interface UIGiaTienTemplateProps {
  form: any;
}
export function UIGiaTienTemplate(props: UIGiaTienTemplateProps) {
  let { form } = props;

  Handlebars.registerHelper('textVertical', function(text) {
    return text.split(' ').map(function(word) {
      if (word === "/") return `<br/>`;
      return `<p">${word}</p>`;
    }).join('');
  });

  Handlebars.registerHelper('skipRow', function(steps: number) {
    let skipRow: any[] = [];
    for (let step = 1; step <= steps; step++) {
      skipRow.push(`<br/>`)
    }
    return skipRow;
  });

  Handlebars.registerHelper('tamBao', function() {
    return (`<img id="letter-stamp" src="${TAM_BAO}">`)
  });

  const compiledTemplate = Handlebars.compile(TEMPLATE);
  const templateData = {
    col0: "/ / Nhật Thần Khấu Đảu Thượng Sớ",
    col1: "Tổ Đức Âm Phù Chi Lực Da",
    col2: "/ Ký Tư Tên Nhi Hữu Lợi Thuỷ Tác Loạn Ư Vô Cương Tông Tự Trưởng Lưu HƯơng Hoả Bất Dân Dận Thực Lại",
    col3: "Phủ Thuỷ Tuân Nội Giám Chuy / Âm Chi Chi Khốn Dĩ Diễn Dĩ Thừa Thi Phù Hựu Chi Âm Công Năng Bào Năng Trợ",
    col4: "Tiên Linh",
    col5: "/ / / / / / / / / / / / / / / / / / / / / / / Cung Vọng",
    col6: "Lịch Thế Mãnh Tố Tôn Lang / / / / / / / / / / / / / / / / / Vị Tiền",
    col7: "Lịch Thế Tổ Cô Tôn Lương / / / / / / / / / / / / / / / / / Vị Tiền",
    col8: "Gia Tiên / / Tộc Đường Thượng Lịch Đại Tổ Tiên Đẳng Đẳng Chư Vị Chân Linh / / / / / / Vị Tiền",
    col9: "/ Tu Thiết Hương Hoa Kim Ngân Lễ Vật Cụ Hữu Sớ Văn Phụng Thượng / / / / / / / / Cung Duy",
    col10: "/ Ngoại Nhân",
    col11: "Tiên Giám Phủ Tuất Thân Tinh Ngôn Niệm Càn Thuỷ Khôn Sinh Ngưỡng Hà Thai Phong Chi Âm Thiên Kinh Địa Nghĩa Thưởng Tổn Thốn",
    col12: "/ Tín Chủ",
    col13_1: "Tiên Tổ Cúng Dạng",
    col13_2: "Thiên Tiến Lễ",
    col13_3: "Gia Tiên Kỳ Âm Siêu Dương Khánh Quân Lợi Sự Kim Thần Hiếu Tử",
    col14: "/ / / / / / / / / Thượng Phụng",
    col15: "Việt Nam Quốc",
    col16: "Nhi Tự Viên Hữu",
    col17: "Tiên Tổ Thị Hoàng Bá Dẫn Chi Công Phất Thế Hậu Cổn Khắc Thiệu Dực Thừa Chi Niệm Bất Vong Viên Kỳ Sở Tôn Chuy Chi",
    col18: "/ / / / / / / / / Phục Dĩ",

    // values
    liveAt: "",
    topDog: "",
    familyMembers: "",
    yearCreate: "",
    monthCreate: "",
    dayCreate: "",
    workshipSeason: "",
    workshipPlace: ""
  }

  const createPerson = (person?: any) => {
    let content: string = "";
    if (!person) return "";
    else {
      if (person.name) content += person.name;
      if (person.birth) content += ` Bản Mệnh Sinh Hư ${person.birth}`;
      if (person.age) content += ` Hành ${person.age}`;
    }
    return content;
  }

  const createFamilyMembers = (members?: any[]) => {
    if (!members) return "";
    else return members.map((mem) => createPerson(mem)).join(",")
  }

  // update template value
  templateData.liveAt = form.houseOwner?.address || "";
  templateData.topDog = createPerson(form.houseOwner);
  templateData.familyMembers = createFamilyMembers(form.familyMembers);
  templateData.yearCreate = form.yearCreate || "";
  templateData.monthCreate = form.monthCreate || "";
  templateData.dayCreate = form.dayCreate || "";
  templateData.workshipSeason = form.workshipSeason || "";
  templateData.workshipPlace = form.workshipPlace || "";

  const filledTemplate = compiledTemplate(templateData);
  const purified = DOMPurify.sanitize(filledTemplate);
  return (
    <div 
      id="gia-tien-script"
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
  );
}