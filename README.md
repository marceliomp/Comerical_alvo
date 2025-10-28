# Comerical_alvo

## Configuração do Bitrix24

Crie um arquivo `.env.local` na raiz do projeto com a URL completa do webhook Bitrix24 responsável por listar os negócios:

```
BITRIX_WEBHOOK_URL="https://seu_dominio.bitrix24.com.br/rest/1/SEU_TOKEN/crm.deal.list.json"
```

Você também pode usar o arquivo `.env.example` como referência para os nomes das variáveis necessárias.