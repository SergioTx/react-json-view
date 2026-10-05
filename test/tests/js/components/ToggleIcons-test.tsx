import { required } from "../../../testHelpers/requireSources";
import React from "react";
import { render } from "@testing-library/react";
import { expect } from "chai";
import {
  ExpandedIcon,
  CollapsedIcon,
} from "./../../../../src/js/components/ToggleIcons";
import {
  CircleMinus,
  CirclePlus,
  SquareMinus,
  SquarePlus,
  ArrowRight,
  ArrowDown,
} from "./../../../../src/js/components/icons";
describe("<ToggleIcons />", function () {
  it("ExpandedIcon mount", function () {
    const wrapper = render(<ExpandedIcon theme="rjv-default" />);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".expanded-icon")
    ).to.have.length(1);
  });
  it("CollapsedIcon mount", function () {
    const wrapper = render(<CollapsedIcon theme="rjv-default" />);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(".collapsed-icon")
    ).to.have.length(1);
  });
  it("ExpandedIcon with triangle style", function () {
    const wrapper = render(
      <ExpandedIcon theme="rjv-default" iconStyle="triangle" />
    );
    expect(
      required(
        wrapper.container.querySelector<SVGElement>("path")
      ).getAttribute("d")
    ).to.equal(
      required(
        render(<ArrowDown />).container.querySelector<SVGElement>("path")
      ).getAttribute("d")
    );
  });
  it("ExpandedIcon with square style", function () {
    const wrapper = render(
      <ExpandedIcon theme="rjv-default" iconStyle="square" />
    );
    expect(
      required(
        wrapper.container.querySelector<SVGElement>("path")
      ).getAttribute("d")
    ).to.equal(
      required(
        render(<SquareMinus />).container.querySelector<SVGElement>("path")
      ).getAttribute("d")
    );
  });
  it("ExpandedIcon with no style", function () {
    const wrapper = render(<ExpandedIcon theme="rjv-default" />);
    expect(
      required(
        wrapper.container.querySelector<SVGElement>("path")
      ).getAttribute("d")
    ).to.equal(
      required(
        render(<CircleMinus />).container.querySelector<SVGElement>("path")
      ).getAttribute("d")
    );
  });
  it("CollapsedIcon with triangle style", function () {
    const wrapper = render(
      <CollapsedIcon theme="rjv-default" iconStyle="triangle" />
    );
    expect(
      required(
        wrapper.container.querySelector<SVGElement>("path")
      ).getAttribute("d")
    ).to.equal(
      required(
        render(<ArrowRight />).container.querySelector<SVGElement>("path")
      ).getAttribute("d")
    );
  });
  it("CollapsedIcon with square style", function () {
    const wrapper = render(
      <CollapsedIcon theme="rjv-default" iconStyle="square" />
    );
    expect(
      required(
        wrapper.container.querySelector<SVGElement>("path")
      ).getAttribute("d")
    ).to.equal(
      required(
        render(<SquarePlus />).container.querySelector<SVGElement>("path")
      ).getAttribute("d")
    );
  });
  it("CollapsedIcon with no style", function () {
    const wrapper = render(<CollapsedIcon theme="rjv-default" />);
    expect(
      required(
        wrapper.container.querySelector<SVGElement>("path")
      ).getAttribute("d")
    ).to.equal(
      required(
        render(<CirclePlus />).container.querySelector<SVGElement>("path")
      ).getAttribute("d")
    );
  });
});
