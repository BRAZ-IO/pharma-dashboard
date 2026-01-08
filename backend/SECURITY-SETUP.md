# 🔐 Configuração de Segurança

## JWT Secret Forte

### ⚠️ Por que é importante?

Um JWT secret fraco permite que atacantes:
- Forjem tokens válidos
- Acessem qualquer conta do sistema
- Executem ações como qualquer usuário

### ✅ Como gerar um secret forte

#### Opção 1: Usar o script do projeto (Recomendado)

```bash
cd backend
npm run generate-secret
```

Isso irá gerar:
- `JWT_SECRET` (256 bits)
- `REFRESH_SECRET` (256 bits)
- `ENCRYPTION_KEY` (256 bits)

#### Opção 2: Usar Node.js diretamente

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Opção 3: Usar OpenSSL

```bash
openssl rand -hex 32
```

### 📝 Como configurar

1. **Gere os secrets:**
   ```bash
   npm run generate-secret
   ```

2. **Copie os valores gerados**

3. **Cole no arquivo `.env`:**
   ```env
   JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6
   REFRESH_SECRET=x9y8z7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r9s8t7u6v5w4x3y2z1a0b9c8
   ```

4. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

### 🔒 Requisitos de Segurança

#### Desenvolvimento
- ⚠️ Aviso se secret < 256 bits
- ✅ Servidor inicia normalmente

#### Produção
- ❌ Erro fatal se secret < 256 bits
- ❌ Erro fatal se usar valores padrão
- ✅ Servidor só inicia com secrets fortes

### 🚨 Valores Proibidos em Produção

Estes valores **NUNCA** devem ser usados:
- `your-secret-key`
- `your-refresh-secret`
- `pharma_dashboard_secret_key`
- `SUBSTITUA_POR_UM_SECRET_FORTE`
- Qualquer valor do `.env.example`

### 📊 Força do Secret

| Bits | Caracteres Hex | Segurança | Status |
|------|----------------|-----------|--------|
| 128  | 32             | ⚠️ Fraco  | Não recomendado |
| 192  | 48             | 🟡 Médio  | Mínimo aceitável |
| 256  | 64             | ✅ Forte  | **Recomendado** |
| 512  | 128            | 🔒 Muito Forte | Opcional |

### 🔄 Rotação de Secrets

Recomenda-se trocar os secrets periodicamente:

1. **A cada 90 dias** (recomendado)
2. **Imediatamente** se houver suspeita de vazamento
3. **Após** incidentes de segurança

#### Como rotacionar:

```bash
# 1. Gerar novos secrets
npm run generate-secret

# 2. Atualizar .env com novos valores

# 3. Reiniciar servidor
npm run dev

# 4. Todos os usuários precisarão fazer login novamente
```

### 🌍 Secrets por Ambiente

**NUNCA** use o mesmo secret em ambientes diferentes!

```
Desenvolvimento: secret_dev_abc123...
Homologação:     secret_hml_xyz789...
Produção:        secret_prd_qwe456...
```

### ✅ Checklist de Segurança

- [ ] Secrets gerados com `npm run generate-secret`
- [ ] Secrets têm 256 bits (64 caracteres hex)
- [ ] Secrets diferentes em cada ambiente
- [ ] `.env` está no `.gitignore`
- [ ] Secrets não estão no código-fonte
- [ ] Secrets não estão em logs
- [ ] Secrets não foram compartilhados
- [ ] Backup seguro dos secrets (cofre de senhas)

### 🆘 Em caso de vazamento

Se um secret vazar:

1. **Gere novos secrets imediatamente**
   ```bash
   npm run generate-secret
   ```

2. **Atualize o `.env`**

3. **Reinicie o servidor**

4. **Invalide todas as sessões ativas**

5. **Notifique os usuários**

6. **Investigue como ocorreu o vazamento**

### 📚 Referências

- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [RFC 8725 - JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)

---

**Última atualização:** 07/01/2026  
**Próxima revisão:** 07/04/2026
