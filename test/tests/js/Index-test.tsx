import { fireEvent, render } from "@testing-library/react";
import { expect } from "chai";
import React from "react";
import sinon from "sinon";

import { required } from "../../testHelpers/requireSources";
import Index from "./../../../src/js/index";
import ObjectAttributes from "./../../../src/js/stores/ObjectAttributes";
describe("<Index />", function () {
  it("supports expansion and source updates in Strict Mode", function () {
    const wrapper = render(
      <React.StrictMode>
        <Index
          src={{
            value: 1,
          }}
          enableClipboard={false}
        />
      </React.StrictMode>,
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".variable-row"),
    ).to.have.length(1);
    fireEvent.click(
      required(wrapper.container.querySelector<HTMLElement>(".icon-container")),
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".variable-row"),
    ).to.have.length(0);
    fireEvent.click(
      required(wrapper.container.querySelector<HTMLElement>(".icon-container")),
    );
    wrapper.rerender(
      <React.StrictMode>
        <Index
          src={{
            value: 2,
            other: true,
          }}
          enableClipboard={false}
        />
      </React.StrictMode>,
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".variable-row"),
    ).to.have.length(2);
    expect(wrapper.container.textContent).to.include("int2");
    wrapper.unmount();
  });
  it("keeps expansion state when its parent is collapsed and expanded", function () {
    const wrapper = render(
      <Index
        src={{
          nested: {
            value: 1,
          },
        }}
        enableClipboard={false}
      />,
    );
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>(".icon-container")[1],
      ),
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".variable-row"),
    ).to.have.length(0);
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>(".icon-container")[0],
      ),
    );
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>(".icon-container")[0],
      ),
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".node-ellipsis"),
    ).to.have.length(1);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".variable-row"),
    ).to.have.length(0);
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>(".icon-container")[1],
      ),
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".variable-row"),
    ).to.have.length(1);
    wrapper.unmount();
  });
  it("recomputes ancestors when the source changes", function () {
    const previous = {
      value: 1,
    };
    const next: Record<string, unknown> = {
      previous,
    };
    next.self = next;
    const _element = <Index src={previous} enableClipboard={false} />;
    const wrapper = render(_element);
    wrapper.rerender(
      React.cloneElement(_element, {
        src: next,
      }),
    );
    expect(
      required(wrapper.container.textContent).split("[CIRCULAR REFERENCE]"),
    ).to.have.length(2);
    expect(
      required(
        wrapper.container.querySelectorAll<HTMLElement>(".variable-value")[0],
      ).textContent,
    ).to.equal("int1");
    wrapper.unmount();
  });
  it("shows commas between nested array and object values without trailing commas", function () {
    const wrapper = render(
      <Index
        src={[
          1,
          {
            value: 2,
          },
          [3, 4],
        ]}
        name={false}
        quotesOnKeys={false}
        displayArrayKey={false}
        displayObjectSize={false}
        displayDataTypes={false}
        enableClipboard={false}
      />,
    );
    expect(wrapper.container.textContent).to.equal("[1,{value:2},[3,4]]");
  });
  it("shows commas between collapsed and expanded array groups", function () {
    const wrapper = render(
      <Index
        src={[1, 2, 3, 4]}
        name={false}
        groupArraysAfterLength={2}
        displayArrayKey={false}
        displayObjectSize={false}
        displayDataTypes={false}
        enableClipboard={false}
      />,
    );
    expect(wrapper.container.textContent).to.equal("[0 - 1],[2 - 3]");
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>(
          ".array-group-brace",
        )[0],
      ),
    );
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>(
          ".array-group-brace",
        )[0],
      ),
    );
    expect(wrapper.container.textContent).to.equal("[1,2],[3,4]");
    wrapper.unmount();
  });
  it("detects circular arrays inside expanded groups", function () {
    const src: unknown[] = [1, 2];
    src.push(src);
    const wrapper = render(
      <Index src={src} groupArraysAfterLength={2} enableClipboard={false} />,
    );
    fireEvent.click(
      required(
        Array.from(
          wrapper.container.querySelectorAll<HTMLElement>(".array-group-brace"),
        ).at(-1),
      ),
    );
    expect(wrapper.container.textContent).to.include("[CIRCULAR REFERENCE]");
    wrapper.unmount();
  });
  it("clears saved display attributes on unmount", function () {
    const setAttribute = sinon.spy(ObjectAttributes, "set");
    try {
      const wrapper = render(
        <Index
          src={{
            value: 1,
          }}
          enableClipboard={false}
        />,
      );
      fireEvent.click(
        required(
          wrapper.container.querySelectorAll<HTMLElement>(".icon-container")[0],
        ),
      );
      const rjvId = required(setAttribute.firstCall).args[0];
      expect(ObjectAttributes.get(rjvId, ["root"], "expanded")).to.equal(false);
      wrapper.unmount();
      expect(ObjectAttributes.get(rjvId, ["root"], "expanded")).to.equal(
        undefined,
      );
    } finally {
      setAttribute.restore();
    }
  });
  it("check data type labels from index", function () {
    const wrapper = render(
      <Index
        src={{
          bool: true,
          str: "test",
          int: 5,
          nan: NaN,
          null: null,
          func: () => {},
          obj: {
            arrChild: [1, 2, "three"],
            objChild: {
              one: 1,
              two: "two",
            },
          },
          arr: [
            [1, "two"],
            {
              one: "one",
              two: 2,
            },
          ],
          regexp: /[0-9]/gi,
        }}
      />,
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".data-type-label"),
    ).to.have.length(14);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".data-type-label"),
    ).to.have.length(14);
  });
  it("check object-size labels from index", function () {
    const _element2 = (
      <Index
        src={{
          bool: true,
          str: "test",
          int: 5,
          nan: NaN,
          null: null,
          func: () => {},
          obj: {
            arrChild: [1, 2, "three"],
            objChild: {
              one: 1,
              two: "two",
            },
          },
          arr: [
            [1, "two"],
            {
              one: "one",
              two: 2,
            },
          ],
          regexp: /[0-9]/gi,
        }}
        displayObjectSize
        displayDataTypes
        enableClipboard={false}
      />
    );
    const wrapper = render(_element2);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".object-size"),
    ).to.have.length(7);
    wrapper.rerender(
      React.cloneElement(_element2, {
        displayObjectSize: false,
      }),
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".object-size"),
    ).to.have.length(0);
  });
  it("src replaced with error message (ERROR OUTPUT EXPECTED)", function () {
    const wrapper = render(
      <Index
        src={"{jsonEncodedString:true, createError:true}" as unknown as object}
      />,
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".data-type-label"),
    ).to.have.length(1);
  });
  it("make sure copy to clipboard is displayed all properties", function () {
    const wrapper = render(
      <Index
        src={{
          test: true,
          passing: "hopefully",
          arr: [5],
          obj: {},
          regexp: /[0-9]/gi,
        }}
      />,
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(
        ".copy-to-clipboard-container",
      ),
    ).to.have.length(7);
  });
  it("renders updated source props", function () {
    const _element3 = (
      <Index
        src={{
          test: true,
        }}
      />
    );
    const wrapper = render(_element3);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".data-type-label"),
    ).to.have.length(1);
    wrapper.rerender(
      React.cloneElement(_element3, {
        src: {
          test1: true,
          test2: false,
        },
      }),
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".data-type-label"),
    ).to.have.length(2);
    wrapper.unmount();
  });
  it("index can have ArrayGroup root component", function () {
    const wrapper = render(
      <Index
        name="test"
        groupArraysAfterLength={5}
        src={Array.from({ length: 15 }).fill(0)}
      />,
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".array-group"),
    ).to.have.length(3);
  });
  it("length is correct even if an object has a length property", function () {
    const wrapper = render(
      <Index
        src={{
          first: "first property",
          second: "second property",
          length: 1000,
        }}
      />,
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".object-size"),
    ).to.have.length(1);
  });
  it("should show commas between elements", function () {
    const wrapper = render(
      <Index
        src={{
          first: "first property",
          second: "second property",
          third: "third property",
        }}
      />,
    );
    // Check that commas are present in the rendered output
    expect(wrapper.container.textContent).to.include(",");
  });
  it("should default to showing commas between elements", function () {
    const wrapper = render(
      <Index
        src={{
          first: "first property",
          second: "second property",
          third: "third property",
        }}
      />,
    );
    // Check that commas are present by default
    expect(wrapper.container.textContent).to.include(",");
  });
});
