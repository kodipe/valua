interface ValidationResult {
  isValid(): boolean
  getErrors(): any
}

export {
  ValidationResult
}