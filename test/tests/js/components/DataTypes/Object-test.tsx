import { required } from "../../../../testHelpers/requireSources";
import React from "react";
import { render } from "@testing-library/react";
import { expect } from "chai";
import JsonObject from "./../../../../../src/js/components/DataTypes/Object";
describe("<JsonObject />", function () {
  const rjvId = 1;
  it("Object component should have a data type label", function () {
    const src: Record<string, unknown> = {
      test: true,
    };
    const wrapper = render(
      <JsonObject
        src={src}
        namespace={["root"]}
        rjvId={rjvId}
        theme="rjv-default"
        indentWidth={1}
        depth={1}
        displayDataTypes
        type="object"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".object-key-val")
    ).to.have.length(1);
  });
  it("Object mount, multiple data type labels", function () {
    const src: Record<string, unknown> = {
      bool: true,
      // should have label
      int: 5,
      // should have label
      str: "test",
      // should have label
      nan: NaN,
      null: null,
      undefined,
      func: function () {},
      // should have label
      float: 1.325,
      // should have label
      arr: [
        1,
        // should have label
        2, // should have label
      ],
      obj: {
        test: true, // should have label
      },
      empty_arr: [],
      empty_obj: {},
    };
    const wrapper = render(
      <JsonObject
        src={src}
        namespace={["root"]}
        rjvId={rjvId}
        theme="rjv-default"
        indentWidth={1}
        depth={1}
        collapsed={false}
        displayDataTypes
        type="object"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".data-type-label")
    ).to.have.length(8);
  });
  it("Object mount, no data type labels when collapsed", function () {
    const src: Record<string, unknown> = {
      bool: true,
      // should have label
      int: 5,
      // should have label
      str: "test",
      // should have label
      nan: NaN,
      null: null,
      undefined,
      func: function () {},
      // should have label
      float: 1.325,
      // should have label
      arr: [
        1,
        // should have label
        2, // should have label
      ],
      obj: {
        test: true, // should have label
      },
    };
    const wrapper = render(
      <JsonObject
        src={src}
        namespace={["root"]}
        rjvId={rjvId}
        theme="rjv-default"
        indentWidth={1}
        depth={1}
        displayDataTypes
        collapsed
        type="object"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".data-type-label")
    ).to.have.length(0);
  });
  it("Array mount expanded", function () {
    const src: Record<string, unknown> = {
      arr1: [
        {
          arr2: ["test"],
        },
      ],
    };
    const wrapper = render(
      <JsonObject
        src={src}
        namespace={["arr_test"]}
        name="test"
        rjvId={rjvId}
        theme="rjv-default"
        indentWidth={1}
        collapsed={false}
        depth={1}
        displayDataTypes
        type="array"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".expanded-icon")
    ).to.have.length(4);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".collapsed-icon")
    ).to.have.length(0);
  });
  it("Array mount collapsed", function () {
    const src: Record<string, unknown> = {
      arr1: [
        {
          arr2: ["test"],
        },
      ],
    };
    const wrapper = render(
      <JsonObject
        src={src}
        namespace={["arr_test"]}
        name="test"
        rjvId={rjvId}
        theme="rjv-default"
        collapsed
        indentWidth={1}
        depth={1}
        type="array"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".expanded-icon")
    ).to.have.length(0);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".collapsed-icon")
    ).to.have.length(1);
  });
  it("Array mount collapsed circle", function () {
    const src: Record<string, unknown> = {
      arr1: [
        {
          arr2: ["test"],
        },
      ],
    };
    const wrapper = render(
      <JsonObject
        src={src}
        namespace={["arr_test"]}
        name="test"
        rjvId={rjvId}
        theme="rjv-default"
        collapsed
        indentWidth={1}
        depth={1}
        type="array"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".expanded-icon")
    ).to.have.length(0);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".collapsed-icon")
    ).to.have.length(1);
  });
  it("Array mount collapsed square", function () {
    const src: Record<string, unknown> = {
      arr1: [
        {
          arr2: ["test"],
        },
      ],
    };
    const wrapper = render(
      <JsonObject
        src={src}
        namespace={["arr_test"]}
        name="test"
        rjvId={rjvId}
        theme="rjv-default"
        collapsed
        indentWidth={1}
        depth={1}
        iconStyle="square"
        type="array"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".expanded-icon")
    ).to.have.length(0);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".collapsed-icon")
    ).to.have.length(1);
  });
  it("Array mount collapsed triangle", function () {
    const src: Record<string, unknown> = {
      arr1: [
        {
          arr2: ["test"],
        },
      ],
    };
    const wrapper = render(
      <JsonObject
        src={src}
        namespace={["arr_test"]}
        name="test"
        rjvId={rjvId}
        theme="rjv-default"
        collapsed
        indentWidth={1}
        depth={1}
        iconStyle="triangle"
        type="array"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".expanded-icon")
    ).to.have.length(0);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".collapsed-icon")
    ).to.have.length(1);
  });
  it("non-empty object should be expanded", function () {
    const src: Record<string, unknown> = {
      test: true,
    };
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        collapsed={false}
        indentWidth={1}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".pushed-content")
    ).to.have.length(1);
  });
  it("empty object should not be expanded", function () {
    const src: Record<string, unknown> = {};
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        rjvId={rjvId}
        collapsed={false}
        indentWidth={1}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".pushed-content")
    ).to.have.length(0);
  });
  it("non-empty array should be expanded", function () {
    const src = [1, 2, 3];
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        rjvId={rjvId}
        collapsed={false}
        indentWidth={1}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".pushed-content")
    ).to.have.length(1);
  });
  it("empty array should not be expanded", function () {
    const src: unknown[] = [];
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        collapsed={false}
        indentWidth={1}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".pushed-content")
    ).to.have.length(0);
  });
  it("non-empty array should have ellipsis", function () {
    const src = [1, 2, 3];
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        rjvId={rjvId}
        collapsed
        indentWidth={1}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".node-ellipsis")
    ).to.have.length(1);
  });
  it("empty array should not have ellipsis", function () {
    const src: unknown[] = [];
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        rjvId={rjvId}
        collapsed
        indentWidth={1}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".node-ellipsis")
    ).to.have.length(0);
  });
  it("should collapse at shouldCollapse logic", function () {
    const src: Record<string, unknown> = {
      prop1: 1,
      prop2: 2,
      prop3: 3,
    };
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        collapsed={false}
        shouldCollapse={() => true}
        indentWidth={1}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".pushed-content")
    ).to.have.length(0);
  });
  it("should expand based on shouldCollapse logic", function () {
    const src: Record<string, unknown> = {
      prop1: 1,
      prop2: 2,
      prop3: 3,
    };
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        collapsed={false}
        shouldCollapse={() => false}
        indentWidth={1}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".pushed-content")
    ).to.have.length(1);
  });
  it("sort object keys", () => {
    const src: Record<string, unknown> = {
      d: "d",
      b: "b",
      a: "a",
      c: "c",
    };
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        sortKeys
        collapsed={false}
        shouldCollapse={() => false}
        quotesOnKeys
        indentWidth={1}
      />
    );
    expect(wrapper.container.textContent).to.equal(
      '"":{"a":"a","b":"b","c":"c","d":"d"},'
    );
  });
  it("do not sort object keys", () => {
    const src: Record<string, unknown> = {
      d: "d",
      b: "b",
      a: "a",
      c: "c",
    };
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        collapsed={false}
        shouldCollapse={() => false}
        quotesOnKeys
        indentWidth={1}
      />
    );
    expect(wrapper.container.textContent).to.equal(
      '"":{"d":"d","b":"b","a":"a","c":"c"},'
    );
  });
  it("Object should show comma between elements and not last element", function () {
    const src: Record<string, unknown> = {
      prop1: 1,
      prop2: 2,
    };
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        rjvId={rjvId}
        isLast={false}
        collapsed={false}
        indentWidth={1}
        depth={1}
        type="object"
      />
    );
    expect(
      Array.from(
        required(
          wrapper.container.firstElementChild
        ).querySelectorAll<HTMLElement>(":scope > span")
      ).some((node) => node.textContent === ",")
    ).to.equal(true);
  });
  it("Object should not show comma when isLast is true", function () {
    const src: Record<string, unknown> = {
      prop1: 1,
      prop2: 2,
    };
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        rjvId={rjvId}
        isLast
        collapsed={false}
        indentWidth={1}
        depth={1}
        type="object"
      />
    );
    expect(
      Array.from(
        required(
          wrapper.container.firstElementChild
        ).querySelectorAll<HTMLElement>(":scope > span")
      ).some((node) => node.textContent === ",")
    ).to.equal(false);
  });
  it("Object should not show comma when jsvRoot is true", function () {
    const src: Record<string, unknown> = {
      prop1: 1,
      prop2: 2,
    };
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        rjvId={rjvId}
        isLast={false}
        jsvRoot
        collapsed={false}
        indentWidth={1}
        depth={1}
        type="object"
      />
    );
    expect(
      Array.from(
        required(
          wrapper.container.firstElementChild
        ).querySelectorAll<HTMLElement>(":scope > span")
      ).some((node) => node.textContent === ",")
    ).to.equal(false);
  });
  it("Object should show circular reference component", function () {
    const src: Record<string, unknown> = {
      prop1: 1,
      prop2: 2,
    };
    src.self = src;
    const wrapper = render(
      <JsonObject
        src={src}
        theme="rjv-default"
        namespace={["root"]}
        rjvId={rjvId}
        isLast={false}
        jsvRoot
        collapsed={false}
        indentWidth={1}
        depth={1}
        type="object"
      />
    );
    expect(wrapper.container.textContent).to.include("[CIRCULAR REFERENCE]");
  });
});
