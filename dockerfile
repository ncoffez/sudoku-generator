FROM oven/bun

ADD . .
RUN bun install
RUN bun run build

CMD bun .output/server/index.mjs
