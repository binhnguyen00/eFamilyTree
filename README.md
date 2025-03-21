# Phần mềm Gia Phả Lạc Hồng
#### Phần mềm được phát triển trên 02 nền tảng
1. **[Zalo Mini App Gia phả Lạc Hồng](https://zalo.me/s/3044106383419412609/)**
2. **[Truy cập Website Gia Phả Lạc Hồng](https://giapha.mobifone5.vn/)**

# Công nghệ
- **[React](https://react.dev/)** + Typescript.
- **[Vite](https://vite.dev/)**
- **[Odoo 17](https://github.com/odoo/odoo/tree/17.0)**

# Trước khi Build và Run ⚠️
#### 1. Chuẩn bị môi trường ```.env```
  - APP_ID
  - SECRET_KEY
  - ZMP_TOKEN
  - Vì đây là các thông tin bảo mật của app nên vui lòng liên hệ **jackjack2000.kahp@gmail.com** để được hướng dẫn chi tiết
#### 2. Cài đặt ```pnpm```
  ```shell
  npm install -g pnpm
  ```

# Build và Run
  **mini-app.sh**
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

  Deploy application (Develop/Test):
    ./mini-app.sh deploy
  ```