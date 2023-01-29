/**
 * Stores a bunch of functions to define callback types and other stuff.
 */


/**
 * Shortcut for defining react component
 * @template P
 * @typedef {React.FunctionComponent<React.PropsWithChildren<P>>} ReactFunctionComponent<P>
 */


/**
 * Defines a react component with children
 * @constructor
 * @template P
 * @param {React.FunctionComponent<React.PropsWithChildren<P>>} component
 * @return {React.FunctionComponent<React.PropsWithChildren<P>>}
 */
export function defComponent(component) {
    return component
}
