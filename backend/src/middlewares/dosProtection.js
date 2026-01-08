/**
 * Middlewares adicionais de proteção contra DoS
 */

/**
 * Timeout para requisições longas
 */
const requestTimeout = (timeoutMs = 30000) => {
  return (req, res, next) => {
    req.setTimeout(timeoutMs, () => {
      res.status(408).json({
        error: 'Request Timeout',
        message: 'A requisição demorou muito tempo para ser processada'
      });
    });
    
    res.setTimeout(timeoutMs, () => {
      res.status(503).json({
        error: 'Service Unavailable',
        message: 'O servidor demorou muito tempo para responder'
      });
    });
    
    next();
  };
};

/**
 * Limitar requisições simultâneas por IP
 */
const concurrentRequestLimiter = () => {
  const activeRequests = new Map();
  const MAX_CONCURRENT = 10; // Máximo de 10 requisições simultâneas por IP

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const current = activeRequests.get(ip) || 0;

    if (current >= MAX_CONCURRENT) {
      return res.status(429).json({
        error: 'Muitas requisições simultâneas',
        message: 'Você tem muitas requisições em andamento. Aguarde a conclusão das anteriores.'
      });
    }

    activeRequests.set(ip, current + 1);

    // Decrementar ao finalizar
    res.on('finish', () => {
      const count = activeRequests.get(ip) || 1;
      if (count <= 1) {
        activeRequests.delete(ip);
      } else {
        activeRequests.set(ip, count - 1);
      }
    });

    next();
  };
};

/**
 * Detectar e bloquear requisições suspeitas
 */
const suspiciousActivityDetector = () => {
  const suspiciousPatterns = [
    /(\.\.|\/\/|\\\\)/g, // Path traversal
    /(union|select|insert|update|delete|drop|create|alter)/gi, // SQL Injection
    /(<script|javascript:|onerror=|onload=)/gi, // XSS
    /(eval\(|exec\(|system\()/gi // Code injection
  ];

  return (req, res, next) => {
    const checkString = JSON.stringify({
      body: req.body,
      query: req.query,
      params: req.params
    });

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(checkString)) {
        console.warn(`⚠️ Atividade suspeita detectada de ${req.ip}: ${pattern}`);
        return res.status(400).json({
          error: 'Requisição inválida',
          message: 'Sua requisição contém padrões suspeitos'
        });
      }
    }

    next();
  };
};

/**
 * Limitar tamanho de arrays em requisições
 */
const arrayLimiter = (maxItems = 100) => {
  return (req, res, next) => {
    const checkArrays = (obj) => {
      if (Array.isArray(obj)) {
        if (obj.length > maxItems) {
          throw new Error(`Array muito grande (máximo: ${maxItems} itens)`);
        }
        obj.forEach(item => checkArrays(item));
      } else if (obj && typeof obj === 'object') {
        Object.values(obj).forEach(value => checkArrays(value));
      }
    };

    try {
      if (req.body) checkArrays(req.body);
      if (req.query) checkArrays(req.query);
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Payload inválido',
        message: error.message
      });
    }
  };
};

/**
 * Proteção contra Slowloris (conexões lentas)
 */
const slowlorisProtection = (headerTimeoutMs = 10000) => {
  return (req, res, next) => {
    const timeout = setTimeout(() => {
      if (!req.complete) {
        req.destroy();
      }
    }, headerTimeoutMs);

    req.on('end', () => clearTimeout(timeout));
    next();
  };
};

/**
 * Monitorar uso de recursos
 */
const resourceMonitor = () => {
  const startTimes = new Map();

  return (req, res, next) => {
    const requestId = `${req.ip}-${Date.now()}`;
    startTimes.set(requestId, {
      time: Date.now(),
      memory: process.memoryUsage().heapUsed
    });

    res.on('finish', () => {
      const start = startTimes.get(requestId);
      if (start) {
        const duration = Date.now() - start.time;
        const memoryDelta = process.memoryUsage().heapUsed - start.memory;

        // Log requisições lentas ou que consomem muita memória
        if (duration > 5000) {
          console.warn(`⚠️ Requisição lenta: ${req.method} ${req.path} - ${duration}ms`);
        }
        if (memoryDelta > 50 * 1024 * 1024) { // 50MB
          console.warn(`⚠️ Alto consumo de memória: ${req.method} ${req.path} - ${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
        }

        startTimes.delete(requestId);
      }
    });

    next();
  };
};

module.exports = {
  requestTimeout,
  concurrentRequestLimiter,
  suspiciousActivityDetector,
  arrayLimiter,
  slowlorisProtection,
  resourceMonitor
};
