### English

## Introduction

### Description
This source code includes a Discord bot written in JavaScript and operates through the `discord.js` library. This bot is designed to quickly create channels for you.

### Author
This bot is developed by **truongtrung**, a web developer with experience using WordPress and providing website design services.

### What's New?
- Added a new feature to create stickers for you!
- Auto nuke will spam all channels every 5 seconds.
- `unban_all` unbans all server members.
- Speed up file processing: tasks are completed in just 29 seconds when using the `attack` command and when the bot joins a channel.
- Auto nuke activates upon the bot joining a channel.
- Shuffle all channel positions and roles within the server in 1 minute.
- Added a `help` command for users to get familiar with.
- Added a new variable shuffleChannelsActive to track the state of the shuffle_channels command.
- Updated the shuffleChannels function to set shuffleChannelsActive to true when it starts and false when it finishes.
- Updated the performAttack function to check if autoNukeActive or shuffleChannelsActive are true before executing.
- Updated the auto_nuke command to check if shuffleChannelsActive is true before starting.
- Updated the shuffle_channels command to check if autoNukeActive or attackActive are true before executing.
- This should ensure that shuffle_channels and auto_nuke/attack commands do not interfere with each other.

## Command Usage
```!attack``` - Execute an attack on the server  
```!unban_all``` - Unban all users in the server  
```!auto_nuke on/off``` - Start or stop auto nuke  
```!shuffle_channels``` - Shuffle all channel positions within the server for 22 seconds
```!shuffle_roles``` - Shuffle all role positions within the server for 1 minute  
```!help``` - Display this help message  

### Requirements
- Node.js and Visual Studio Code (VSCode) installed on your computer.
- Download Node.js from https://nodejs.org/

### Installation and Configuration

1. **Initialize the Node.js Project**:
    - Open the terminal in VSCode
    - Open the downloaded file
    
2. **Install `discord.js`**:
    - Use the commands `npm init -y`, `npm install`, and `npm install discord.js image-size` to install the library.
   
3. **Run the Bot**:
    - Press the run button and select Node.js to start the bot.

### How to Edit

The `config.json` file contains:
```
"token": "YOUR_BOT_TOKEN_HERE",
"newServerName": "New Server Name"
```
- `token`: Store your bot token.
- `newServerName`: Change the server name, e.g., "NUKE FUMO BY TRUONGTRUNG".

### How to Change Channel Names, Messages, and Roles

If you want to customize these settings, here is an example to guide you:
In the `main.js` file, find the tagged sections:

```
// Create 40 channels and 10 roles
// Spam messages
```
You can modify these sections as desired.

### Note:
- Add the bot to your Discord server for testing.

Good luck with your Discord bot project!

### tiếng việt

## Giới thiệu

### Mô tả
Mã nguồn này bao gồm một bot Discord được viết bằng JavaScript và chạy thông qua thư viện `discord.js`. Bot này được để thực hiện trên giúp tạo kênh nhanh của bạn.

### Tác giả
Bot này được phát triển bởi **truongtrung**, một nhà phát triển web với kinh nghiệm sử dụng WordPres và cung cấp dịch vụ thiết kế website.

### có gì mới?
thêm tính năng mới là tạo sticker cho bạn!
tự động auto nuke nó sẽ spam 5 giây tất cả các kênh
unban_all bỏ chặn thành viên máy chủ
tăng tốc file chỉ mất 29 giây nó đã làm nhiệm vụ khi sử dụng lệnh attck và bot tham gia kênh
tự động nuke khi bot tham gia kênh nó sẽ làm nhiệm vụ
Xáo trộn tất cả các kênh vị trí trong máy chủ trong 1 phút và vai trò
thêm lệnh help cho người sử dụng làm quen
Đã thêm một biến mới shuffleChannelsActiveđể theo dõi trạng thái của shuffle_channelslệnh.
Đã cập nhật shuffleChannelshàm để đặt shuffleChannelsActivethành true khi bắt đầu và sai khi kết thúc.
Đã cập nhật performAttackhàm để kiểm tra xem có đúng autoNukeActivehay không shuffleChannelsActivetrước khi thực thi.
Đã cập nhật auto_nukelệnh để kiểm tra xem shuffleChannelsActivecó đúng không trước khi bắt đầu.
Đã cập nhật shuffle_channelslệnh để kiểm tra xem có đúng autoNukeActivehay không attackActivetrước khi thực thi.
Điều này cần đảm bảo rằng các lệnh shuffle_channelsvà auto_nuke/ attackkhông can thiệp lẫn nhau.

## Hướng dẫn sử dụng lệnh
```!attack``` - Thực hiện một cuộc tấn công vào máy chủ
```!unban_all``` - Unban tất cả người dùng trong máy chủ
```!auto_nuke on/off``` - bắt đầu hoặc dừng tự động nuke
```!shuffle_channels``` - xáo trộn tất cả các vị trí của các kênh trong máy chủ trong 22 giây
```!shuffle_roles``` - xáo trộn tất cả các vị trí của vai trò trong máy chủ trong 1 phút
```!help``` - Hiển thị thông báo trợ giúp này

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

// Tạo 40 kênh và 10 vai trò
// Spam tin nhắn
bạn chỉ cần đổi theo ý muốn là được

### Lưu ý:
- Thêm bot vào máy chủ Discord để kiểm tra.

Chúc bạn thành công với dự án bot Discord của mình.
