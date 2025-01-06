#!/usr/bin/env bash

docker build -t bun-benchmark .

printf "\n"
printf ".: Running Benchmarks :."
docker run -it -v ./:/project bun-benchmark bash -c "cd /project && pnpm run benchmark"