#u24581705 PC number 26

FROM node:22
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]

