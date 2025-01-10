# Python base image from Docker Hub
FROM python:3.13.0

# Update package lists and install system dependencies
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
    sh -c "$(curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh)" "" \
    nvm install --lts \
    nvm use --lts \
    npm install -g npm@latest \
    sudo \
    r-base-core \
    r-base \
    r-base-dev \
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