FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

RUN npm install 

RUN npx prisma generate 

COPY . .

RUN npm run build 

COPY await-db.sh /await-db.sh

RUN chmod +x /await-db.sh

EXPOSE 3333

CMD ["sh", "/await-db.sh"]
