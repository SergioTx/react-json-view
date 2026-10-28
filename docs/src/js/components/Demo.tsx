import React from 'react';
import type { StylesConfig } from 'react-select';
import ReactSelect from 'react-select';

import type { ReactJsonViewProps, ThemeKeys } from '../../../../index';
import ReactJson from './../../../../src/js/index';

import './../../style/rjv-demo.css';

type DemoOptions = Required<
  Pick<
    ReactJsonViewProps,
    | 'collapsed'
    | 'collapseStringsAfterLength'
    | 'displayObjectSize'
    | 'enableClipboard'
    | 'enablePathNavigation'
    | 'indentWidth'
    | 'displayDataTypes'
    | 'iconStyle'
    | 'flashingUpdates'
  >
> & { theme: ThemeKeys };
type Setting = {
  [Key in keyof DemoOptions]: {
    field: Key;
    label: string;
    values: DemoOptions[Key][];
  };
}[keyof DemoOptions];
type Choice = { value: DemoOptions[keyof DemoOptions]; label: string };
interface SiteTheme {
  color: string;
  bgColor: string;
  borderColor: string;
}

const themeNames: ThemeKeys[] = [
  'apathy',
  'apathy:inverted',
  'ashes',
  'bespin',
  'brewer',
  'bright:inverted',
  'bright',
  'chalk',
  'codeschool',
  'colors',
  'eighties',
  'embers',
  'flat',
  'google',
  'grayscale',
  'grayscale:inverted',
  'greenscreen',
  'harmonic',
  'hopscotch',
  'isotope',
  'marrakesh',
  'mocha',
  'monokai',
  'ocean',
  'paraiso',
  'pop',
  'railscasts',
  'rjv-default',
  'shapeshifter',
  'shapeshifter:inverted',
  'solarized',
  'summerfruit',
  'summerfruit:inverted',
  'threezerotwofour',
  'tomorrow',
  'tube',
  'twilight',
];

