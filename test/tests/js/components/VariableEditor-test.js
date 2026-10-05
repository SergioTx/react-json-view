import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { expect } from "chai";
import VariableEditor from "./../../../../src/js/components/VariableEditor";
describe("<VariableEditor />", function () {
  function getVariable(props = {}) {
    return (
      <VariableEditor
        variable={{
          name: "test",
          value: true,
          type: "boolean",
        }}
        theme="rjv-default"
        namespace={["root"]}
        type="object"
        indentWidth={4}
        singleIndent={5}
        quotesOnKeys
        displayDataTypes
        {...props}
      />
    );
  }
  it("renders a read-only value and its key", function () {
    const wrapper = render(getVariable());
    expect(
      wrapper.container.querySelectorAll(".object-key")[0].textContent
    ).to.equal('"test"');
    expect(
      wrapper.container.querySelectorAll(".variable-value")[0].textContent
    ).to.equal("booltrue");
    expect(wrapper.container.querySelectorAll("textarea")).to.have.length(0);
    fireEvent.click(wrapper.container.querySelectorAll(".variable-value")[0]);
    expect(
      wrapper.container.querySelectorAll(".variable-value")[0].textContent
    ).to.equal("booltrue");
    wrapper.unmount();
  });
  it("shows a comma between values but not after the last value", function () {
    let _element = getVariable({
      isLast: false,
    });
    const wrapper = render(_element);
    expect(wrapper.container.textContent).to.include(",");
    wrapper.rerender(
      (_element = React.cloneElement(_element, {
        isLast: true,
      }))
    );
    expect(wrapper.container.textContent).not.to.include(",");
    wrapper.unmount();
  });
  it("shows clipboard controls only while hovered", function () {
    const wrapper = render(
      getVariable({
        enableClipboard: true,
      })
    );
    expect(
      wrapper.container.querySelectorAll(".copy-to-clipboard-container")[0]
        .style.display
    ).to.equal("none");
    fireEvent.mouseEnter(
      wrapper.container.querySelectorAll(".variable-row")[0]
    );
    expect(
      wrapper.container.querySelectorAll(".copy-to-clipboard-container")[0]
        .style.display
    ).to.equal("inline-block");
    fireEvent.mouseLeave(
      wrapper.container.querySelectorAll(".variable-row")[0]
    );
    expect(
      wrapper.container.querySelectorAll(".copy-to-clipboard-container")[0]
        .style.display
    ).to.equal("none");
    wrapper.unmount();
  });
});
