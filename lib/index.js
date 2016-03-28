const VALUE_SYMBOL = Symbol("VALUE_SYMBOL");
const GET_COMPARABLE_VALUES = Symbol("GET_COMPARABLE_VALUES");

/**
 * Utility class for differentiating null, undefined and present values.
 */
class Optional {
  /**
   * Create an Optional.
   *
   * @template {T}
   * @param {T} [value] - value to box Optional with
   */
  constructor(value) {
    this[VALUE_SYMBOL] = value;
  }

  /**
   * Returns present value or throws when empty.
   *
   * @throws {TypeError}
   * @returns {T}
   */
  get() {
    if (this.isPresent()) return this[VALUE_SYMBOL];
    throw new TypeError("Optional is empty.");
  }

  /**
   * Returns present value or passed value when empty.
   *
   * @param {T} [value] - value to return if Optional is empty
   * @returns {T}
   */
  orElse(value) {
    return this.isPresent() ? this.get() : value;
  }

  /**
   * Returns whether the Optional has a value present.
   *
   * @returns {boolean}
   */
  isPresent() {
    return Optional.isPresent(this[VALUE_SYMBOL]);
  }

  /**
   * @callback Optional~ifPresentCallback
   * @param {T} value - present value
   * @return {undefined}
   */

  /**
   * Calls supplied function when one is present.
   *
   * @param {Optional~ifPresentCallback} fn
   * @returns {Optional.<T>}
   */
  ifPresent(fn) {
    if (this.isPresent()) fn(this.get());
    return this;
  }

  /**
   * Returns whether the Optional is empty.
   *
   * @returns {boolean}
   */
  isEmpty() {
    return !this.isPresent();
  }

  /**
   * @callback Optional~EmptyCallback
   * @return {undefined}
   */

  /**
   * Calls supplied function if Optional is empty.
   *
   * @param {Optional~EmptyCallback} fn
   * @returns {Optional.<T>}
   */
  ifEmpty(fn) {
    if (this.isEmpty()) fn();
    return this;
  }

  /**
   * @callback Optional~MapCallback
   * @template U
   * @param {T} value
   * @return {U}
   */

  /**
   * Calls supplied function when value is present and returns an Optional of
   * the function's result. Otherwise returns an empty Optional.
   *
   * @template U
   * @param {Optional~MapCallback} fn
   * @return {(Optional.<U>|Optional.<T>)}
   */
  map(fn) {
    if (this.isPresent()) return new Optional(fn(this.get()));
    return this;
  }

  /**
   * Calls supplied function when value is present and returns an Optional of
   * the function's result. Unlike {@link Optional#map}, if supplied function
   * returns an Optional, then it is not boxed. Otherwise returns an empty
   * Optional.
   *
   * @template U
   * @param {Optional~MapCallback} fn
   * @return {(Optional.<U>|Optional.<T>)}
   */
  flatMap(fn) {
    if (this.isPresent()) {
      let mappedValue = fn(this.get());
      return Optional.isOptional(mappedValue) ? mappedValue : new Optional(mappedValue);
    } else {
      return this;
    }
  }

  /**
   * @callback Optional~FilterCallback
   * @param {T} - the present value
   * @return {boolean}
   */

  /**
   * Returns an Optional of present value when passed function returns a truthy
   * value. Otherwise returns an empty Optional.
   *
   * @param {Optional~FilterCallback} fn
   * @returns {Optional.<T>}
   */
  filter(fn) {
    return this.map((val) => fn(val) ? val : null);
  }

  /**
   * Returns result of `==` comparison with unboxed value and (unboxed if Optional) argument.
   *
   * @param {*} other - value to compare Optional's unboxed value with
   * @returns {boolean}
   */
  equals(other) {
    let { a, b } = Optional[GET_COMPARABLE_VALUES](this, other);
    return a == b;
  }

  /**
   * Returns result of `===` comparison with unboxed value and (unboxed if Optional) argument.
   *
   * @param {*} other - value to compare Optional's unboxed value with
   * @returns {boolean}
   */
  strictEquals(other) {
    let { a, b } = Optional[GET_COMPARABLE_VALUES](this, other);
    return a === b;
  }

  /**
   * Convenience initializer; returns an Optional of value.
   *
   * @template T
   * @param {T} [value]
   * @returns {Optional.<T>}
   */
  static of(value) {
    return new Optional(value);
  }

  /**
   * Convenience initializer; returns an empty Optional.
   *
   * @returns {Optional.<null>}
   */
  static empty() {
    return new Optional(null);
  }

  /**
   * Returns whether the argument is an instance of Optional.
   *
   * @param {*} - variable to test
   * @returns {boolean}
   */
  static isOptional(optional) {
    return optional instanceof Optional;
  }

  /**
   * Returns whether value is present (not null and not undefined).
   *
   * This is simply `typeof value !== "undefined" && value !== null`.
   *
   * @param {*} value
   * @returns {boolean}
   */
  static isPresent(value) {
    return typeof value !== "undefined" && value !== null;
  }

  /**
   * Returns whether value is empty (null or undefined).
   *
   * This is simply `typeof value !== "undefined" && value !== null`.
   *
   * @param {*} value
   * @returns {boolean}
   */
  static isEmpty(value) {
    return !Optional.isPresent(value);
  }

  /**
   * @private
   * @typedef Optional~ComparisonTuple
   * @type {object}
   * @property {*} a
   * @property {*} b
   */

  /**
   * Normalizes input for comparison with #equals or #strictEquals.
   *
   * If argument is an Optional, returns the true boxed value
   * (T|null|undefined). If argument is not an Optional, returns argument.
   *
   * @private
   * @param {*} a
   * @param {*} b
   * @return {Optional~ComparisonTuple}
   */
  static [GET_COMPARABLE_VALUES](a, b) {
    return {
      a : Optional.isOptional(a) ? a[VALUE_SYMBOL] : a,
      b : Optional.isOptional(b) ? b[VALUE_SYMBOL] : b
    };
  }
}

export default Optional;
