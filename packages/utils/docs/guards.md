# guards

Type guard utilities for common validation patterns.

This module consolidates reusable type guards that are used throughout
the codebase for validating GraphQL schema objects and other entities.

## Functions

### hasArrayProperty()

#### Call Signature

```ts
function hasArrayProperty<K>(obj, key): obj is Record<K, unknown[]>;
```

Defined in: [guards.ts:111](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/guards.ts#L111)

Type guard to check if an object has an array property.

##### Type Parameters

###### K

`K` _extends_ `PropertyKey`

##### Parameters

###### obj

`unknown`

The object to check

###### key

`K`

The property name to look for

##### Returns

`obj is Record<K, unknown[]>`

`true` if the property exists and is an array, `false` otherwise

##### Example

```typescript
import { hasArrayProperty } from "@graphql-markdown/utils/guards";

if (hasArrayProperty(type, "args")) {
  // type.args is now typed as unknown[]
  console.log(type.args.length);
}
```

#### Call Signature

```ts
function hasArrayProperty(obj, key): obj is Record<PropertyKey, unknown[]>;
```

Defined in: [guards.ts:116](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/guards.ts#L116)

Type guard to check if an object has an array property.

##### Parameters

###### obj

`unknown`

The object to check

###### key

`PropertyKey`

The property name to look for

##### Returns

`obj is Record<PropertyKey, unknown[]>`

`true` if the property exists and is an array, `false` otherwise

##### Example

```typescript
import { hasArrayProperty } from "@graphql-markdown/utils/guards";

if (hasArrayProperty(type, "args")) {
  // type.args is now typed as unknown[]
  console.log(type.args.length);
}
```

---

### hasFunctionProperty()

#### Call Signature

```ts
function hasFunctionProperty<K>(
  obj,
  key,
): obj is Record<K, (args: unknown[]) => unknown>;
```

Defined in: [guards.ts:213](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/guards.ts#L213)

Type guard to check if an object has a function property.

##### Type Parameters

###### K

`K` _extends_ `PropertyKey`

##### Parameters

###### obj

`unknown`

The object to check

###### key

`K`

The property name to look for

##### Returns

`obj is Record<K, (args: unknown[]) => unknown>`

`true` if the property exists and is a function, `false` otherwise

##### Example

```typescript
import { hasFunctionProperty } from "@graphql-markdown/utils/guards";

if (hasFunctionProperty(directive, "descriptor")) {
  // directive.descriptor is now typed as a function
  directive.descriptor();
}
```

#### Call Signature

```ts
function hasFunctionProperty(
  obj,
  key,
): obj is Record<PropertyKey, (args: unknown[]) => unknown>;
```

Defined in: [guards.ts:218](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/guards.ts#L218)

Type guard to check if an object has a function property.

##### Parameters

###### obj

`unknown`

The object to check

###### key

`PropertyKey`

The property name to look for

##### Returns

`obj is Record<PropertyKey, (args: unknown[]) => unknown>`

`true` if the property exists and is a function, `false` otherwise

##### Example

```typescript
import { hasFunctionProperty } from "@graphql-markdown/utils/guards";

if (hasFunctionProperty(directive, "descriptor")) {
  // directive.descriptor is now typed as a function
  directive.descriptor();
}
```

---

### hasNonEmptyArrayProperty()

#### Call Signature

```ts
function hasNonEmptyArrayProperty<K>(obj, key): obj is Record<K, unknown[]>;
```

Defined in: [guards.ts:145](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/guards.ts#L145)

Type guard to check if an object has a non-empty array property.

##### Type Parameters

###### K

`K` _extends_ `PropertyKey`

##### Parameters

###### obj

`unknown`

The object to check

###### key

`K`

The property name to look for

##### Returns

`obj is Record<K, unknown[]>`

`true` if the property exists, is an array, and is non-empty, `false` otherwise

##### Example

```typescript
import { hasNonEmptyArrayProperty } from "@graphql-markdown/utils/guards";

if (hasNonEmptyArrayProperty(type, "args")) {
  // type.args is a non-empty array
  const firstArg = type.args[0];
}
```

#### Call Signature

```ts
function hasNonEmptyArrayProperty(
  obj,
  key,
): obj is Record<PropertyKey, unknown[]>;
```

Defined in: [guards.ts:150](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/guards.ts#L150)

Type guard to check if an object has a non-empty array property.

##### Parameters

###### obj

`unknown`

The object to check

###### key

`PropertyKey`

The property name to look for

##### Returns

`obj is Record<PropertyKey, unknown[]>`

`true` if the property exists, is an array, and is non-empty, `false` otherwise

##### Example

```typescript
import { hasNonEmptyArrayProperty } from "@graphql-markdown/utils/guards";

if (hasNonEmptyArrayProperty(type, "args")) {
  // type.args is a non-empty array
  const firstArg = type.args[0];
}
```

---

### hasProperties()

```ts
function hasProperties<K>(obj, ...keys): obj is Record<K, unknown>;
```

Defined in: [guards.ts:82](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/guards.ts#L82)

Type guard to check if an object has multiple specific properties.

#### Type Parameters

##### K

`K` _extends_ `PropertyKey`

#### Parameters

##### obj

`unknown`

The object to check

##### keys

...`K`[]

The property names to look for

#### Returns

`obj is Record<K, unknown>`

`true` if the object has all the properties, `false` otherwise

#### Example

```typescript
import { hasProperties } from "@graphql-markdown/utils/guards";

if (hasProperties(type, "name", "description")) {
  // Both properties exist on type
  console.log(type.name, type.description);
}
```

---

### hasProperty()

#### Call Signature

```ts
function hasProperty<K>(obj, key): obj is Record<K, unknown>;
```

Defined in: [guards.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/guards.ts#L48)

Type guard to check if an object has a specific property.

##### Type Parameters

###### K

`K` _extends_ `PropertyKey`

##### Parameters

###### obj

`unknown`

The object to check

###### key

`K`

The property name to look for

##### Returns

`obj is Record<K, unknown>`

`true` if the object has the property, `false` otherwise

##### Example

```typescript
import { hasProperty } from "@graphql-markdown/utils/guards";

if (hasProperty(type, "args")) {
  // type.args is now accessible
  console.log(type.args);
}
```

#### Call Signature

```ts
function hasProperty(obj, key): obj is Record<PropertyKey, unknown>;
```

Defined in: [guards.ts:53](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/guards.ts#L53)

Type guard to check if an object has a specific property.

##### Parameters

###### obj

`unknown`

The object to check

###### key

`PropertyKey`

The property name to look for

##### Returns

`obj is Record<PropertyKey, unknown>`

`true` if the object has the property, `false` otherwise

##### Example

```typescript
import { hasProperty } from "@graphql-markdown/utils/guards";

if (hasProperty(type, "args")) {
  // type.args is now accessible
  console.log(type.args);
}
```

---

### hasStringProperty()

#### Call Signature

```ts
function hasStringProperty<K>(obj, key): obj is Record<K, string>;
```

Defined in: [guards.ts:179](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/guards.ts#L179)

Type guard to check if an object has a string property.

##### Type Parameters

###### K

`K` _extends_ `PropertyKey`

##### Parameters

###### obj

`unknown`

The object to check

###### key

`K`

The property name to look for

##### Returns

`obj is Record<K, string>`

`true` if the property exists and is a string, `false` otherwise

##### Example

```typescript
import { hasStringProperty } from "@graphql-markdown/utils/guards";

if (hasStringProperty(type, "description")) {
  // type.description is now typed as string
  console.log(type.description.length);
}
```

#### Call Signature

```ts
function hasStringProperty(obj, key): obj is Record<PropertyKey, string>;
```

Defined in: [guards.ts:184](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/guards.ts#L184)

Type guard to check if an object has a string property.

##### Parameters

###### obj

`unknown`

The object to check

###### key

`PropertyKey`

The property name to look for

##### Returns

`obj is Record<PropertyKey, string>`

`true` if the property exists and is a string, `false` otherwise

##### Example

```typescript
import { hasStringProperty } from "@graphql-markdown/utils/guards";

if (hasStringProperty(type, "description")) {
  // type.description is now typed as string
  console.log(type.description.length);
}
```

---

### isNonEmptyArray()

```ts
function isNonEmptyArray(value): value is unknown[];
```

Defined in: [guards.ts:246](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/guards.ts#L246)

Type guard to check if a value is a non-empty array.

#### Parameters

##### value

`unknown`

The value to check

#### Returns

`value is unknown[]`

`true` if the value is an array with at least one element

#### Example

```typescript
import { isNonEmptyArray } from "@graphql-markdown/utils/guards";

if (isNonEmptyArray(values)) {
  // values is now typed as unknown[] with at least one element
  console.log(values[0]);
}
```

---

### isTypeObject()

```ts
function isTypeObject(obj): obj is Record<string, unknown>;
```

Defined in: [guards.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/guards.ts#L27)

Type guard to check if a value is an object but not an array.

#### Parameters

##### obj

`unknown`

The value to check

#### Returns

`obj is Record<string, unknown>`

`true` if the value is a non-null object but not an array, `false` otherwise

#### Example

```typescript
import { isTypeObject } from "@graphql-markdown/utils/guards";

if (isTypeObject(value)) {
  // value is now typed as Record<string, unknown> and is not an array
  // (includes Date, Map, and other object types)
  console.log(Object.keys(value));
}
```
