import nguoi_co_cong from "assets/img/hall-of-fame/người-có-công.jpg";
import nguoi_hieu_hoc from "assets/img/hall-of-fame/người-hiếu-học.jpg";
import nguoi_thanh_dat from "assets/img/hall-of-fame/người-thành-công.jpg";
import nhan_vat_lich_su from "assets/img/hall-of-fame/nhân-vật-lịch-sử.jpg";
import tam_long_vang from "assets/img/hall-of-fame/tấm-lòng-vàng.jpg"

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

export {  
  loadHallOfFameThumnails
}