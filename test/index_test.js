import Optional from "../lib/index";
import { ok, throws, doesNotThrow, strictEqual } from "assert";

describe("Optional", () => {
  let nullValue = new Optional(null);
  let undefinedValue = new Optional(undefined);
  let trueValue = new Optional(true);
  let falseValue = new Optional(false);
  let optionalValue = new Optional(nullValue);

  it("hides the real value", () => {
    ok(Object.getOwnPropertyNames(trueValue).length === 0);
  });

  describe("#get", () => {
    it("throws for null or undefined values", () => {
      throws(() => nullValue.get());
      throws(() => undefinedValue.get());
    });

    it("returns the value when it is present (does not throw)", () => {
      doesNotThrow(() => trueValue.get());
      strictEqual(trueValue.get(), true);

      doesNotThrow(() => falseValue.get());
      strictEqual(falseValue.get(), false);

      doesNotThrow(() => optionalValue.get());
      strictEqual(optionalValue.get(), nullValue);
    });
  });

  describe("#orElse", () => {
    it('returns value when present', () =>
      strictEqual(trueValue.orElse(false), true));

    it('returns passed argument when optional is empty', () =>
      strictEqual(nullValue.orElse(false), false));
  });

  describe("#isPresent", () => {
    strictEqual(nullValue.isPresent(), false);
    strictEqual(undefinedValue.isPresent(), false);

    strictEqual(trueValue.isPresent(), true);
    strictEqual(falseValue.isPresent(), true);
    strictEqual(optionalValue.isPresent(), true);
  });

  describe("#ifPresent", () => {
    it("returns whether value is present", () => {
      let ifPresentCalled = false;
      trueValue.ifPresent((truth) => {
        strictEqual(truth, true);
        ifPresentCalled = true;
      });
      ok(ifPresentCalled);
    });
  });

  describe("#isEmpty", () => {
    strictEqual(nullValue.isEmpty(), true);
    strictEqual(undefinedValue.isEmpty(), true);

    strictEqual(trueValue.isEmpty(), false);
    strictEqual(falseValue.isEmpty(), false);
    strictEqual(optionalValue.isEmpty(), false);
  });

  describe("#ifEmpty", () => {
    it("returns false/true if boxed value is present (not null and not undefined)", () => {
      let ifEmptyCalled = false;
      nullValue.ifEmpty(() => ifEmptyCalled = true);
      ok(ifEmptyCalled);
    });
  });

  describe("#map", () => {
    describe("when a value is present", () => {
      it("calls provided function with present value and returns result", () => {
        let mappedValue = trueValue.map(String);

        ok(mappedValue instanceof Optional);
        strictEqual(mappedValue.get(), "true");
      });
    });

    describe("when empty", () => {
      it("does not call provided function and returns empty Optional", () => {
        let mapFunctionCalled = false;
        /*eslint-disable no-unused-vars*/
        let result = nullValue.map((_) => {
        /*eslint-enable no-unused-vars*/
          mapFunctionCalled = true;
          return "some string";
        });
        ok(result instanceof Optional);
        ok(!mapFunctionCalled);
      });
    });
  });

  describe("#flatMap", () => {
    describe("when a value is present", () => {
      describe("and when callback returns an Optional", () => {
        it("returns an Optional of the callback's returned Optional value", () => {
          let opt = Optional.of(true).flatMap((truth) => Optional.of(`${truth}`));
          ok(opt instanceof Optional);
          strictEqual(opt.get(), "true");
        });
      });

      describe("and when callback returns a non-Optional", () => {
        it("returns an Optional of the callback's returned value", () => {
          let opt = Optional.of(true).flatMap(String);
          ok(opt instanceof Optional);
          strictEqual(opt.get(), "true");
        });
      })
    });

    describe("when empty", () => {
      it("does not invoke callback", () => {
        let callbackCalled = false
        /*eslint-disable no-unused-vars*/
        nullValue.flatMap((_) => callbackCalled = true);
        /*eslint-enable no-unused-vars*/
        ok(!callbackCalled);
      });

      it("returns an empty Optional", () => {
        /*eslint-disable no-unused-vars*/
        let opt = Optional.of(null).flatMap((_) => Optional.of("foo"));
        /*eslint-enable no-unused-vars*/
        ok(opt instanceof Optional);
        ok(opt.isEmpty());
      });
    });
  });

  describe("#filter", () => {
    describe("when a value is present", () => {
      describe("and the passed function returns truthy", () => {
        it("returns an Optional with the original boxed value", () => {
          let oneOpt = new Optional(1).filter((val) => val > 0);
          strictEqual(oneOpt.isPresent(), true);
          strictEqual(oneOpt.get(), 1);
        });
      });

      describe("and the passed function returns falsey", () => {
        it("returns an empty Optional", () => {
          let opt = new Optional(1).filter((val) => val > 10);
          ok(opt instanceof Optional);
          ok(opt.isEmpty());
        });
      });
    });

    describe("when empty", () => {
      it("does not call filter function", () => {
        let filterCalled = false;
        /*eslint-disable no-unused-vars*/
        nullValue.filter((_) => {
        /*eslint-enable no-unused-vars*/
          filterCalled = true;
        });
        ok(!filterCalled);
      });

      it("returns an empty Optional", () => {
        let opt = nullValue.filter((noop) => noop);
        ok(opt instanceof Optional);
        ok(opt.isEmpty());
      });
    });
  });

  describe("#equals", () => {
    it("returns the '==' result of the boxed value and passed argument", () => {
      let oneOpt = new Optional(1);
      strictEqual(oneOpt.equals(1), true);
      strictEqual(oneOpt.equals(1), true);
    });

    it("returns the '==' result of the boxed value and passed Optional's boxed value", () => {
      let oneOpt = new Optional(1);
      strictEqual(oneOpt.equals(Optional.of(1)), true);
      strictEqual(oneOpt.equals(Optional.of("1")), true);
    });
  });

  describe("#strictEquals", () => {
    it("returns the '===' result of the boxed value and passed argument", () => {
      let oneOpt = new Optional(1);
      strictEqual(oneOpt.strictEquals(1), true);
      strictEqual(oneOpt.strictEquals(1), true);
    });

    it("returns the '===' result of the boxed value and passed Optional's boxed value", () => {
      let oneOpt = new Optional(1);
      strictEqual(oneOpt.strictEquals(Optional.of(1)), true);
      strictEqual(oneOpt.strictEquals(Optional.of("1")), false);
    });
  });

  describe(".of", () => {
    it("returns a new Optional of argument value", () => {
      let newOpt = Optional.of("foo");
      ok(newOpt instanceof Optional);
      strictEqual(newOpt.get(), "foo");
    });
  });

  describe(".empty", () => {
    it("returns an empty Optional", () => {
      strictEqual(Optional.empty().isPresent(), false);
    });
  });

  describe(".isOptional", () => {
    it("returns true/false when argument is an instanceof Optional", () => {
      strictEqual(Optional.isOptional(nullValue), true);
      strictEqual(Optional.isOptional(trueValue), true);
      strictEqual(Optional.isOptional("hello world"), false);
    });
  });

  describe(".isPresent", () => {
    it("returns whether the argument is not null and not undefined", () => {
      strictEqual(Optional.isPresent(null), false);
      strictEqual(Optional.isPresent(undefined), false);
      strictEqual(Optional.isPresent("present"), true);
    });
  });

  describe(".isEmpty", () => {
    it("returns whether the argument is null or undefined", () => {
      strictEqual(Optional.isEmpty(null), true);
      strictEqual(Optional.isEmpty(undefined), true);
      strictEqual(Optional.isEmpty("present"), false);
    });
  });
});
