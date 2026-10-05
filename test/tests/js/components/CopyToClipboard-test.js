import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { expect } from "chai";
import CopyToClipboard from "./../../../../src/js/components/CopyToClipboard";
function copyToClipboard(src) {
  const copied = [];
  const { clipboard } = global.navigator;
  global.navigator.clipboard = {
    writeText: (textToCopy) => {
      copied.push(textToCopy);
      return Promise.resolve();
    },
  };
  const wrapper = render(
    <CopyToClipboard src={src} namespace={["root"]} theme="rjv-default" />
  );
  try {
    fireEvent.click(
      wrapper.container.querySelectorAll(".copy-to-clipboard-container")[0]
        .children[0]
    );
  } finally {
    wrapper.unmount();
    global.navigator.clipboard = clipboard;
  }
  return copied;
}
describe("<CopyToClipboard />", function () {
  it("CopyToClipboard clipboard should exist", function () {
    const wrapper = render(
      <CopyToClipboard
        src={{
          test: true,
        }}
        theme="rjv-default"
        clickCallback
      />
    );
    expect(
      wrapper.container.querySelectorAll(".copy-to-clipboard-container")
    ).to.have.length(1);
    wrapper.unmount();
  });
  it("CopyToClipboard clipboard should be hidden", function () {
    const wrapper = render(
      <CopyToClipboard
        src={{
          test: true,
        }}
        theme="rjv-default"
        clickCallback
        rowHovered={false}
      />
    );
    expect(
      wrapper.container.querySelectorAll(".copy-to-clipboard-container")
    ).to.have.length(1);
    expect(
      wrapper.container.querySelectorAll(".copy-to-clipboard-container")[0]
        .style.display
    ).to.equal("none");
    wrapper.unmount();
  });
  it("CopyToClipboard copies a string without quotes", function () {
    expect(copyToClipboard("a string")).to.deep.equal(["a string"]);
  });
  it("CopyToClipboard copies an object as JSON", function () {
    expect(
      copyToClipboard({
        test: true,
      })
    ).to.deep.equal([
      JSON.stringify(
        {
          test: true,
        },
        null,
        "  "
      ),
    ]);
  });
  it("CopyToClipboard copies an array as JSON", function () {
    expect(copyToClipboard(["a string", 1])).to.deep.equal([
      JSON.stringify(["a string", 1], null, "  "),
    ]);
  });
  it("CopyToClipboard copies a number as JSON", function () {
    expect(copyToClipboard(1)).to.deep.equal(["1"]);
  });
  it("CopyToClipboard copies a boolean as JSON", function () {
    expect(copyToClipboard(true)).to.deep.equal(["true"]);
  });
  it("CopyToClipboard copies null as JSON", function () {
    expect(copyToClipboard(null)).to.deep.equal(["null"]);
  });
  it("CopyToClipboard copies a function as source text", function () {
    const noop = function () {};
    expect(copyToClipboard(noop)).to.deep.equal([noop.toString()]);
  });
  it("CopyToClipboard copies a regexp as source text", function () {
    expect(copyToClipboard(/pattern/g)).to.deep.equal(["/pattern/g"]);
  });
});
