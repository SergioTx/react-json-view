import React from "react";
import { render } from "@testing-library/react";
import { expect } from "chai";
import JsonDate from "./../../../../../src/js/components/DataTypes/Date";
describe("<JsonDate />", function () {
  const rjvId = 1;
  it("date component should have a data type label", function () {
    const wrapper = render(
      <JsonDate
        value={new Date()}
        displayDataTypes
        rjvId={rjvId}
        theme="rjv-default"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".data-type-label")
    ).to.have.length(1);
  });
  it("date component should not have a data type label", function () {
    const wrapper = render(
      <JsonDate
        value={new Date()}
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
