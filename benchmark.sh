#!/usr/bin/env bash

ITERATIONS="${BENCHMARK_ITERATIONS:-100}"
DESTINATION="${BENCHMARK_DESTINATION:-results.csv}"

RUNTIMES=(bun node)

if [[ -f "$DESTINATION" ]]; then
  rm $DESTINATION
fi

echo "Runtime,Memory (MB),Duration (ms)" > "$DESTINATION"

ref_memory=0
ref_duration=0

printf "\n"

for command in "$@"; do
  runtime=$(echo "$command" | cut -f 1 -d ' ')
  parameters=$(echo "$command" | cut -f 2- -d ' ')
  memory_sum=0
  duration_sum=0
  for i in $(seq 1 $ITERATIONS); do
    progress=$(echo "scale=2; ($i / $ITERATIONS) * 100" | bc)
    echo -ne "Benchmarking $runtime $parameters ($ITERATIONS iterations): $progress%\r"

    start_time=$(date +%s%N)  # start time in milliseconds
    memory=$(/usr/bin/time -f %M $runtime $parameters 2>&1 >/dev/null)
    end_time=$(date +%s%N)  # # end time in milliseconds
    # Calculate duration in nanoseconds
    duration_ns=$((end_time - start_time))

    # Convert duration to milliseconds
    duration_ms=$((duration_ns / 1000000))
    # Convert memory to MB
    memory=$(echo "$memory" | tail -1)
    memory=$(echo "scale=2; "$memory" / 1024" | bc)

    memory_sum=$(echo "scale=2; $memory_sum + $memory" | bc)
    duration_sum=$(echo "scale=2; $duration_sum + $duration_ms" | bc)
  done

  echo -ne '\n'

  memory_avg=$(echo "scale=2; $memory_sum / $ITERATIONS" | bc)
  duration_avg=$(echo "scale=2; $duration_sum / $ITERATIONS" | bc)

  if [ "$ref_memory" == "0" ]; then
    ref_memory=$memory_avg
  fi

  if [ "$ref_duration" == "0" ]; then
    ref_duration=$duration_avg
  fi

  memory_multiplier=$(echo "scale=2; $memory_avg / $ref_memory" | bc)
  duration_multiplier=$(echo "scale=2; $duration_avg / $ref_duration" | bc)

  printf "Memory: $memory_avg MB ($memory_multiplier x)\n"
  printf "Duration: $duration_avg ms ($duration_multiplier x)\n"

  echo "$runtime,$memory_avg,$duration_avg" >> "$DESTINATION"
done