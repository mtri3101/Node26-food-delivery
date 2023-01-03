# Build image dựa trên image của node 
FROM node:18-alpine

# Tạo 1 working directory bên trong image để chứa code của ứng dụng
WORKDIR /app 

# Copy toàn bộ code của ứng dụng vào bên trong working directory 
COPY . .

# Thực thi 1 câu lệnh bên trong working directory 
RUN npm install

# Cho phép quyền thực thi 
RUN chmod +x wait-for

# define port mà image sẽ listen
EXPOSE 4000

# lệnh thực thi ứng dụng
CMD [ "node", "src/index.js" ]
