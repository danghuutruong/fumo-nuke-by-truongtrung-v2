# fumo-nuke-by-truongtrung-v2
This source code includes a Discord bot written in JavaScript using the discord.js library. The bot is designed to help you quickly create channels.

### ENGLISH

## Introduction

### Description
This source code includes a Discord bot written in JavaScript and run through the `discord.js` library. This bot is designed to help you quickly create channels.

### Author
This bot was developed by **truongtrung**, a web developer with experience using WordPress and offering website design services.

### What's New?
- Added a new feature to create stickers for you!
- Auto nuke will spam all channels every 5 seconds. \\Having fixed big errors
- `unban_all` unblocks server members.
- Speed boost: it takes only 34 seconds to complete tasks when using the `!attack` command and the bot joins the channel.
- Auto nuke when the bot joins the channel, it will perform tasks.

## Command Usage
`!attack` command to perform tasks
`!auto_nuke` command to spam all channels
`!unban_all` unblocks all server members

### Requirements
- Node.js and Visual Studio Code (VSCode) installed on your computer.
- Download Node.js from https://nodejs.org/

### Installation and Configuration

1. **Initialize Node.js Project**:
    - Open the terminal in VSCode
    - And open the downloaded file

2. **Install `discord.js`**:
    - Use the commands `npm init -y` and `npm install`, along with `npm install discord.js` and `npm install discord.js image-size` to install the library.

3. **Run the Bot**:
    - Press the run button and select Node.js to start the bot.

### How to Edit

The `config.json` file will contain:
```json
{
    "token": "YOUR_BOT_TOKEN_HERE",
    "newServerName": "New Server Name"
}
```
- `token` stores your bot token
- `newServerName` is the new server name, e.g., "NUKE FUMO BY TRUONGTRUNG"

### How to Change Channel Names, Messages, and Roles

If you want to change these individually, here is an example to guide you:
In the `main.js` file, you will need to find the tags I added:

// Create new channels
// Send messages to the last created channel
// Create new roles
You can change them as you wish.

### Note:
- Add the bot to your Discord server to test it.

Good luck with your Discord bot project.

### TIẾNG VIỆT

## Giới thiệu

### Mô tả
Mã nguồn này bao gồm một bot Discord được viết bằng JavaScript và chạy thông qua thư viện `discord.js`. Bot này được để thực hiện trên giúp tạo kênh nhanh của bạn.

### Tác giả
Bot này được phát triển bởi **truongtrung**, một nhà phát triển web với kinh nghiệm sử dụng WordPres và cung cấp dịch vụ thiết kế website.

### có gì mới?
thêm tính năng mới là tạo sticker cho bạn!
tự động auto nuke nó sẽ spam 5 giây tất cả các kênh \\Having fixed big errors
unban_all bỏ chặn thành viên máy chủ
tăng tốc file chỉ mất 34 giây nó đã làm nhiệm vụ khi sử dụng lệnh attck và bot tham gia kênh
tự động nuke khi bot tham gia kênh nó sẽ làm nhiệm vụ

## Hướng dẫn sử dụng lệnh
`!attack` lệnh để làm nhiệm vụ
`!auto_nuke` lệnh spam tất cả các kênh
`!unban_all` bỏ chặn tất cả thành viên máy chủ

### Yêu cầu
- Node.js và Visual Studio Code (VSCode) đã được cài đặt trên máy tính của bạn.
- tải Node.js https://nodejs.org/

### Cài đặt và Cấu hình

1. **Khởi tạo dự án Node.js**:
    - Mở terminal trong VSCode
    - và mở file đã tải xuống
      
2. **Cài đặt `discord.js`**:
    - Sử dụng lệnh `npm init-y` và `npm install` cùng với `npm install discord.js` `npm install discord.js image-size` ` để cài đặt thư viện.
   

3. **Chạy bot**:
    - nhấn nút run và chọn Node.js để khởi động bot.
  
### Cách chỉnh sửa

file `config.json` sẽ có chứa là
`"token": "YOUR_BOT_TOKEN_HERE",`
`"newServerName": "New Server Name"`

token để lưu token của bạn
new Server Name là đổi tên máy chủ ví dụ "NUKE FUMO BY TRUONGTRUNG"

### cách thay đổi tên kênh, tin nhắn và vai trò

niếu bạn muốn đổi riêng mình và đây tôi ví dụ chỉ bạn.
trong file `main.js` bạn sẽ phải tìm mà tôi đã tag

// Tạo các kênh mới
// Gửi tin nhắn đến kênh cuối cùng đã tạo
// Tạo các vai trò mới
bạn chỉ cần đổi theo ý muốn là được

### Lưu ý:
- Thêm bot vào máy chủ Discord để kiểm tra.

Chúc bạn thành công với dự án bot Discord của mình.
