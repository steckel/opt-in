# opt-in
[Optional](#Optional): Utility class for differentiating null, undefined and present values.

## Example

### Basic Usage

```javascript
var something = new Optional(5);
something.isPresent(); // returns true
something.get(); // returns 5

var nothing = new Optional(null);
nothing.isPresent(); // returns false
nothing.get(); // throws TypeError
```

### Safe Defaults

```javascript
let user = getUser();
let userName = Optional.of(user.name).orElse("Anonymous User");
console.log(`Hello ${userName}`);
```

### Simple Control Flow

```javascript
function handleRequest(request, response) {
  Optional.of(request.headers["Authorization"])
    .ifEmpty(() => {
      response.statusCode = 401;
      response.end("You need an Authorization header to access this."); })
    .map(getUserForAuthToken)
    .ifPresent((user) => {
      response.statusCode = 200;
      response.end("Thanks friend!"); })
    .ifEmpty(() => {
      response.statusCode(500);
      response.end("We couldn't find a user behind that token."); });
}
```

## API

* [Optional](#Optional)
    * [new Optional([value])](#new_Optional_new)
    * _instance_
        * [.get()](#Optional+get) ⇒ <code>T</code>
        * [.orElse([value])](#Optional+orElse) ⇒ <code>T</code>
        * [.isPresent()](#Optional+isPresent) ⇒ <code>boolean</code>
        * [.ifPresent(fn)](#Optional+ifPresent) ⇒ <code>Optional.&lt;T&gt;</code>
        * [.isEmpty()](#Optional+isEmpty) ⇒ <code>boolean</code>
        * [.ifEmpty(fn)](#Optional+ifEmpty) ⇒ <code>Optional.&lt;T&gt;</code>
        * [.map(fn)](#Optional+map) ⇒ <code>Optional.&lt;U&gt;</code> &#124; <code>Optional.&lt;T&gt;</code>
        * [.flatMap(fn)](#Optional+flatMap) ⇒ <code>Optional.&lt;U&gt;</code> &#124; <code>Optional.&lt;T&gt;</code>
        * [.filter(fn)](#Optional+filter) ⇒ <code>Optional.&lt;T&gt;</code>
        * [.equals(other)](#Optional+equals) ⇒ <code>boolean</code>
        * [.strictEquals(other)](#Optional+strictEquals) ⇒ <code>boolean</code>
    * _static_
        * [.of([value])](#Optional.of) ⇒ <code>Optional.&lt;T&gt;</code>
        * [.empty()](#Optional.empty) ⇒ <code>Optional.&lt;null&gt;</code>
        * [.isOptional(optional)](#Optional.isOptional) ⇒ <code>boolean</code>
        * [.isPresent(value)](#Optional.isPresent) ⇒ <code>boolean</code>
        * [.isEmpty(value)](#Optional.isEmpty) ⇒ <code>boolean</code>
    * _inner_
        * [~ifPresentCallback](#Optional..ifPresentCallback) ⇒ <code>undefined</code>
        * [~EmptyCallback](#Optional..EmptyCallback) ⇒ <code>undefined</code>
        * [~MapCallback](#Optional..MapCallback) ⇒ <code>U</code>
        * [~FilterCallback](#Optional..FilterCallback) ⇒ <code>boolean</code>

<a name="new_Optional_new"></a>

### new Optional([value])
Create an Optional.


| Param | Type | Description |
| --- | --- | --- |
| [value] | <code>T</code> | value to box Optional with |

<a name="Optional+get"></a>

### optional.get() ⇒ <code>T</code>
Returns present value or throws when empty.

**Kind**: instance method of <code>[Optional](#Optional)</code>
**Throws**:

- <code>TypeError</code>

<a name="Optional+orElse"></a>

### optional.orElse([value]) ⇒ <code>T</code>
Returns present value or passed value when empty.

**Kind**: instance method of <code>[Optional](#Optional)</code>

| Param | Type | Description |
| --- | --- | --- |
| [value] | <code>T</code> | value to return if Optional is empty |

<a name="Optional+isPresent"></a>

### optional.isPresent() ⇒ <code>boolean</code>
Returns whether the Optional has a value present.

**Kind**: instance method of <code>[Optional](#Optional)</code>
<a name="Optional+ifPresent"></a>

### optional.ifPresent(fn) ⇒ <code>Optional.&lt;T&gt;</code>
Calls supplied function when one is present.

**Kind**: instance method of <code>[Optional](#Optional)</code>

| Param | Type |
| --- | --- |
| fn | <code>[ifPresentCallback](#Optional..ifPresentCallback)</code> |

<a name="Optional+isEmpty"></a>

### optional.isEmpty() ⇒ <code>boolean</code>
Returns whether the Optional is empty.

**Kind**: instance method of <code>[Optional](#Optional)</code>
<a name="Optional+ifEmpty"></a>

### optional.ifEmpty(fn) ⇒ <code>Optional.&lt;T&gt;</code>
Calls supplied function if Optional is empty.

**Kind**: instance method of <code>[Optional](#Optional)</code>

| Param | Type |
| --- | --- |
| fn | <code>[EmptyCallback](#Optional..EmptyCallback)</code> |

<a name="Optional+map"></a>

### optional.map(fn) ⇒ <code>Optional.&lt;U&gt;</code> &#124; <code>Optional.&lt;T&gt;</code>
Calls supplied function when value is present and returns an Optional of
the function's result. Otherwise returns an empty Optional.

**Kind**: instance method of <code>[Optional](#Optional)</code>
**Template**: U

| Param | Type |
| --- | --- |
| fn | <code>[MapCallback](#Optional..MapCallback)</code> |

<a name="Optional+flatMap"></a>

### optional.flatMap(fn) ⇒ <code>Optional.&lt;U&gt;</code> &#124; <code>Optional.&lt;T&gt;</code>
Calls supplied function when value is present and returns an Optional of
the function's result. Unlike [map](#Optional+map), if supplied function
returns an Optional, then it is not boxed. Otherwise returns an empty
Optional.

**Kind**: instance method of <code>[Optional](#Optional)</code>
**Template**: U

| Param | Type |
| --- | --- |
| fn | <code>[MapCallback](#Optional..MapCallback)</code> |

<a name="Optional+filter"></a>

### optional.filter(fn) ⇒ <code>Optional.&lt;T&gt;</code>
Returns an Optional of present value when passed function returns a truthy
value. Otherwise returns an empty Optional.

**Kind**: instance method of <code>[Optional](#Optional)</code>

| Param | Type |
| --- | --- |
| fn | <code>[FilterCallback](#Optional..FilterCallback)</code> |

<a name="Optional+equals"></a>

### optional.equals(other) ⇒ <code>boolean</code>
Returns result of `==` comparison with unboxed value and (unboxed if Optional) argument.

**Kind**: instance method of <code>[Optional](#Optional)</code>

| Param | Type | Description |
| --- | --- | --- |
| other | <code>\*</code> | value to compare Optional's unboxed value with |

<a name="Optional+strictEquals"></a>

### optional.strictEquals(other) ⇒ <code>boolean</code>
Returns result of `===` comparison with unboxed value and (unboxed if Optional) argument.

**Kind**: instance method of <code>[Optional](#Optional)</code>

| Param | Type | Description |
| --- | --- | --- |
| other | <code>\*</code> | value to compare Optional's unboxed value with |

<a name="Optional.of"></a>

### Optional.of([value]) ⇒ <code>Optional.&lt;T&gt;</code>
Convenience initializer; returns an Optional of value.

**Kind**: static method of <code>[Optional](#Optional)</code>
**Template**: T

| Param | Type |
| --- | --- |
| [value] | <code>T</code> |

<a name="Optional.empty"></a>

### Optional.empty() ⇒ <code>Optional.&lt;null&gt;</code>
Convenience initializer; returns an empty Optional.

**Kind**: static method of <code>[Optional](#Optional)</code>
<a name="Optional.isOptional"></a>

### Optional.isOptional(optional) ⇒ <code>boolean</code>
Returns whether the argument is an instance of Optional.

**Kind**: static method of <code>[Optional](#Optional)</code>

| Param | Type | Description |
| --- | --- | --- |
| optional | <code>\*</code> | variable to test |

<a name="Optional.isPresent"></a>

### Optional.isPresent(value) ⇒ <code>boolean</code>
Returns whether value is present (not null and not undefined).

This is simply `typeof value !== "undefined" && value !== null`.

**Kind**: static method of <code>[Optional](#Optional)</code>

| Param | Type |
| --- | --- |
| value | <code>\*</code> |

<a name="Optional.isEmpty"></a>

### Optional.isEmpty(value) ⇒ <code>boolean</code>
Returns whether value is empty (null or undefined).

This is simply `typeof value !== "undefined" && value !== null`.

**Kind**: static method of <code>[Optional](#Optional)</code>

| Param | Type |
| --- | --- |
| value | <code>\*</code> |

<a name="Optional..ifPresentCallback"></a>

### Optional~ifPresentCallback ⇒ <code>undefined</code>
**Kind**: inner typedef of <code>[Optional](#Optional)</code>

| Param | Type | Description |
| --- | --- | --- |
| value | <code>T</code> | present value |

<a name="Optional..EmptyCallback"></a>

### Optional~EmptyCallback ⇒ <code>undefined</code>
**Kind**: inner typedef of <code>[Optional](#Optional)</code>
<a name="Optional..MapCallback"></a>

### Optional~MapCallback ⇒ <code>U</code>
**Kind**: inner typedef of <code>[Optional](#Optional)</code>
**Template**: U

| Param | Type |
| --- | --- |
| value | <code>T</code> |

<a name="Optional..FilterCallback"></a>

### Optional~FilterCallback ⇒ <code>boolean</code>
**Kind**: inner typedef of <code>[Optional](#Optional)</code>

| Type | Description |
| --- | --- |
| <code>T</code> | the present value |

