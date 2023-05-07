import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as iconSet from "@fortawesome/free-solid-svg-icons";

import { theme } from './theme';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderCSSValue(cssPropName, cssPropValue) {
  if (cssPropName.includes('horizontal')) {
    return `
      ${cssPropName.replace('horizontal', 'left')}: ${cssPropValue};
      ${cssPropName.replace('horizontal', 'right')}: ${cssPropValue};
    `;
  }
  if (cssPropName.includes('vertical')) {
    return `
      ${cssPropName.replace('vertical', 'top')}: ${cssPropValue};
      ${cssPropName.replace('vertical', 'bottom')}: ${cssPropValue};
    `;
  }

  return cssPropName + ':' + cssPropValue + ';';
}
function renderCSS(props, currentBreakpoint) {
  if (!props) return '';

  return Object
    .keys(props)
    .map((prop) => {
      const cssPropName = prop.split(/(?=[A-Z])/).join('-').toLowerCase();
      const cssPropValue = props[prop];
      const isCssPropValueAnObject = Object.prototype.toString.call(cssPropValue) === '[object Object]';
      const currentCssPropValue = cssPropValue[currentBreakpoint];

      if (currentBreakpoint == 'xs' && !isCssPropValueAnObject) {
        return renderCSSValue(cssPropName, cssPropValue);
      }

      if (currentCssPropValue) {
        return renderCSSValue(cssPropName, currentCssPropValue);
      }
    }).filter(Boolean).join('');
}

export const Box = React.forwardRef(({
  as,
  stylesheet: { focus, hover, srOnly, ...stylesheet },
  ...props
}, ref) => {
  const Tag = as || 'div';

  return (
    <React.Fragment>
      <Tag ref={ref} {...props} className={`${props.className ? props.className : ''} ${srOnly ? 'sr-only' : ''}`} />
      <style jsx>{`
        ${Tag} {
          ${renderCSS(stylesheet, 'xs')};
        }
        ${Tag}:hover {
          ${renderCSS(hover, 'xs')};
        }
        ${Tag}:focus {
          ${renderCSS(focus, 'xs')};
        }
        @media screen and (min-width: ${theme.breakpoints['Breakpoints.sm']}px) {
          ${Tag} {
            ${renderCSS(stylesheet, 'sm')};
          }
          ${Tag}:hover {
            ${renderCSS(hover, 'sm')};
          }
          ${Tag}:focus {
            ${renderCSS(focus, 'sm')};
          }
        }
        @media screen and (min-width: ${theme.breakpoints['Breakpoints.md']}px) {
          ${Tag} {
            ${renderCSS(stylesheet, 'md')};
          }
          ${Tag}:hover {
            ${renderCSS(hover, 'md')};
          }
          ${Tag}:focus {
            ${renderCSS(focus, 'md')};
          }
        }
        @media screen and (min-width: ${theme.breakpoints['Breakpoints.lg']}px) {
          ${Tag} {
            ${renderCSS(stylesheet, 'lg')};
          }
          ${Tag}:hover {
            ${renderCSS(hover, 'lg')};
          }
          ${Tag}:focus {
            ${renderCSS(focus, 'lg')};
          }
        }
        @media screen and (min-width: ${theme.breakpoints['Breakpoints.xl']}px) {
          ${Tag} {
            ${renderCSS(stylesheet, 'xl')};
          }
          ${Tag}:hover {
            ${renderCSS(hover, 'xl')};
          }
          ${Tag}:focus {
            ${renderCSS(focus, 'xl')};
          }
        }
      `}</style>
    </React.Fragment>
  )
});

Box.defaultProps = {
  stylesheet: {},
};

export function Icon({
  as,
  stylesheet: initialstylesheet,
  ...props
  }) {
  const Tag = 'svg';
  const {
    iconVariant,
    hover,
    focus,
    ...reststylesheet
  } = initialstylesheet;
  const stylesheet = {
      width: '1.5ch',
      height: '1.5ch',
      ...reststylesheet
  };

  return (
    <React.Fragment>
      <Box stylesheet={stylesheet}>
        <FontAwesomeIcon
          icon={iconSet[`fa${capitalize(iconVariant)}`]}
          crossOrigin="anonymous"
          {...props}
        />
      </Box>
    </React.Fragment>
  )
}

export const Text = React.forwardRef(({ as, stylesheet, ...props }, ref) => {
  const {
    textVariant = {
      fontSize: 'inherit',
    },
    ...reststylesheet
  } = stylesheet;
  const stylesheetUpdated = { ...textVariant, ...reststylesheet };
  const tag = as || 'span';
  return (
    <Box
      ref={ref}
      as={tag}
      stylesheet={stylesheetUpdated}
      {...props}
    />
  )
});
Text.defaultProps = {
  stylesheet: {},
};

export function Image({ as, ...props }) {
  const tag = 'img';
  const {
    children,
    dangerouslySetInnerHTML,
    ...imageProps
  } = props;


  return (
    <Box as={tag} {...imageProps} />
  );
}
Image.defaultProps = {
  stylesheet: {},
};


export function Input({ as, stylesheet, ...props }) {
  const tag = 'input';
  const finalstylesheet = {
    transition: 'all 0.2s ease-in-out',
    outline: 0,
    textVariant: theme.typography.variants.body2,
    color: theme.colors.neutral[900],
    boxShadow: `0 5px 7px -5px ${theme.colors.neutral[999]}43`,
    display: 'block',
    width: theme.space["x1/1"],
    border: `1px solid ${theme.colors.neutral[300]}`,
    borderRadius: theme.space.x2,
    paddingHorizontal: theme.space.x5,
    paddingVertical: theme.space.x3,
    focus: {
      border: `1px solid ${theme.colors.primary[500]}`,
      boxShadow: `0 5px 10px -5px ${theme.colors.neutral[999]}43`,
    },
    ...stylesheet,
  };
  

  return (
    <Text as={tag} stylesheet={finalstylesheet} {...props} />
  );
}
Input.defaultProps = {
  stylesheet: {},
};

export function Button({ as, stylesheet, ...props }) {
  const {
    buttonVariant = 'primary',
    ...reststylesheet
  } = stylesheet;
  const tag = 'button';

  const finalstylesheet = {
    cursor: 'pointer',
    textVariant: theme.typography.variants.body2,
    color: theme.colors.neutral["000"],
    boxShadow: `0 5px 7px -5px ${theme.colors.neutral["999"]}43`,
    display: 'block',
    outline: 0,
    width: theme.space["x1/1"],
    border: `${theme.space.xpx} solid ${theme.colors[buttonVariant][900]}`,
    borderRadius: theme.space.x2,
    paddingHorizontal: {
      xs: theme.space.x5,
      sm: theme.space.x10
    },
    paddingVertical: theme.space.x3,
    transition: 'all 0.2s ease-in-out',
    backgroundColor: theme.colors[buttonVariant][600],
    hover: {
      backgroundColor: theme.colors[buttonVariant][500],
      boxShadow: `0 5px 10px -5px ${theme.colors.neutral[999]}73`,
    },
    focus: {
      backgroundColor: theme.colors[buttonVariant][700],
      boxShadow: `0 5px 10px -5px ${theme.colors.neutral[999]}93`,
    },
    ...reststylesheet,
  };
  

  return (
    <Text as={tag} stylesheet={finalstylesheet} {...props} />
  );
}
Button.defaultProps = {
  stylesheet: {},
};