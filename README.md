# Comerical_alvo

## Configuração do Bitrix24

Crie um arquivo `.env.local` na raiz do projeto com a URL do webhook Bitrix24 responsável por listar os negócios. Você pode informar tanto o endpoint completo (`crm.deal.list.json`) quanto apenas a raiz do webhook que termina com `/rest/.../`.

```
BITRIX_WEBHOOK_URL="https://seu_dominio.bitrix24.com.br/rest/1/SEU_TOKEN/"
```

O handler acrescentará automaticamente `crm.deal.list.json` (quando necessário) e os campos `select[]` exigidos pelo dashboard.

Você também pode usar o arquivo `.env.example` como referência para os nomes das variáveis necessárias.