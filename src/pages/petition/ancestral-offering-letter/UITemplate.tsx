import React from "react";
import Handlebars from "handlebars";
import DOMPurify from "dompurify";

import { ScrollableDiv } from "components";
import type { PetitionLetterForm, PetitionLetterPerson } from "./UIForm";

import stamp from "assets/img/petition/ancestral-offering/tam-bao.png";
import background from "assets/img/petition/ancestral-offering/background.jpg"
import petitionLetter from "assets/template/petition-ancestral-offering.hbs?raw";

/** Sớ Lễ Gia Tiên */
interface UIAncestralOfferingTemplateProps {
  form: PetitionLetterForm;
}
export const UIAncestralOfferingTemplate = React.forwardRef<HTMLDivElement, UIAncestralOfferingTemplateProps>((props: UIAncestralOfferingTemplateProps, ref) =>  {
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

  Handlebars.registerHelper('letterStamp', function() {
    return (`<img id="letter-stamp" src="${stamp}">`)
  });

  const compiledTemplate = Handlebars.compile(petitionLetter);
  const templateData = {
    col0: "/ / Nhật Thần Khấu Thủ Hoà Nam Bách Bái Cụ Sớ",
    col1: "/ Khích Thiết Bình Doanh Chi Phí Cẩn Sơ",
    col2: "/ Vô Xâm Phạm Chi Ngu Bách Phúc Thiên Tường Thưởng Hưởng Thọ Khang Chi Khánh Nhất Thiết Sở Cầu Vạn Ban Như Ý Đàn Thần Hạ Tình Vô Nhậm",
    col3: "Đức Đại Khuông Phù Ân Hoàng Tế Độ Dáng Phúc Lưu Ân Trừ Tai Xá Quá Tỉ Thần Đẳng Gia Môn Hanh Thái Bản Mệnh Bình An Tam Tai Bát Nam",
    col4: "Hồng Từ / / / / / / Đồng Thuỳ / / / / / / Chiếu Giám / / / / / / / Phục Nguyện",
    col5: "/ Bản Điện Phụng Tự Nhất Thiết Uy Linh / / / / / / / / / / / / / / / / Vị Tiền Cung Vọng",
    col6: "Tam Toà Vương Mẫu Ngũ Vị Hoàng Thái Tử Vương Quan Khàm Sai Công Chúa / / / / / / / / / / Cung Quyết Hạ",
    col7: "Tam Giới Thiên Chúa Tứ Phủ Vạn Linh Công Đồng Đại Đế / / / / / / / / / / / / / Ngọc Bệ Hạ",
    col8: "Nam Mô Thập Phương Tam Bảo Chư Đại Bồ Tát / / / / / / / / / / / / / / / Kim Liên Toạ Hạ",
    col9: "/ Tứ Thiết Kim Ngàn Hương Hoa Lễ Vật Tịnh Cúng Phu Trần Cụ Hữu Sớ Văn Kiền Thân / / Thượng Tẩu / / Cung Duy",
    col10: "Phật Thánh Khuông Phù Chỉ Đức Tư Phùng Lệnh Tiết / Tiến Lễ Cờ An Giản Nhất Thiết Chi Tai Ương Cờ Vạn Ban Chi Cát Khánh Do Thị Kim Nguyệt",
    col11: "Ngọc Bệ Phủ Giám PHàm Tâm Ngôn Niệm Thần Đẳng Sinh Cư Dương Thể Số Hệ / / Thiên Cung Hạ Càn Khỏn Phủ Tái Chi Ân Cảm",
    col12: "/ Tín Chủ",
    col13_1: "Phật Thánh Cúng Dưỡng",
    col13_2: "Thiên Tiến Lễ",
    col13_3: "Giải Hạn Tống Ách Trừ Tai Cờ Gia Nội Bình An Nhân Khang Vật Thịnh Duyên Sinh Trường Thọ",
    col14: "/ / / / / / / / / Thượng Phụng",
    col15: "Việt Nam Quốc",
    col16: "Phật Tổ Quang Đại Hoàng Khai Độ Thế Chi Môn Đan Khốn Túc Thành Kính Tế Cơ Hư Chi Sự Minh Dương Quân Lợi U Hiền Hàm Mông Viên Hữu",
    col17: "/ / / / / / / / Phục Dĩ",

    // values
    liveAt: "Hải Phòng Thành, Kiến An Quận, Văn Đẩu Phường, Số 24",
    topDog: "Nguyễn Văn A Bản Mệnh Sinh Hư Giáp Thìn Hành Canh",
    familyMembers: "",
    yearCreate: "",
    monthCreate: "",
    dayCreate: "",
    workshipSeason: "Đông",
    workshipPlace: "Tại Gia"
  }

  const createPerson = (person?: PetitionLetterPerson) => {
    if (!person) return "";
    else {
      let content: string = "";
      if (person.name) content.concat(person.name);
      if (person.birth) content.concat(` Bản Mệnh Sinh Hư ${person.birth}`);
      if (person.age) content.concat(` Hành ${person.age}`);
      return content;
    }
  }

  const createFamilyMembers = (members?: PetitionLetterPerson[]) => {
    if (!members) return "";
    else return members.map((mem) => createPerson(mem)).join(",")
  }

  // update template value
  templateData.liveAt = form.topDog?.address || "";
  templateData.topDog = createPerson(form.topDog);
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
      id="petition-ancestral-offering-letter"
      ref={ref} 
      style={{ 
        // backgroundColor: `rgb(235, 207, 25)`,
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "75vh"
      }}
    >
      <ScrollableDiv 
        direction="both"
        height={"inherit"}
      >
        <div
          dangerouslySetInnerHTML={{ __html: purified }}
          className="text-base"
        />
      </ScrollableDiv>
    </div>
  );
});