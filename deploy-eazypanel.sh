#!/bin/bash

# Script para implantar o NMalls no EazyPanel

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Iniciando implantação do NMalls no EazyPanel...${NC}"

# Verificar se o Git está instalado
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git não está instalado. Por favor, instale o Git e tente novamente.${NC}"
    exit 1
fi

# Verificar se o EazyPanel CLI está instalado
if ! command -v eazy &> /dev/null; then
    echo -e "${RED}EazyPanel CLI não está instalado. Por favor, instale o EazyPanel CLI e tente novamente.${NC}"
    exit 1
fi

# Clonar o repositório
echo -e "${YELLOW}Clonando o repositório...${NC}"
git clone https://github.com/VtCasagrande/NmallsInterno.git nmalls
cd nmalls

# Criar arquivo .env
echo -e "${YELLOW}Criando arquivo .env...${NC}"
cp .env.example .env

# Editar o arquivo .env (opcional)
echo -e "${YELLOW}Deseja editar o arquivo .env? (s/n)${NC}"
read -r resposta
if [[ "$resposta" =~ ^[Ss]$ ]]; then
    if command -v nano &> /dev/null; then
        nano .env
    elif command -v vim &> /dev/null; then
        vim .env
    else
        echo -e "${RED}Nenhum editor de texto encontrado. Edite o arquivo .env manualmente.${NC}"
    fi
fi

# Criar aplicação no EazyPanel
echo -e "${YELLOW}Criando aplicação no EazyPanel...${NC}"
eazy app create --name nmalls --type nodejs

# Configurar variáveis de ambiente
echo -e "${YELLOW}Configurando variáveis de ambiente...${NC}"
while IFS= read -r line; do
    if [[ $line =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
        key=$(echo "$line" | cut -d= -f1)
        value=$(echo "$line" | cut -d= -f2-)
        eazy app env set --name nmalls --key "$key" --value "$value"
    fi
done < .env

# Implantar aplicação
echo -e "${YELLOW}Implantando aplicação...${NC}"
eazy app deploy --name nmalls --source .

echo -e "${GREEN}Implantação concluída com sucesso!${NC}"
echo -e "${GREEN}Acesse sua aplicação em: https://nmalls.seudominio.com.br${NC}" 