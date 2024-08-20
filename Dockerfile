FROM node AS base

# development stage
FROM base AS development 
ARG APP 
ARG NODE_ENV=development 
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app 
COPY package.json package-lock.json ./ 
RUN npm install
COPY . . 
RUN npm run build ${APP} 

# Add an env to save ARG
ENV APP_MAIN_FILE=dist/apps/${APP}/main 
EXPOSE 3000
CMD node ${APP_MAIN_FILE}