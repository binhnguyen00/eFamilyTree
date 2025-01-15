# Version 1.0.9
1. Sự kiện trải dài nhiều ngày không hiện đủ dữ liệu [TOFIX]
  - Khi select ngày trên Calendar, trừ ngày bắt đầu, các ngày còn lại trong phần ngày trải dài đều không trả về dữ liệu.
  - Xử lý: Xem lại hàm get_events_by_date_range trong family_tree_calendar_service