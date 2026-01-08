# 🔐 Autenticação de Dois Fatores (2FA)

## 📋 Índice

- [O que é 2FA](#o-que-é-2fa)
- [Como Funciona](#como-funciona)
- [Configuração](#configuração)
- [Uso no Login](#uso-no-login)
- [Códigos de Backup](#códigos-de-backup)
- [Desativar 2FA](#desativar-2fa)
- [Apps Recomendados](#apps-recomendados)

---

## 🎯 O que é 2FA?

Autenticação de Dois Fatores (2FA) adiciona uma camada extra de segurança ao exigir:

1. **Algo que você sabe** - Sua senha
2. **Algo que você tem** - Seu celular com app autenticador

Mesmo que alguém descubra sua senha, não conseguirá acessar sem o código do seu celular.

---

## 🔄 Como Funciona

```
┌─────────────────────────────────────────────────────┐
│  1. Login com Email + Senha                         │
│     ↓                                                │
│  2. Sistema verifica se 2FA está ativado            │
│     ↓                                                │
│  3. Solicita código do app autenticador             │
│     ↓                                                │
│  4. Usuário digita código de 6 dígitos              │
│     ↓                                                │
│  5. Sistema valida código                           │
│     ↓                                                │
│  6. Acesso liberado ✅                               │
└─────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuração

### Passo 1: Verificar Status

```bash
GET /api/2fa/status
Authorization: Bearer {seu_token}
```

**Resposta:**
```json
{
  "enabled": false,
  "backupCodesRemaining": 0
}
```

---

### Passo 2: Iniciar Setup

```bash
POST /api/2fa/setup
Authorization: Bearer {seu_token}
```

**Resposta:**
```json
{
  "message": "2FA configurado. Escaneie o QR Code no seu app autenticador",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "secret": "JBSWY3DPEHPK3PXP",
  "manualEntry": {
    "account": "usuario@pharma.com",
    "key": "JBSWY3DPEHPK3PXP",
    "issuer": "Pharma Dashboard"
  }
}
```

---

### Passo 3: Escanear QR Code

1. Abra seu app autenticador (Google Authenticator, Authy, etc.)
2. Escaneie o QR Code fornecido
3. O app começará a gerar códigos de 6 dígitos

**Ou configure manualmente:**
- Conta: `usuario@pharma.com`
- Chave: `JBSWY3DPEHPK3PXP`
- Tipo: Baseado em tempo (TOTP)

---

### Passo 4: Verificar e Ativar

```bash
POST /api/2fa/verify
Authorization: Bearer {seu_token}
Content-Type: application/json

{
  "token": "123456"
}
```

**Resposta:**
```json
{
  "message": "2FA ativado com sucesso!",
  "backupCodes": [
    "A1B2C3D4",
    "E5F6G7H8",
    "I9J0K1L2",
    "M3N4O5P6",
    "Q7R8S9T0",
    "U1V2W3X4",
    "Y5Z6A7B8",
    "C9D0E1F2",
    "G3H4I5J6",
    "K7L8M9N0"
  ],
  "warning": "Guarde estes códigos de backup em local seguro. Eles não serão mostrados novamente."
}
```

⚠️ **IMPORTANTE:** Salve os códigos de backup! Você precisará deles se perder acesso ao app autenticador.

---

## 🔑 Uso no Login

### Fluxo de Login com 2FA

#### 1. Login Inicial

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@pharma.com",
  "senha": "123456"
}
```

**Resposta (2FA ativado):**
```json
{
  "requires2FA": true,
  "userId": "uuid-do-usuario",
  "message": "Digite o código do seu autenticador"
}
```

---

#### 2. Validar Código 2FA

```bash
POST /api/2fa/validate
Content-Type: application/json

{
  "userId": "uuid-do-usuario",
  "token": "123456",
  "isBackupCode": false
}
```

**Resposta:**
```json
{
  "message": "Código válido",
  "valid": true
}
```

---

#### 3. Completar Login

Após validação, o frontend deve fazer o login novamente ou o backend deve retornar o token JWT.

---

## 🆘 Códigos de Backup

### Quando Usar

Use códigos de backup quando:
- Perdeu seu celular
- App autenticador não funciona
- Trocou de celular e não transferiu o 2FA

### Como Usar

```bash
POST /api/2fa/validate
Content-Type: application/json

{
  "userId": "uuid-do-usuario",
  "token": "A1B2C3D4",
  "isBackupCode": true
}
```

⚠️ **Cada código só pode ser usado uma vez!**

---

### Gerar Novos Códigos

```bash
POST /api/2fa/backup-codes
Authorization: Bearer {seu_token}
Content-Type: application/json

{
  "senha": "sua_senha",
  "token": "123456"
}
```

**Resposta:**
```json
{
  "message": "Novos códigos de backup gerados",
  "backupCodes": [
    "X1Y2Z3A4",
    "B5C6D7E8",
    ...
  ],
  "warning": "Os códigos antigos foram invalidados."
}
```

---

## ❌ Desativar 2FA

```bash
POST /api/2fa/disable
Authorization: Bearer {seu_token}
Content-Type: application/json

{
  "senha": "sua_senha",
  "token": "123456"
}
```

**Resposta:**
```json
{
  "message": "2FA desativado com sucesso"
}
```

---

## 📱 Apps Autenticadores Recomendados

### Google Authenticator
- **iOS:** [App Store](https://apps.apple.com/app/google-authenticator/id388497605)
- **Android:** [Play Store](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)
- ✅ Simples e confiável
- ❌ Sem backup na nuvem

### Microsoft Authenticator
- **iOS:** [App Store](https://apps.apple.com/app/microsoft-authenticator/id983156458)
- **Android:** [Play Store](https://play.google.com/store/apps/details?id=com.azure.authenticator)
- ✅ Backup na nuvem
- ✅ Suporta múltiplos dispositivos

### Authy
- **iOS:** [App Store](https://apps.apple.com/app/authy/id494168017)
- **Android:** [Play Store](https://play.google.com/store/apps/details?id=com.authy.authy)
- ✅ Backup na nuvem
- ✅ Suporta múltiplos dispositivos
- ✅ Desktop app disponível

### 1Password / Bitwarden
- Gerenciadores de senha com suporte a TOTP
- ✅ Tudo em um só lugar
- ✅ Backup automático

---

## 🔒 Segurança

### Boas Práticas

1. **Guarde códigos de backup em local seguro**
   - Cofre de senhas
   - Papel em local físico seguro
   - **NUNCA** em arquivo de texto no computador

2. **Use app autenticador confiável**
   - Prefira apps com backup na nuvem
   - Configure em múltiplos dispositivos

3. **Não compartilhe códigos**
   - Códigos 2FA são pessoais
   - Nunca envie por email/WhatsApp

4. **Ative 2FA em contas importantes**
   - Administradores devem usar 2FA
   - Gerentes recomendado usar 2FA

---

## 🧪 Testando 2FA

### Fluxo Completo de Teste

```bash
# 1. Login e obter token
POST /api/auth/login
{ "email": "admin@pharma.com", "senha": "123456" }

# 2. Verificar status (deve estar desativado)
GET /api/2fa/status
Authorization: Bearer {token}

# 3. Iniciar setup
POST /api/2fa/setup
Authorization: Bearer {token}

# 4. Escanear QR Code no app

# 5. Verificar código e ativar
POST /api/2fa/verify
Authorization: Bearer {token}
{ "token": "123456" }

# 6. Salvar códigos de backup

# 7. Fazer logout

# 8. Tentar login novamente
POST /api/auth/login
{ "email": "admin@pharma.com", "senha": "123456" }
# Deve retornar requires2FA: true

# 9. Validar código 2FA
POST /api/2fa/validate
{ "userId": "uuid", "token": "123456" }

# 10. Login completo! ✅
```

---

## ❓ FAQ

### O que acontece se eu perder meu celular?

Use um código de backup para fazer login e depois:
1. Desative o 2FA
2. Configure novamente no novo celular

### Posso usar o mesmo 2FA em múltiplos dispositivos?

Sim! Escaneie o mesmo QR Code em múltiplos apps autenticadores.

### Os códigos expiram?

Sim, códigos TOTP expiram a cada 30 segundos. Códigos de backup não expiram.

### Posso desativar 2FA?

Sim, mas você precisará da senha + código 2FA atual.

### 2FA é obrigatório?

Não, mas é **altamente recomendado** para administradores e gerentes.

---

## 📊 Estatísticas de Segurança

Com 2FA ativado:
- 🔒 **99.9%** de redução em acessos não autorizados
- 🛡️ **Proteção** contra phishing de senha
- ✅ **Conformidade** com padrões de segurança

---

## 🆘 Suporte

Se você perdeu acesso ao 2FA e aos códigos de backup:

1. Entre em contato com o administrador do sistema
2. Será necessário verificação de identidade
3. Administrador pode desativar 2FA manualmente no banco de dados

---

**Última atualização:** 07/01/2026  
**Versão:** 1.0.0
