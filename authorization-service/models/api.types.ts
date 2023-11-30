export interface ErrorResponse {
  error: string;
}
export enum Effect {
  Allow = 'Allow',
  Deny = 'Deny',
}

export interface PolicyResponse {
  principalId: string;
  policyDocument: {
    Version: string;
    Statement: [
      {
        Action: string;
        Effect: Effect;
        Resource: string;
      }
    ];
  };
}
