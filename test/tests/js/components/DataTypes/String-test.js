import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { expect } from "chai";
import JsonString from "./../../../../../src/js/components/DataTypes/String";
describe("<JsonString />", function () {
  it("string component should have a data type label", function () {
    const wrapper = render(
      <JsonString value="test" displayDataTypes theme="rjv-default" />
    );
    expect(
      wrapper.container.querySelectorAll(".data-type-label")
    ).to.have.length(1);
  });
  it("string with hidden data type", function () {
    const props = {
      value: "test",
      theme: "rjv-default",
      displayDataTypes: false,
    };
    const component = render(<JsonString {...props} />);
    expect(
      component.container.querySelectorAll(".data-type-label")
    ).to.have.length(0);
  });

  // test collapsed string and expand click
  it("string displaying data type", function () {
    const props = {
      value: "test",
      displayDataTypes: false,
      theme: "rjv-default",
    };
    const component = render(<JsonString {...props} />);
    expect(
      component.container.querySelectorAll(".data-type-label")
    ).to.have.length(0);
  });
  it("collapsed string content", function () {
    const props = {
      value: "123456789",
      collapseStringsAfterLength: 3,
      displayDataTypes: false,
      theme: "rjv-default",
    };
    const component = render(<JsonString {...props} />);
    expect(
      component.container.querySelectorAll(".string-value")[0].textContent
    ).to.equal('"123 ..."');
    fireEvent.click(component.container.querySelectorAll(".string-value")[0]);
    expect(
      component.container.querySelectorAll(".string-value")[0].textContent
    ).to.equal('"123456789"');
  });
  it("string with special escape sequences", function () {
    const props = {
      value: "\\\n\t\r\f\\n",
      displayDataTypes: false,
      escapeStrings: true,
      theme: "rjv-default",
    };
    const component = render(<JsonString {...props} />);
    expect(
      component.container.querySelectorAll(".string-value")[0].textContent
    ).to.equal('"\\\\\\n\\t\\r\\f\\\\n"');
  });
  it("string with special escape sequences is not escaped", function () {
    const props = {
      value: "\\\n\t\r\f\\n",
      displayDataTypes: false,
      escapeStrings: false,
      theme: "rjv-default",
    };
    const component = render(<JsonString {...props} />);
    expect(
      component.container.querySelectorAll(".string-value")[0].textContent
    ).to.equal('"' + props.value + '"');
  });
});
