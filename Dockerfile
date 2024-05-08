FROM public.ecr.aws/lambda/nodejs:20 as installer

COPY package.json ${LAMBDA_TASK_ROOT}
RUN npm install
COPY . ${LAMBDA_TASK_ROOT}
RUN npm run build

FROM public.ecr.aws/lambda/nodejs:20 as prod
COPY --from=installer ${LAMBDA_TASK_ROOT}/dist/ ${LAMBDA_TASK_ROOT}
CMD [ "index.handler" ]