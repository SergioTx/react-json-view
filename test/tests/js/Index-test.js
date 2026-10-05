import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { expect } from "chai";
import sinon from "sinon";
import Index from "./../../../src/js/index";
import ObjectAttributes from "./../../../src/js/stores/ObjectAttributes";
describe("<Index />", function () {
  it("supports expansion and source updates in Strict Mode", function () {
    const wrapper = render(
      <React.StrictMode>
        <Index src={{ value: 1 }} enableClipboard={false} />
      </React.StrictMode>
    );
    expect(wrapper.container.querySelectorAll(".variable-row")).to.have.length(
      1
    );
    fireEvent.click(wrapper.container.querySelector(".icon-container"));
    expect(wrapper.container.querySelectorAll(".variable-row")).to.have.length(
      0
    );
    fireEvent.click(wrapper.container.querySelector(".icon-container"));
    wrapper.rerender(
      <React.StrictMode>
        <Index src={{ value: 2, other: true }} enableClipboard={false} />
      </React.StrictMode>
    );
    expect(wrapper.container.querySelectorAll(".variable-row")).to.have.length(
      2
    );
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
      />
    );
    fireEvent.click(wrapper.container.querySelectorAll(".icon-container")[1]);
    expect(wrapper.container.querySelectorAll(".variable-row")).to.have.length(
      0
    );
    fireEvent.click(wrapper.container.querySelectorAll(".icon-container")[0]);
    fireEvent.click(wrapper.container.querySelectorAll(".icon-container")[0]);
    expect(wrapper.container.querySelectorAll(".node-ellipsis")).to.have.length(
      1
    );
    expect(wrapper.container.querySelectorAll(".variable-row")).to.have.length(
      0
    );
    fireEvent.click(wrapper.container.querySelectorAll(".icon-container")[1]);
    expect(wrapper.container.querySelectorAll(".variable-row")).to.have.length(
      1
    );
    wrapper.unmount();
  });
  it("recomputes ancestors when the source changes", function () {
    const previous = {
      value: 1,
    };
    const next = {
      previous,
    };
    next.self = next;
    let _element = <Index src={previous} enableClipboard={false} />;
    const wrapper = render(_element);
    wrapper.rerender(
      (_element = React.cloneElement(_element, {
        src: next,
      }))
    );
    expect(
      wrapper.container.textContent.split("[CIRCULAR REFERENCE]")
    ).to.have.length(2);
    expect(
      wrapper.container.querySelectorAll(".variable-value")[0].textContent
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
      />
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
      />
    );
    expect(wrapper.container.textContent).to.equal("[0 - 1],[2 - 3]");
    fireEvent.click(
      wrapper.container.querySelectorAll(".array-group-brace")[0]
    );
    fireEvent.click(
      wrapper.container.querySelectorAll(".array-group-brace")[0]
    );
    expect(wrapper.container.textContent).to.equal("[1,2],[3,4]");
    wrapper.unmount();
  });
  it("detects circular arrays inside expanded groups", function () {
    const src = [1, 2];
    src.push(src);
    const wrapper = render(
      <Index src={src} groupArraysAfterLength={2} enableClipboard={false} />
    );
    fireEvent.click(
      Array.from(wrapper.container.querySelectorAll(".array-group-brace")).at(
        -1
      )
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
        />
      );
      fireEvent.click(wrapper.container.querySelectorAll(".icon-container")[0]);
      const rjvId = setAttribute.firstCall.args[0];
      expect(ObjectAttributes.get(rjvId, ["root"], "expanded")).to.equal(false);
      wrapper.unmount();
      expect(ObjectAttributes.get(rjvId, ["root"], "expanded")).to.equal(
        undefined
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
          func: (test) => {},
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
      />
    );
    expect(
      wrapper.container.querySelectorAll(".data-type-label")
    ).to.have.length(14);
    expect(
      wrapper.container.querySelectorAll(".data-type-label")
    ).to.have.length(14);
  });
  it("check object-size labels from index", function () {
    let _element2 = (
      <Index
        src={{
          bool: true,
          str: "test",
          int: 5,
          nan: NaN,
          null: null,
          func: (test) => {},
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
    expect(wrapper.container.querySelectorAll(".object-size")).to.have.length(
      7
    );
    wrapper.rerender(
      (_element2 = React.cloneElement(_element2, {
        displayObjectSize: false,
      }))
    );
    expect(wrapper.container.querySelectorAll(".object-size")).to.have.length(
      0
    );
  });
  it("src replaced with error message (ERROR OUTPUT EXPECTED)", function () {
    const wrapper = render(
      <Index src="{jsonEncodedString:true, createError:true}" />
    );
    expect(
      wrapper.container.querySelectorAll(".data-type-label")
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
      />
    );
    expect(
      wrapper.container.querySelectorAll(".copy-to-clipboard-container")
    ).to.have.length(7);
  });
  it("renders updated source props", function () {
    let _element3 = (
      <Index
        src={{
          test: true,
        }}
      />
    );
    const wrapper = render(_element3);
    expect(
      wrapper.container.querySelectorAll(".data-type-label")
    ).to.have.length(1);
    wrapper.rerender(
      (_element3 = React.cloneElement(_element3, {
        src: {
          test1: true,
          test2: false,
        },
      }))
    );
    expect(
      wrapper.container.querySelectorAll(".data-type-label")
    ).to.have.length(2);
    wrapper.unmount();
  });
  it("index can have ArrayGroup root component", function () {
    const wrapper = render(
      <Index
        name="test"
        groupArraysAfterLength={5}
        src={new Array(15).fill(0)}
      />
    );
    expect(wrapper.container.querySelectorAll(".array-group")).to.have.length(
      3
    );
  });
  it("length is correct even if an object has a length property", function () {
    const wrapper = render(
      <Index
        src={{
          first: "first property",
          second: "second property",
          length: 1000,
        }}
      />
    );
    expect(wrapper.container.querySelectorAll(".object-size")).to.have.length(
      1
    );
  });
  it("should show commas between elements", function () {
    const wrapper = render(
      <Index
        src={{
          first: "first property",
          second: "second property",
          third: "third property",
        }}
      />
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
      />
    );
    // Check that commas are present by default
    expect(wrapper.container.textContent).to.include(",");
  });
});
