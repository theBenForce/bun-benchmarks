#!/usr/bin/env bash


stack_name=${STACK_NAME:-InfrastructureStack}
base_url=$(aws cloudformation describe-stacks --stack-name "$stack_name" --query 'Stacks[0].Outputs[?OutputKey==`ExportHttpApiUrl`].OutputValue' --output text)
base_url=${base_url%/}

echo "Testing $base_url"

k6 run --summary-export=results/node_summary.json -e TARGET_URL="$base_url/node" ./test/load.js
k6 run --summary-export=results/bun_summary.json -e TARGET_URL="$base_url/bun" ./test/load.js