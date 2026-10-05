import { required } from "../../../testHelpers/requireSources";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { expect } from "chai";
import CopyToClipboard from "./../../../../src/js/components/CopyToClipboard";
function copyToClipboard(src: unknown) {
  const copied: string[] = [];
  const { clipboard } = global.navigator;
  Object.defineProperty(global.navigator, "clipboard", {
    value: {
      writeText: (textToCopy: string) => {
        copied.push(textToCopy);
        return Promise.resolve();
      },
    },
    configurable: true,
  });
  const wrapper = render(
    <CopyToClipboard src={src} namespace={["root"]} theme="rjv-default" />
  );
  try {
    fireEvent.click(
      required(
        required(
          wrapper.container.querySelectorAll<HTMLElement>(
            ".copy-to-clipboard-container"
          )[0]
        ).children[0]
      )
    );
  } finally {
    wrapper.unmount();
    Object.defineProperty(global.navigator, "clipboard", {
      value: clipboard,
      configurable: true,
    });
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
      wrapper.container.querySelectorAll<HTMLElement>(
        ".copy-to-clipboard-container"
      )
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
      wrapper.container.querySelectorAll<HTMLElement>(
        ".copy-to-clipboard-container"
      )
    ).to.have.length(1);
    expect(
      required(
        required(
          wrapper.container.querySelectorAll<HTMLElement>(
            ".copy-to-clipboard-container"
          )[0]
        ).style
      ).display
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
