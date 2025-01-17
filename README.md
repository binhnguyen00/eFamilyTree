# Phần mềm Gia Phả Lạc Hồng

## Phần mềm được phát triển trên 02 nền tảng
### 1. Zalo Mini App
  - Cài đặt trên ứng dụng Zalo của VNG.
### 2. Website
  - Truy cập: [Gia Phả Lạc Hồng](https://giapha.mobifone5.vn/)

# Công nghệ
- React + Typescript.
- Vite.

# Các yêu cầu trước khi Build và Run
- APP_ID
- SECRET_KEY
- ZMP_TOKEN
- Vì đây là các thông tin bảo mật của app nên vui lòng liên hệ ```jackjack2000.kahp@gmail.com``` để được hướng dẫn chi tiết

# Build và Run
- Sử dụng mini-app.sh
```
  Login to Zalo:
    ./mini-app.sh login

  Install dependencies:
    ./mini-app.sh install [-clean]
      -clean: Remove node_modules, dist, pnpm-lock.yaml

  Build application: 
    ./mini-app.sh build [-clean]
      -clean: Remove node_modules, dist, pnpm-lock.yaml. Reinstall dependencies.

  Run application:
    ./mini-app.sh run
```