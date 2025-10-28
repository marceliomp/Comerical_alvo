# Comerical_alvo

## Variáveis de ambiente

Configure o webhook do Bitrix24 em um arquivo `.env.local` (ou diretamente nas variáveis do Vercel) antes de iniciar o projeto:

```bash
BITRIX_WEBHOOK_URL="https://seu-dominio.bitrix24.com.br/rest/<user>/<token>/"
```

> O valor deve apontar para a raiz do webhook. A aplicação adiciona automaticamente o sufixo `crm.deal.list.json` e os campos necessários na requisição.