# Version 1.1.0 (Thứ 7, 18/01/2025)
### [Version Demo](https://zalo.me/s/3044106383419412609/?env=TESTING&version=21)
### Thay đổi
1. Sửa giao diện Thông tin chi tiết của thành viên trong phả đồ.
  - Giao diện sliding panel.
  - Chia phần thông tin và nút bấm riêng. Hiện tại có 1 nút xem nhánh của thành viên được chọn. Tương lai sẽ có các nút CRUD.
  - Khi xem nhánh của thành viên, giờ sẽ zoom vào thành viên đó sau 0.5s.
2. Thêm Bảng hiện tên dòng họ trong phả đồ.

# Version 1.0.9
1. Thêm hệ thống phân quyền.
  - read/write/moderator/admin.
  - Chưa triển khai trên toàn hệ thống. 
2. Thay đổi nhỏ trong phả đồ
  - icon mới.
  - Thẻ thành viên đã gọn hơn, giảm chiều rộng của phả đồ.
3. Tính năng mới
  - Thanh tìm kiếm trohng phả đồ đã có thể tìm kiếm theo số đời.
4. Component mới
  - Popover.
5. Cập nhật giao diện Lịch tuần
  - Các thẻ sự kiện gọn hơn, hiển thị thông tin tối giản.
  - Khi select mở ra thông tin chi tiết.
  - Thông tin chi tiết được chia làm các mục dễ dàng quan sát.  
6. Link Test Zalo: https://zalo.me/s/3044106383419412609/?env=TESTING&version=20

# Version 1.0.8
1. Bổ sung hệ thống Thông báo theo hành động của người dùng: 
  - success, danger, warning, loading.
2. Nâng cấp giao diện Lịch tuần:
  - Bổ sung ngày âm lịch.
  - Bổ sung dấu chấm đỏ nếu ngày đó có sự kiện.
  - Bo tròn lịch.
- Nâng cấp giao diện lịch tháng:
  - Bo tròn lịch.
3. Sử dụng notification khi xuất SVG phả đồ.
4. Sử dụng notification khi cập nhật cài đặt người dùngg.
5. Link Test Zalo: https://zalo.me/s/3044106383419412609/?env=TESTING&version=17

# Version 1.0.8-beta
- Thay thế giao diện Sự kiện bằng Lịch dòng họ.
  - Lịch dòng họ có 2 phần là Sự kiện và Lịch Vạn Niên (sau này có thể dùng cho chức năng xem ngày tốt/xấu).
  - Chưa đổ dữ liệu.
  - Qua quá trình test, các tính năng tỏ ra rất tiềm năng. 

# Version 1.0.7
- Sửa các lỗi nhỏ trên toàn hệ thống:
  - Thay đổi màu sliding panel.
  - Xoá Album khỏi màn hình chính.
  - Sửa các lỗi gọi api ở Bảng Vàng.
- Link Test Zalo: https://zalo.me/s/3044106383419412609/?env=TESTING&version=15

# Version 1.0.6
- Nâng cấp giao diện Thư viện ảnh:
  - Thay đổi màu thanh Tab từ trắng sang màu primary.
  - Tab Ảnh và Album giờ có thể cuộn mượt mà hơn.
  - Sửa bug giao diện xem ảnh bị tràn ra khỏi màn hình (dài hơn chiều dài của điện thoại).
  - Sửa bug ấn vào album không popup lên ảnh trong album đó.
  - Sửa giao diện trong Tab Album: Mỗi album giờ sẽ là một thẻ. 2 thẻ xếp thành một hàng.
- Link Test Zalo: https://zalo.me/s/3044106383419412609/?env=TESTING&version=14

# Version 1.0.5
- Nâng cấp giao diện cho Quỹ Gia Tộc
  - Số dư, các khoản thu/chi được hiển thống kê trên cùng.
  - Theo sau phần thống kê là lịch sử giao dịch.
  - Chưa hoàn thiện logic.

- Khi load Phả đồ sẽ zoom vào Root Node.
