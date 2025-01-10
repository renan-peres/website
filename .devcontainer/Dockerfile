# Python base image from Docker Hub
FROM python:3.12.4

# Update package lists and install system dependencies
ENV DEBIAN_FRONTEND=noninteractive

# First install system packages
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
    sudo \
    unixodbc-dev \
    ca-certificates \
    curl \
    apt-transport-https \
    lsb-release \
    gnupg \
    zsh \
    git \
    fonts-powerline \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install NVM, Node.js and npm
ENV NVM_DIR=/root/.nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install --lts \
    && nvm use --lts \
    && npm install -g npm@latest 
    
# Install Rust and cargo
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y \
    && . $HOME/.cargo/env \
    && rustup toolchain install 1.83.0 \
    && rustup default 1.83.0 \
    && cargo install rust-script

# Set up workspace and install Python Packages
WORKDIR /workspace
COPY requirements.txt set_env_vars.py ./

# Upgrade pip and install dependencies
RUN pip install --upgrade pip \
    && pip install quarto-cli \
    && pip install duckdb --upgrade \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install python-dotenv ipykernel \
    && python -m ipykernel install --user --name=python3

# Install Oh My Zsh and Powerlevel10k theme
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended \
    && git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# Set up Powerlevel10k
RUN echo 'source ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k/powerlevel10k.zsh-theme' >> ~/.zshrc \
    && echo 'POWERLEVEL9K_DISABLE_CONFIGURATION_WIZARD=true' >> ~/.zshrc \
    && echo 'POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(dir vcs)' >> ~/.zshrc \
    && echo 'POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(status root_indicator background_jobs time)' >> ~/.zshrc

# Set default shell to zsh
SHELL ["/bin/zsh", "-c"]

CMD ["zsh"]