/**
 * Enum for condition operators in rule conditions.
 * These operators are used to define the type of comparison that should be applied
 * to a fact in a rule's condition.
 *
 * @enum {string}
 */
export enum Operator {
  /** Strict equal operator, checks if the values are exactly equal using strict comparison (===). */
  STRICT_EQUAL = 'strictEqual',

  /** Strict not equal operator, checks if the values are not equal using strict comparison (!==). */
  STRICT_NOT_EQUAL = 'strictNotEqual',

  /** Loose equal operator, checks if the values are equal using loose comparison (==). */
  LOOSE_EQUAL = 'looseEqual',

  /** Loose not equal operator, checks if the values are not equal using loose comparison (!=). */
  LOOSE_NOT_EQUAL = 'looseNotEqual',

  /** Greater than operator, checks if the value is greater than the comparison value. */
  GREATER_THAN = 'greaterThan',

  /** Less than operator, checks if the value is less than the comparison value. */
  LESS_THAN = 'lessThan',

  /** Greater than or equal operator, checks if the value is greater than or equal to the comparison value. */
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',

  /** Less than or equal operator, checks if the value is less than or equal to the comparison value. */
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',

  /** Contains operator, checks if the value contains the comparison value. */
  CONTAINS = 'contains',

  /** Not contains operator, checks if the value does not contain the comparison value. */
  NOT_CONTAINS = 'notContains',

  /** Starts with operator, checks if the value starts with the comparison value. */
  STARTS_WITH = 'startsWith',

  /** Ends with operator, checks if the value ends with the comparison value. */
  ENDS_WITH = 'endsWith',

  /** Regular expression match operator, checks if the value matches the provided regular expression. */
  REGEX_MATCH = 'regexMatch',

  /** Regular expression not match operator, checks if the value does not match the provided regular expression. */
  REGEX_NOT_MATCH = 'regexNotMatch',

  /** Check inside of value operator. It will check array is containts this value */
  ARRAY_CONTAINS = 'arrayContains',

  /** Array operator it will foreach all values */
  EACH = 'each',
}
