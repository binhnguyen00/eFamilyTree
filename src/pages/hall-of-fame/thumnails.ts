import nguoi_co_cong from "assets/img/hall-of-fame/người-có-công.jpg";
import nguoi_hieu_hoc from "assets/img/hall-of-fame/người-hiếu-học.jpg";
import nguoi_thanh_dat from "assets/img/hall-of-fame/người-thành-công.jpg";
import nhan_vat_lich_su from "assets/img/hall-of-fame/nhân-vật-lịch-sử.jpg";
import tam_long_vang from "assets/img/hall-of-fame/tấm-lòng-vàng.jpg"

// Define text position and styling for each category
const categoryStyles = {
  "nhân vật lịch sử": {
    textPosition: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    fontSize: "1.8rem",
    lineHeight: 1.2
  },
  "người thành đạt": {
    textPosition: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    fontSize: "1.8rem",
    lineHeight: 1.2
  },
  "người hiếu học": {
    textPosition: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    fontSize: "1.8rem",
    lineHeight: 1.2
  },
  "người có công": {
    textPosition: "center", 
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    fontSize: "1.8rem",
    lineHeight: 1.2
  },
  "tấm lòng vàng": {
    textPosition: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    fontSize: "1.8rem",
    lineHeight: 1.2
  },
};

const loadHallOfFameThumnails = (name: string) => {
  const imageMap = {
    "nhân vật lịch sử": nhan_vat_lich_su,
    "người thành đạt": nguoi_thanh_dat,
    "người hiếu học": nguoi_hieu_hoc,
    "người có công": nguoi_co_cong,
    "tấm lòng vàng": tam_long_vang,
  };

  return imageMap[name] || nhan_vat_lich_su;
}

const getHallOfFameTextStyle = (name: string) => {
  const defaultStyle = {
    textPosition: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    fontSize: "1.8rem",
    lineHeight: 1.2
  };
  
  return categoryStyles[name] || defaultStyle;
}

export {  
  loadHallOfFameThumnails,
  getHallOfFameTextStyle
}
