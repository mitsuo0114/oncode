FROM node:11.6.0-alpine
ADD . .
RUN npm install --no-audit package-lock.json

EXPOSE 3000
CMD ["npm", "start"]
