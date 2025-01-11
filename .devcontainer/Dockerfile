FROM python:3.12.4-slim as builder

# Environment variables
ENV DEBIAN_FRONTEND=noninteractive \
    NVM_DIR=/root/.nvm \
    NODE_VERSION=lts/* \
    RUST_VERSION=1.83.0 \
    QUARTO_VERSION=1.6.40 \
    DUCKDB_VERSION=1.1.3 \
    PATH="/root/.cargo/bin:/root/.local/bin:${PATH}"

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    sudo unixodbc-dev ca-certificates curl apt-transport-https \
    lsb-release gnupg zsh git fonts-powerline \
    software-properties-common dirmngr wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install R
RUN wget -qO- https://cloud.r-project.org/bin/linux/ubuntu/marutter_pubkey.asc | tee -a /etc/apt/trusted.gpg.d/cran_ubuntu_key.asc \
    && add-apt-repository "deb https://cloud.r-project.org/bin/linux/ubuntu $(lsb_release -cs)-cran40/" \
    && apt-get update && apt-get install -y --no-install-recommends \
    r-base r-base-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use --lts \
    && npm install -g npm@latest 

# Install Rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y \
    && . $HOME/.cargo/env \
    && rustup toolchain install $RUST_VERSION \
    && rustup default $RUST_VERSION \
    && cargo install rust-script

# Install DuckDB
RUN curl --fail --location --progress-bar --output duckdb.zip \
    https://github.com/duckdb/duckdb/releases/download/v${DUCKDB_VERSION}/duckdb_cli-linux-amd64.zip \
    && unzip duckdb.zip \
    && chmod +x duckdb \
    && mv duckdb /usr/local/bin/ \
    && rm duckdb.zip

# Install Quarto
RUN mkdir -p ~/.local/bin ~/opt \
    && wget https://github.com/quarto-dev/quarto-cli/releases/download/v${QUARTO_VERSION}/quarto-${QUARTO_VERSION}-linux-amd64.tar.gz \
    && tar -C ~/opt -xvzf quarto-${QUARTO_VERSION}-linux-amd64.tar.gz \
    && ln -s ~/opt/quarto-${QUARTO_VERSION}/bin/quarto ~/.local/bin/quarto \
    && rm quarto-${QUARTO_VERSION}-linux-amd64.tar.gz

# Set up workspace and install Python Packages
WORKDIR /workspace
COPY requirements.txt set_env_vars.py ./
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install python-dotenv ipykernel \
    && python -m ipykernel install --user --name=python3

# Setup ZSH with Oh My Zsh and Powerlevel10k
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended \
    && git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k \
    && echo 'source ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k/powerlevel10k.zsh-theme' >> ~/.zshrc \
    && echo 'POWERLEVEL9K_DISABLE_CONFIGURATION_WIZARD=true' >> ~/.zshrc \
    && echo 'POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(dir vcs)' >> ~/.zshrc \
    && echo 'POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(status root_indicator background_jobs time)' >> ~/.zshrc

# Set shell and entry point
SHELL ["/bin/zsh", "-c"]
CMD ["zsh"]