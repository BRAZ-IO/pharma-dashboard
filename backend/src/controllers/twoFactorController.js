const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const { Usuario } = require('../models');
const { validateCodeTimingSafe, constantTimeExecution } = require('../utils/timingSafe');

const twoFactorController = {
  /**
   * Gerar QR Code para configurar 2FA
   * POST /api/2fa/setup
   */
  async setup(req, res, next) {
    try {
      const usuario = await Usuario.findByPk(req.userId);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      if (usuario.two_factor_enabled) {
        return res.status(400).json({
          error: '2FA já está ativado',
          message: 'Desative o 2FA atual antes de configurar novamente'
        });
      }

      // Gerar secret
      const secret = speakeasy.generateSecret({
        name: `Pharma Dashboard (${usuario.email})`,
        issuer: 'Pharma Dashboard',
        length: 32
      });

      // Salvar secret temporário (não ativado ainda)
      await usuario.update({
        two_factor_secret: secret.base32
      });

      // Gerar QR Code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

      res.json({
        message: '2FA configurado. Escaneie o QR Code no seu app autenticador',
        qrCode: qrCodeUrl,
        secret: secret.base32,
        manualEntry: {
          account: usuario.email,
          key: secret.base32,
          issuer: 'Pharma Dashboard'
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verificar código e ativar 2FA
   * POST /api/2fa/verify
   */
  async verify(req, res, next) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          error: 'Token é obrigatório'
        });
      }

      const usuario = await Usuario.findByPk(req.userId);

      if (!usuario || !usuario.two_factor_secret) {
        return res.status(400).json({
          error: '2FA não configurado',
          message: 'Execute o setup primeiro'
        });
      }

      // Verificar token
      const verified = speakeasy.totp.verify({
        secret: usuario.two_factor_secret,
        encoding: 'base32',
        token: token,
        window: 2 // Aceita tokens de 2 períodos antes/depois
      });

      if (!verified) {
        return res.status(401).json({
          error: 'Código inválido',
          message: 'Verifique o código e tente novamente'
        });
      }

      // Gerar códigos de backup
      const backupCodes = Array.from({ length: 10 }, () => 
        crypto.randomBytes(4).toString('hex').toUpperCase()
      );

      // Ativar 2FA
      await usuario.update({
        two_factor_enabled: true,
        two_factor_backup_codes: backupCodes
      });

      res.json({
        message: '2FA ativado com sucesso!',
        backupCodes: backupCodes,
        warning: 'Guarde estes códigos de backup em local seguro. Eles não serão mostrados novamente.'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Validar token 2FA no login
   * POST /api/2fa/validate
   */
  async validate(req, res, next) {
    try {
      const { userId, token, isBackupCode } = req.body;

      if (!userId || !token) {
        return res.status(400).json({
          error: 'Dados incompletos'
        });
      }

      // Executar validação com tempo constante (mínimo 200ms)
      const result = await constantTimeExecution(async () => {
        const usuario = await Usuario.findByPk(userId);

        if (!usuario || !usuario.two_factor_enabled) {
          return { valid: false, error: '2FA não está ativado' };
        }

        let valid = false;

      if (isBackupCode) {
        // Validar código de backup com proteção contra timing attacks
        const backupCodes = usuario.two_factor_backup_codes || [];
        let codeIndex = -1;
        
        // Usar comparação timing-safe para cada código
        for (let i = 0; i < backupCodes.length; i++) {
          if (validateCodeTimingSafe(token, backupCodes[i])) {
            codeIndex = i;
            break;
          }
        }

        if (codeIndex !== -1) {
          valid = true;
          // Remover código usado
          backupCodes.splice(codeIndex, 1);
          await usuario.update({
            two_factor_backup_codes: backupCodes
          });
        }
      } else {
        // Validar token TOTP
        valid = speakeasy.totp.verify({
          secret: usuario.two_factor_secret,
          encoding: 'base32',
          token: token,
          window: 2
        });
      }

        return { valid, usuario };
      }, 200); // Tempo mínimo de 200ms

      if (result.error) {
        return res.status(400).json({
          error: result.error
        });
      }

      if (!result.valid) {
        return res.status(401).json({
          error: 'Código inválido',
          message: 'Verifique o código e tente novamente'
        });
      }

      res.json({
        message: 'Código válido',
        valid: true
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Desativar 2FA
   * POST /api/2fa/disable
   */
  async disable(req, res, next) {
    try {
      const { senha, token } = req.body;

      if (!senha || !token) {
        return res.status(400).json({
          error: 'Senha e token são obrigatórios'
        });
      }

      const usuario = await Usuario.findByPk(req.userId);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      // Verificar senha
      const senhaValida = await usuario.validarSenha(senha);
      if (!senhaValida) {
        return res.status(401).json({
          error: 'Senha incorreta'
        });
      }

      // Verificar token 2FA
      const tokenValido = speakeasy.totp.verify({
        secret: usuario.two_factor_secret,
        encoding: 'base32',
        token: token,
        window: 2
      });

      if (!tokenValido) {
        return res.status(401).json({
          error: 'Código 2FA inválido'
        });
      }

      // Desativar 2FA
      await usuario.update({
        two_factor_enabled: false,
        two_factor_secret: null,
        two_factor_backup_codes: []
      });

      res.json({
        message: '2FA desativado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Gerar novos códigos de backup
   * POST /api/2fa/backup-codes
   */
  async regenerateBackupCodes(req, res, next) {
    try {
      const { senha, token } = req.body;

      if (!senha || !token) {
        return res.status(400).json({
          error: 'Senha e token são obrigatórios'
        });
      }

      const usuario = await Usuario.findByPk(req.userId);

      if (!usuario || !usuario.two_factor_enabled) {
        return res.status(400).json({
          error: '2FA não está ativado'
        });
      }

      // Verificar senha
      const senhaValida = await usuario.validarSenha(senha);
      if (!senhaValida) {
        return res.status(401).json({
          error: 'Senha incorreta'
        });
      }

      // Verificar token 2FA
      const tokenValido = speakeasy.totp.verify({
        secret: usuario.two_factor_secret,
        encoding: 'base32',
        token: token,
        window: 2
      });

      if (!tokenValido) {
        return res.status(401).json({
          error: 'Código 2FA inválido'
        });
      }

      // Gerar novos códigos
      const backupCodes = Array.from({ length: 10 }, () => 
        crypto.randomBytes(4).toString('hex').toUpperCase()
      );

      await usuario.update({
        two_factor_backup_codes: backupCodes
      });

      res.json({
        message: 'Novos códigos de backup gerados',
        backupCodes: backupCodes,
        warning: 'Os códigos antigos foram invalidados. Guarde estes novos códigos em local seguro.'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verificar status do 2FA
   * GET /api/2fa/status
   */
  async status(req, res, next) {
    try {
      const usuario = await Usuario.findByPk(req.userId, {
        attributes: ['id', 'email', 'two_factor_enabled']
      });

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      const backupCodesCount = usuario.two_factor_backup_codes?.length || 0;

      res.json({
        enabled: usuario.two_factor_enabled,
        backupCodesRemaining: usuario.two_factor_enabled ? backupCodesCount : 0
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = twoFactorController;
