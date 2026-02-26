export class InternalServerError extends Error {
  constructor({
    cause,
    message = "Um erro interno não esperado aconteceu.",
    action = "Entre em contato com o suporte.",
    statusCode = 500,
  }) {
    super(message, { cause });
    this.name = "InternalServerError";
    this.action = action;
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({
    cause,
    message = "Serviço indisponível no momento.",
    action = "Verifique se o serviço está disponível.",
    statusCode = 503,
  }) {
    super(message, { cause });
    this.name = "ServiceError";
    this.action = action;
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  constructor({
    cause,
    message = "Um erro de validação ocorreu.",
    action = "Ajuste os dados enviados e tente novamente.",
  }) {
    super(message, { cause });
    this.name = "ValidationError";
    this.action = action;
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  constructor({
    cause,
    message = "Não foi possível encontrar este recurso no sistema.",
    action = "Verifique se os parâmetros enviados na consulta estão certos.",
  }) {
    super(message, { cause });
    this.name = "NotFoundError";
    this.action = action;
    this.statusCode = 404;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ForbiddenError extends Error {
  constructor({
    cause,
    message = "Acesso negado.",
    action = "Verifique as features necessárias antes de continuar.",
  }) {
    super(message, { cause });
    this.name = "ForbiddenError";
    this.action = action;
    this.statusCode = 403;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class UnauthorizedError extends Error {
  constructor({
    cause,
    message = "Usuário não autenticado.",
    action = "Faça novamente o login para continuar.",
  }) {
    super(message, { cause });
    this.name = "UnauthorizedError";
    this.action = action;
    this.statusCode = 401;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Método não permitido para este endpoint.");
    this.name = "MethodNotAllowedError";
    this.action =
      "Verifique se o método HTTP enviado é válido para este endpoint.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
