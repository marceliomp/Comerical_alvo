# Comerical_alvo

## Configuração do Bitrix24

1. Crie um arquivo `.env.local` na raiz do projeto contendo a URL do webhook do Bitrix24 que lista os negócios. Você pode usar tanto o endpoint completo (`crm.deal.list.json`) quanto apenas a raiz do webhook que termina em `/rest/.../`.

```env
BITRIX_WEBHOOK_URL="https://seu_dominio.bitrix24.com.br/rest/1/SEU_TOKEN/"
```

2. O handler acrescentará automaticamente `crm.deal.list.json` (quando necessário) e incluirá todos os campos `select[]` exigidos pelo dashboard. Assim, basta informar a raiz do webhook fornecida pelo Bitrix, como por exemplo:

```
https://alvo.bitrix24.com.br/rest/1/8notqwwad2r87739/
```

3. No Vercel, defina a mesma variável em **Project Settings → Environment Variables** antes de fazer o deploy.

4. Para desenvolvimento local, crie o arquivo `.env.local` seguindo o exemplo acima ou partindo do `.env.example` incluso no repositório.

Se a variável estiver ausente ou inválida, o dashboard exibirá uma mensagem de erro apontando o problema para agilizar o diagnóstico.
