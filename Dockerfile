FROM ubuntu:jammy


RUN apt update && \
  apt install -y curl unzip hyperfine time bc

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash && \
  apt install -y nodejs


# Install Bun.sh
RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/root/.bun/bin:$PATH"

# Install pnpm
RUN npm i -g pnpm