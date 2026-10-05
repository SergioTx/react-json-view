import { required } from "../../../../testHelpers/requireSources";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { expect } from "chai";
import JsonFunction from "./../../../../../src/js/components/DataTypes/Function";
import AttributeStore from "./../../../../../src/js/stores/ObjectAttributes";
describe("<JsonFunction />", function () {
  const rjvId = 1;
  it("function component should have a data type label", function () {
    const wrapper = render(
      <JsonFunction
        value={function () {}}
        rjvId={rjvId}
        displayDataTypes
        theme="rjv-default"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".data-type-label")
    ).to.have.length(1);
  });
  it("function component should not have a data type label", function () {
    const wrapper = render(
      <JsonFunction
        value={function () {}}
        rjvId={rjvId}
        displayDataTypes={false}
        theme="rjv-default"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".data-type-label")
    ).to.have.length(0);
  });
  it("function component expanded", function () {
    AttributeStore.set(rjvId, "function-test", "collapsed", false);
    const wrapper = render(
      <JsonFunction
        value={function () {}}
        namespace="function-test"
        rjvId={rjvId}
        displayDataTypes
        theme="rjv-default"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".function-collapsed")
    ).to.have.length(0);
  });
  it("function component collapsed", function () {
    AttributeStore.set(rjvId, "function-test", "collapsed", true);
    const wrapper = render(
      <JsonFunction
        value={function () {}}
        namespace="function-test"
        rjvId={rjvId}
        displayDataTypes
        theme="rjv-default"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".function-collapsed")
    ).to.have.length(1);
  });
  it("function component click to expand", function () {
    AttributeStore.set(rjvId, "function-test", "collapsed", true);
    const wrapper = render(
      <JsonFunction
        value={function () {}}
        namespace="function-test"
        rjvId={rjvId}
        displayDataTypes
        theme="rjv-default"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".function-collapsed")
    ).to.have.length(1);
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>(
          ".rjv-function-container"
        )[0]
      )
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".function-collapsed")
    ).to.have.length(0);
  });
});