const settings: Setting[] = [
  { field: 'theme', label: 'Theme:', values: themeNames },
  {
    field: 'iconStyle',
    label: 'Icon Style:',
    values: ['circle', 'square', 'triangle'],
  },
  {
    field: 'enableClipboard',
    label: 'Enable Clipboard:',
    values: [true, false],
  },
  {
    field: 'enablePathNavigation',
    label: 'Path Navigation:',
    values: [true, false],
  },
  {
    field: 'displayDataTypes',
    label: 'Display Data Types:',
    values: [true, false],
  },
  {
    field: 'displayObjectSize',
    label: 'Display Object Size:',
    values: [true, false],
  },
  {
    field: 'indentWidth',
    label: 'Indent Width:',
    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  { field: 'collapsed', label: 'Collapsed:', values: [true, false, 1, 2] },
  {
    field: 'collapseStringsAfterLength',
    label: 'Collapse Strings After Length:',
    values: [false, 5, 10, 15, 20],
  },
  {
    field: 'flashingUpdates',
    label: 'Flashing Updates:',
    values: [true, false],
  },
];

interface ExampleJson {
  string: string;
  integer: number;
  array: (number | string)[];
  float: number;
  undefined: undefined;
  object: Record<string, boolean | null>;
  string_number: string;
  date: Date;
  live_status?: string;
  live_object?: { id: number; label: string };
}

function getExampleJson(): ExampleJson {
  return {
    string: 'this is a test string',
    integer: 42,
    array: [1, 2, 3, 'test', NaN],
    float: 3.14159,
    undefined,
    object: { 'first-child': true, 'second-child': false, 'last-child': null },
    string_number: '1234',
    date: new Date(),
  };
}

export default function Demo() {
  const [src, setSrc] = React.useState(getExampleJson);
  const [options, setOptions] = React.useState<DemoOptions>({
    theme: 'rjv-default',
    collapsed: false,
    collapseStringsAfterLength: 15,
    displayObjectSize: false,
    enableClipboard: true,
    enablePathNavigation: false,
    indentWidth: 4,
    displayDataTypes: false,
    iconStyle: 'triangle',
    flashingUpdates: true,
  });
  const [siteTheme, setSiteTheme] = React.useState<SiteTheme | null>(null);
  const viewerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!options.flashingUpdates) {
      return;
    }
    const interval = window.setInterval(() => {
      setSrc((previous) => {
        const next: ExampleJson = {
          ...previous,
          integer: Math.floor(Math.random() * 100),
          float: Math.round(Math.random() * 100_000) / 1000,
          array: previous.array.map((item, index) =>
            index === 1 ? Math.floor(Math.random() * 10) : item
          ),
          object: {
            ...previous.object,
            'first-child': Math.random() > 0.5,
          },
          date: new Date(),
        };
        if (previous.array.length < 8 && Math.random() > 0.5) {
          next.array.push(Math.floor(Math.random() * 100));
        } else if (previous.array.length > 3) {
          next.array.pop();
        }
        if ('extra-child' in previous.object) {
          delete next.object['extra-child'];
        } else {
          next.object['extra-child'] = true;
        }
        if (previous.live_status) {
          delete next.live_status;
        } else {
          next.live_status = 'online';
        }
        if (Math.random() > 0.5) {
          delete next.live_object;
        } else {
          next.live_object = {
            id: Math.floor(Math.random() * 1000),
            label: 'new',
          };
        }
        return next;
      });
    }, 2000);
    return () => window.clearInterval(interval);
  }, [options.flashingUpdates]);

  React.useEffect(() => {
    const candidate = viewerRef.current?.querySelector('.react-json-view');
    if (!candidate) {
      return;
    }
    const viewer: Element = candidate;
    function updateStyles() {
      const getStyle = (element: Element, property: string): string =>
        window.getComputedStyle(element).getPropertyValue(property);
      let current: Element | null = viewer;
      let background = 'rgb(255, 255, 255)';
      while (current) {
        const color = getStyle(current, 'background-color');
        if (color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') {
          background = color;
          break;
        }
        current = current.parentElement;
      }
      const nextTheme = {
        color: getStyle(viewer.querySelector('.object-key') || viewer, 'color'),
        bgColor: background,
        borderColor: getStyle(
          viewer.querySelector('.variable-row') || viewer,
          'border-left-color'
        ),
      };
      setSiteTheme((previous) =>
        previous &&
        (['color', 'bgColor', 'borderColor'] as const).every(
          (key) => previous[key] === nextTheme[key]
        )
          ? previous
          : nextTheme
      );
    }
    updateStyles();
    const observer = new window.MutationObserver(updateStyles);
    observer.observe(viewer, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);

  const selectStyles: StylesConfig<Choice, false> = siteTheme
    ? {
        control: (base) => ({
          ...base,
          backgroundColor: siteTheme.bgColor,
          borderColor: siteTheme.borderColor,
          color: siteTheme.color,
        }),
        singleValue: (base) => ({ ...base, color: siteTheme.color }),
        option: (base, { isFocused }) => ({
          ...base,
          backgroundColor: siteTheme.bgColor,
          color: siteTheme.color,
          opacity: isFocused ? 0.8 : 1,
        }),
        menu: (base) => ({ ...base, backgroundColor: siteTheme.bgColor }),
        input: (base) => ({ ...base, color: siteTheme.color }),
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: siteTheme.borderColor,
        }),
        dropdownIndicator: (base) => ({ ...base, color: siteTheme.color }),
      }
    : {};

  return (
    <>
      {siteTheme && (
        <style>{`body { color: ${siteTheme.color}; background-color: ${siteTheme.bgColor}; } .react-json-view { border: 1px solid ${siteTheme.borderColor}; }`}</style>
      )}
      <div className="rjv-demo" ref={viewerRef}>
        <div className="rjv-header">
          <div className="header-1">@sergiotx/react-json-view</div>
        </div>
        <div className="rjv-settings">
          {settings.map(({ field, label, values }) => {
            const choices: Choice[] = values.map((value) => ({
              value,
              label: String(value),
            }));
            return (
              <div className="rjv-input" key={field}>
                <div className="rjv-label">{label}</div>
                <ReactSelect<Choice, false>
                  name={field}
                  value={
                    choices.find((choice) => choice.value === options[field]) ??
                    null
                  }
                  options={choices}
                  styles={selectStyles}
                  onChange={(choice) => {
                    if (!choice) {
                      return;
                    }
                    setOptions((previous) => ({
                      ...previous,
                      [field]: choice.value,
                    }));
                  }}
                />
              </div>
            );
          })}
        </div>
        <ReactJson
          style={{ padding: '10px', borderRadius: '3px', margin: '10px 0px' }}
          src={src}
          {...options}
        />
      </div>
    </>
  );
}
