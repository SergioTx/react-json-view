import React from "react";
import { render } from "@testing-library/react";
import { expect } from "chai";
import JsonInteger from "./../../../../../src/js/components/DataTypes/Integer";
describe("<JsonInteger />", function () {
  const rjvId = 1;
  it("integer component should have a data type label", function () {
    const wrapper = render(
      <JsonInteger
        value={1}
        displayDataTypes
        rjvId={rjvId}
        theme="rjv-default"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".data-type-label")
    ).to.have.length(1);
  });
  it("integer component should not have a data type label", function () {
    const wrapper = render(
      <JsonInteger
        value={1}
        displayDataTypes={false}
        rjvId={rjvId}
        theme="rjv-default"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".data-type-label")
    ).to.have.length(0);
  });
});
