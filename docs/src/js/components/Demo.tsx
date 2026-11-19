import React from 'react';
import ReactSelect from 'react-select';

import type { ReactJsonViewProps, ThemeObject } from '../../../../index';
import ReactJson from './../../../../src/js/index';
import { rjvDefault } from './../../../../src/js/themes/base16/rjv-themes';
import * as themes from './../../../../src/themes';

import './../../style/rjv-demo.css';

type DemoOptions = Required<
  Pick<
    ReactJsonViewProps,
    | 'collapsed'
    | 'collapseStringsAfterLength'
    | 'displayObjectSize'
    | 'enableCollapse'
    | 'enableClipboard'
    | 'enablePathNavigation'
    | 'indentWidth'
    | 'displayDataTypes'
    | 'hideVerticalLines'
    | 'iconStyle'
    | 'flashingUpdates'
  >
> & { theme: string };
type Setting = {
  [Key in keyof DemoOptions]: {
    field: Key;
    label: string;
    values: DemoOptions[Key][];
  };
}[keyof DemoOptions];
type Choice = { value: DemoOptions[keyof DemoOptions]; label: string };

const { invertBase16Theme, ...palettes } = themes;
const demoThemes = new Map<string, ThemeObject>([
  ['rjv-default', rjvDefault],
  ...Object.entries(palettes),
]);
for (const name of [
  'apathy',
  'bright',
  'grayscale',
  'shapeshifter',
  'summerfruit',
] as const) {
  demoThemes.set(`${name}:inverted`, invertBase16Theme(palettes[name]));
}
const themeNames = [...demoThemes.keys()].sort();

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
    field: 'hideVerticalLines',
    label: 'Hide Vertical Lines:',
    values: [true, false],
  },
  {
    field: 'indentWidth',
    label: 'Indent Width:',
    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  { field: 'enableCollapse', label: 'Enable Collapse:', values: [true, false] },
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

interface FlashableExample {
  integer: number;
  array: unknown[];
  float: number;
  object: Record<string, unknown>;
  date?: Date | string;
  live_status?: string;
  live_object?: { id: number; label: string };
}

interface ExampleJson extends FlashableExample {
  string: string;
  undefined: undefined;
  string_number: string;
  date: Date;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFlashableExample(value: object): value is FlashableExample {
  return (
    isRecord(value) &&
    typeof value.integer === 'number' &&
    typeof value.float === 'number' &&
    Array.isArray(value.array) &&
    isRecord(value.object)
  );
}

function updateJsonRecord(
  value: Record<string, unknown>
): Record<string, unknown> {
  const firstKey = Object.keys(value)[0];
  if (firstKey === undefined) {
    return { demoValue: 1 };
  }
  return { ...value, [firstKey]: updateJsonValue(value[firstKey]) };
}

function updateJsonValue(value: unknown): unknown {
  if (typeof value === 'boolean') {
    return !value;
  }
  if (typeof value === 'number') {
    return value + 1;
  }
  if (typeof value === 'string') {
    return value.endsWith('!') ? value.slice(0, -1) : `${value}!`;
  }
  if (value === null) {
    return true;
  }
  if (Array.isArray(value) || isRecord(value)) {
    return updateJsonSource(value);
  }
  return true;
}

function updateJsonSource(value: object): object {
  if (Array.isArray(value)) {
    const items: unknown[] = value;
    return items.length === 0
      ? [1]
      : [updateJsonValue(items[0]), ...items.slice(1)];
  }
  return updateJsonRecord(value as Record<string, unknown>);
}

export default function Demo() {
  const settingsId = React.useId();
  const [src, setSrc] = React.useState<object>(getExampleJson);
  const [jsonInput, setJsonInput] = React.useState(
    () => JSON.stringify(src) ?? ''
  );
  const [jsonError, setJsonError] = React.useState<string | null>(null);
  const pendingEdit = React.useRef(false);
  const [options, setOptions] = React.useState<DemoOptions>({
    theme: 'rjv-default',
    enableCollapse: true,
    collapsed: false,
    collapseStringsAfterLength: false,
    displayObjectSize: false,
    enableClipboard: true,
    enablePathNavigation: false,
    indentWidth: 4,
    displayDataTypes: false,
    hideVerticalLines: false,
    iconStyle: 'triangle',
    flashingUpdates: false,
  });
  const palette = demoThemes.get(options.theme) ?? rjvDefault;
  const [previousJsonSync, setPreviousJsonSync] = React.useState({
    src,
    flashingUpdates: options.flashingUpdates,
  });

  if (
    previousJsonSync.src !== src ||
    previousJsonSync.flashingUpdates !== options.flashingUpdates
  ) {
    setPreviousJsonSync({ src, flashingUpdates: options.flashingUpdates });
    if (options.flashingUpdates) {
      setJsonInput(JSON.stringify(src) ?? '');
      setJsonError(null);
    }
  }

  React.useEffect(() => {
    if (!options.flashingUpdates) {
      return;
    }
    function tick() {
      setSrc((previous) => {
        if (!isFlashableExample(previous)) {
          return updateJsonSource(previous);
        }
        const next: FlashableExample = {
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
    }
    let interval: number | undefined;
    function syncVisibility() {
      window.clearInterval(interval);
      if (!document.hidden) {
        interval = window.setInterval(tick, 2000);
      }
    }
    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, [options.flashingUpdates]);

  React.useEffect(() => {
    if (options.flashingUpdates) {
      pendingEdit.current = false;
      return;
    }
    if (!pendingEdit.current) {
      return;
    }
    const timer = window.setTimeout(() => {
      pendingEdit.current = false;
      try {
        const parsed: unknown = JSON.parse(jsonInput);
        if (Array.isArray(parsed) || isRecord(parsed)) {
          React.startTransition(() => setSrc(parsed));
          setJsonError(null);
        } else {
          setJsonError('The top-level JSON value must be an object or array.');
        }
      } catch (error) {
        setJsonError(error instanceof Error ? error.message : 'Invalid JSON.');
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [jsonInput, options.flashingUpdates]);

  return (
    <main className="rjv-demo">
      <header className="rjv-header">
        <h1 className="header-1">@sergiotx/react-json-view</h1>
      </header>
      <div className="rjv-settings">
        {settings.map(({ field, label, values }) => {
          const inputId = `${settingsId}-${field}`;
          const choices: Choice[] = values.map((value) => ({
            value,
            label: String(value),
          }));
          return (
            <div className="rjv-input" key={field}>
              <label className="rjv-label" htmlFor={inputId}>
                {label}
              </label>
              <ReactSelect<Choice, false>
                inputId={inputId}
                name={field}
                value={
                  choices.find((choice) => choice.value === options[field]) ??
                  null
                }
                options={choices}
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
      <div className="rjv-json-source">
        <label className="rjv-label" htmlFor="rjv-json-source-input">
          JSON source:
        </label>
        <textarea
          id="rjv-json-source-input"
          rows={3}
          value={jsonInput}
          disabled={options.flashingUpdates}
          aria-invalid={Boolean(jsonError)}
          aria-describedby={jsonError ? 'rjv-json-source-error' : undefined}
          onChange={(event) => {
            pendingEdit.current = true;
            setJsonInput(event.currentTarget.value);
            setJsonError(null);
          }}
        />
        {jsonError && (
          <output className="rjv-json-error" id="rjv-json-source-error">
            {jsonError}
          </output>
        )}
      </div>
      <ReactJson
        style={{
          padding: '10px',
          borderRadius: '3px',
          margin: '10px 0px',
          border: `1px solid ${palette.base02}`,
        }}
        src={src}
        {...options}
        theme={palette}
      />
    </main>
  );
}
